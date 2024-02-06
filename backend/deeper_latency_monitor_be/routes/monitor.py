from fastapi import APIRouter, Depends

from .. import schemas
from ..database import get_db
from ..handlers import monitor as monitor_handlers

router = APIRouter(prefix='/monitor', tags=['Monitor'])


@router.get('/', response_model=list[schemas.MonitoredWebsitesView])
def get_all_monitored_websites(db=Depends(get_db)):
    return monitor_handlers.get_all_monitored_websites(db)


@router.delete('/{website_id}', response_model=schemas.AffectedRows)
def delete_monitored_website(website_id: int, db=Depends(get_db)):
    return monitor_handlers.delete_monitored_website(db, website_id)


@router.put('/', response_model=schemas.MonitoredWebsitesView)
def create_monitored_website(website: schemas.MonitoredWebsitesCreate, db=Depends(get_db)):
    return monitor_handlers.create_monitored_website(db, website)


@router.patch('/{website_id}', response_model=schemas.AffectedRows)
def update_monitored_website(website_id: int, website: schemas.MonitoredWebsitesUpdate, db=Depends(get_db)):
    return monitor_handlers.update_monitored_website(db, website_id, website)
