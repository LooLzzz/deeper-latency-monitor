from fastapi import APIRouter, Depends

from .. import schemas
from ..settings import Settings, get_settings

router = APIRouter(prefix='/settings', tags=['Settings'])


@router.get('/', response_model=Settings)
def read_settings(settings: Settings = Depends(get_settings)):
    return settings


@router.patch('/', response_model=Settings)
def update_settings(settings_to_update: schemas.SettingsUpdate, settings: Settings = Depends(get_settings)):
    update_dict = settings_to_update.dict(exclude_unset=True)

    for field, value in update_dict.items():
        setattr(settings, field, value)

    return settings
