from datetime import datetime

from sqlalchemy import (Boolean, Column, DateTime, Float, ForeignKey, Integer,
                        String)
from sqlalchemy.orm import relationship

from .database import Base


class MonitoredWebsites(Base):
    __tablename__ = 'monitored_websites'

    id = Column(Integer, primary_key=True)
    url = Column(String, unique=True)
    friendly_name = Column(String)
    is_active = Column(Boolean)
    created_at = Column(DateTime, default=datetime.now)
    updated_at = Column(DateTime,
                        default=datetime.now,
                        onupdate=datetime.now)

    history = relationship('MonitoringHistory',
                           back_populates='website',
                           cascade='all, delete')


class MonitoringHistory(Base):
    __tablename__ = 'monitoring_history'

    id = Column(Integer, primary_key=True)
    latency_ms = Column(Float)
    created_at = Column(DateTime, default=datetime.now)
    website_id = Column(Integer, ForeignKey('monitored_websites.id'))

    website = relationship('MonitoredWebsites',
                           back_populates='history')
