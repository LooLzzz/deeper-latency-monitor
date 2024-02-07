from datetime import datetime, timedelta
from typing import Self

from pydantic import BaseModel

from .utils import toCamelCase


class SettingsUpdate(BaseModel):
    low_threshold_ms: float | None = None
    high_threshold_ms: float | None = None
    ping_interval_sec: float | None = None

    class Config:
        alias_generator = toCamelCase
        allow_population_by_field_name = True


class RollingAverageOptions(BaseModel):
    rolling_average_enabled: bool = False
    rolling_average_window: int = 60

    @property
    def enabled(self):
        return self.rolling_average_enabled

    @property
    def window(self):
        return timedelta(seconds=self.rolling_average_window)

    class Config:
        alias_generator = toCamelCase
        allow_population_by_field_name = True


class MonitoredWebsitesBase(BaseModel):
    url: str
    friendly_name: str
    is_active: bool

    class Config:
        alias_generator = toCamelCase
        allow_population_by_field_name = True


class MonitoredWebsitesCreate(MonitoredWebsitesBase):
    pass


class MonitoredWebsitesUpdate(MonitoredWebsitesBase):
    url: str | None = None
    friendly_name: str | None = None
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


class AffectedRows(BaseModel):
    affected_rows: int

    def __add__(self, other: int | Self):
        match other:
            case int():
                return AffectedRows(affected_rows=self.affected_rows + other)

            case AffectedRows():
                return AffectedRows(affected_rows=self.affected_rows + other.affected_rows)

        raise ValueError(f"Unsupported type for __add__: {type(other)}")

    class Config:
        alias_generator = toCamelCase
        allow_population_by_field_name = True
