from datetime import datetime

from pydantic import BaseModel


class MonitoredWebsitesBase(BaseModel):
    url: str
    red_threshold_sec: float
    orange_threshold_sec: float
    green_threshold_sec: float
    frequency_sec: float
    is_active: bool


class MonitoredWebsitesCreate(MonitoredWebsitesBase):
    pass


class MonitoredWebsitesUpdate(MonitoredWebsitesBase):
    url: str | None = None
    red_threshold_sec: float | None = None
    orange_threshold_sec: float | None = None
    green_threshold_sec: float | None = None
    frequency_sec: float | None = None
    is_active: bool | None = None


class MonitoredWebsites(MonitoredWebsitesBase):
    id: int

    class Config:
        orm_mode = True


class MonitoringHistoryBase(BaseModel):
    latency_sec: float
    timestamp: datetime
    website_id: int


class MonitoringHistoryCreate(MonitoringHistoryBase):
    pass


class MonitoringHistory(MonitoringHistoryBase):
    id: int

    class Config:
        orm_mode = True
