from functools import lru_cache

from pydantic import BaseSettings

from .utils import toCamelCase


class Settings(BaseSettings):
    low_threshold_ms: float = 20
    high_threshold_ms: float = 150
    ping_interval_sec: float = 2.5

    class Config:
        alias_generator = toCamelCase
        allow_population_by_field_name = True


@lru_cache(1)
def get_settings():
    return Settings()
