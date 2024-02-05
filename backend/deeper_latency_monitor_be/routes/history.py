from fastapi import APIRouter, Depends, HTTPException

from ..database import get_db
from ..handlers import history as history_handlers

router = APIRouter(prefix='/history', tags=['History'])


@router.get('/{website_id}')
def get_latest_history(website_id: int, db=Depends(get_db)):
    res = history_handlers.get_latest_history(db, website_id)
    if res is None:
        raise HTTPException(
            status_code=404,
            detail=f'No history found for website with id {website_id}',
        )
    return res
