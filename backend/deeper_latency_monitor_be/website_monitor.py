import time
from concurrent.futures import Future, ThreadPoolExecutor
from datetime import datetime
from logging import getLogger
from threading import Event

from sqlalchemy.orm import Session

from . import handlers, models, os_utils, schemas
from .handlers import history as history_handlers

logger = getLogger('uvicorn.website_monitor')


def website_monitor_manager(db: Session, stop_event: Event):
    logger.info('Starting website monitor')

    with ThreadPoolExecutor(max_workers=10) as executor:
        tasks: dict[int, tuple[Future, Event]] = {}

        while not stop_event.is_set():
            monitored_websites = db.query(models.MonitoredWebsites).all()
            db.refresh(monitored_websites)

            for website in monitored_websites:
                match website.is_active:
                    case True if website.id not in tasks:
                        # create tasks for newly added websites
                        stop_event_ = Event()
                        fut = executor.submit(website_monitor,
                                              db=db,
                                              website=website,
                                              stop_event=stop_event_)
                        tasks[website.id] = (fut, stop_event_)

                    case False if website.id in tasks:
                        # remove tasks for inactive websites
                        fut, stop_event_ = tasks.pop(website.id)
                        stop_event_.set()

            time.sleep(0)

        # stop all tasks
        for fut, stop_event_ in tasks.values():
            stop_event_.set()


def website_monitor(db: Session,
                    website: models.MonitoredWebsites,
                    stop_event: Event):
    logger.info('Started monitoring %s', website.url)

    while not stop_event.is_set():
        # ping website and update latency
        logger.debug('Pinging %s', website.url)
        latency_ms = os_utils.ping_website(website.url)
        logger.debug('Latency for %s: %d ms', website.url, latency_ms)

        history_record = schemas.MonitoringHistoryCreate(latency_sec=latency_ms/1000,
                                                         timestamp=datetime.utcnow(),
                                                         website_id=website.id)
        logger.debug('Creating history record for %s', website.url)
        history_handlers.create_history_record(db, history_record)

        logger.debug('Sleeping for %d seconds', website.frequency_sec)
        time.sleep(website.frequency_sec)

    logger.info('Stopped monitoring %s', website.url)
