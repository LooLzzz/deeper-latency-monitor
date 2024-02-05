from fastapi import APIRouter, Depends

from .. import schemas
from ..database import get_db
from ..handlers import monitor as monitor_handlers

router = APIRouter(prefix='/monitor', tags=['Monitor'])


@router.put('/')
def create_monitored_website(website: schemas.MonitoredWebsitesCreate, db=Depends(get_db)):
    return monitor_handlers.create_monitored_website(db, website)
