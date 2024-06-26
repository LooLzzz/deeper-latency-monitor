from fastapi import APIRouter, Depends, HTTPException

from .. import schemas
from ..database import get_db
from ..handlers import history as history_handlers

router = APIRouter(prefix='/history', tags=['History'])


@router.get('/{website_id}', response_model=list[schemas.MonitoringHistoryView])
def get_website_history(website_id: int, offset: int = 0, limit: int = 100, db=Depends(get_db)):
    return history_handlers.get_website_history(db, website_id, offset, limit)


@router.get('/{website_id}/latest', response_model=schemas.MonitoringHistoryView)
def get_latest_website_history(website_id: int,
                               db=Depends(get_db),
                               rolling_average_options: schemas.RollingAverageOptions = Depends()):
    res = history_handlers.get_latest_website_history(db, website_id, rolling_average_options)
    if not res:
        raise HTTPException(
            status_code=404,
            detail=f'No history found for website with id {website_id}',
        )
    if res.latency_ms:
        res.latency_ms = round(res.latency_ms, 2)
    return res


@router.delete('/{website_id}', response_model=schemas.AffectedRows)
def clear_website_history(website_id: int, db=Depends(get_db)):
    return history_handlers.clear_website_history(db, website_id)
