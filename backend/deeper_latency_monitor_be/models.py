from datetime import datetime

from sqlalchemy import (Boolean, Column, DateTime, Float, ForeignKey, Integer,
                        String)
from sqlalchemy.orm import relationship

from .database import Base


class MonitoredWebsites(Base):
    __tablename__ = 'monitored_websites'

    id = Column(Integer, primary_key=True)
    url = Column(String, unique=True)
    red_threshold_ms = Column(Float)
    orange_threshold_ms = Column(Float)
    green_threshold_ms = Column(Float)
    frequency_sec = Column(Float)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    is_active = Column(Boolean)

    history = relationship('MonitoringHistory',
                           back_populates='website',
                           cascade='all, delete-orphan')


class MonitoringHistory(Base):
    __tablename__ = 'monitoring_history'

    id = Column(Integer, primary_key=True)
    latency_ms = Column(Float)
    created_at = Column(DateTime, default=datetime.utcnow)
    website_id = Column(Integer, ForeignKey('monitored_websites.id'))

    website = relationship('MonitoredWebsites',
                            back_populates='history')
