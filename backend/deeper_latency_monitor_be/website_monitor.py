import time
from concurrent.futures import Future, ThreadPoolExecutor
from logging import getLogger
from threading import Event

from sqlalchemy import inspect
from sqlalchemy.orm import Session

from . import models, os_utils, schemas
from .database import get_db
from .handlers import history as history_handlers
from .settings import Settings

logger = getLogger('uvicorn.website_monitor')


def website_monitor_manager(settings: Settings, stop: Event):
    db = next(get_db())
    logger.info('Starting website monitor')

    with ThreadPoolExecutor(max_workers=10) as executor:
        tasks: dict[int, Future] = {}

        while not stop.is_set():
            try:
                db.expire_all()
                monitored_websites = db.query(models.MonitoredWebsites).all()

                for website in monitored_websites:
                    if website.is_active:
                        fut: Future | None = tasks.get(website.id, None)
                        fut_done = not fut or fut.done()

                        end_time = fut.result() if fut else 0
                        delta_time = time.time() - end_time

                        if fut_done and delta_time > settings.ping_interval_sec:
                            tasks[website.id] = executor.submit(website_monitor, website)
                    else:
                        fut = tasks.pop(website.id, None)
                        if fut and not fut.done():
                            fut.cancel()

            except Exception as e:
                logger.error('Error in website monitor manager: %s', e)

            time.sleep(0.01)

        # stop all tasks
        for fut in tasks.values():
            fut.cancel()


def website_monitor(website: models.MonitoredWebsites):
    try:
        db = next(get_db())

        # ping website and update latency
        logger.debug('Pinging %s', website.url)
        latency_ms = os_utils.ping_website(website.url)
        logger.info('Latency for %s: %d ms', website.friendly_name, latency_ms)

        history_record = schemas.MonitoringHistoryCreate(latency_ms=latency_ms,
                                                         website_id=website.id)

        is_deleted = inspect(website).deleted
        if not is_deleted:
            logger.debug('Creating history record for %s', website.url)
            history_handlers.create_history_record(db, history_record)

        logger.debug('Finished pinging %s', website.url)
        return time.time()

    except Exception as e:
        if 'is not present in table' not in str(e):
            logger.error('Error while pinging %s: %r', website.url, e)
        return time.time()
