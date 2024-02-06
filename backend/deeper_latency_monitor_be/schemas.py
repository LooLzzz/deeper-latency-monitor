from datetime import datetime

from pydantic import BaseModel

from .utils import toCamelCase


class MonitoredWebsitesBase(BaseModel):
    url: str
    red_threshold_ms: float
    orange_threshold_ms: float
    green_threshold_ms: float
    frequency_sec: float
    is_active: bool

    class Config:
        alias_generator = toCamelCase
        allow_population_by_field_name = True


class MonitoredWebsitesCreate(MonitoredWebsitesBase):
    pass


class MonitoredWebsitesUpdate(MonitoredWebsitesBase):
    url: str | None = None
    red_threshold_ms: float | None = None
    orange_threshold_ms: float | None = None
    green_threshold_ms: float | None = None
    frequency_sec: float | None = None
    is_active: bool | None = None


class MonitoredWebsitesView(MonitoredWebsitesBase):
    id: int
    created_at: datetime
    updated_at: datetime

    class Config:
        orm_mode = True


class MonitoringHistoryBase(BaseModel):
    latency_ms: float
    website_id: int

    class Config:
        alias_generator = toCamelCase
        allow_population_by_field_name = True


class MonitoringHistoryCreate(MonitoringHistoryBase):
    pass


class MonitoringHistoryView(MonitoringHistoryBase):
    id: int
    created_at: datetime

    class Config:
        orm_mode = True
