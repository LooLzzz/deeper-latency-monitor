from sqlalchemy import (Boolean, Column, DateTime, Float, ForeignKey, Integer,
                        String)
from sqlalchemy.orm import relationship

from .database import Base


class MonitoredWebsites(Base):
    __tablename__ = 'monitored_websites'

    id = Column(Integer, primary_key=True)
    url = Column(String, unique=True)
    red_threshold_sec = Column(Float)
    orange_threshold_sec = Column(Float)
    green_threshold_sec = Column(Float)
    frequency_sec = Column(Float)
    is_active = Column(Boolean)

    history = relationship('MonitoringHistory',
                           back_populates='website',
                           cascade='all, delete-orphan')


class MonitoringHistory(Base):
    __tablename__ = 'monitoring_history'

    id = Column(Integer, primary_key=True)
    latency_sec = Column(Float)
    timestamp = Column(DateTime)
    website_id = Column(Integer, ForeignKey('monitored_websites.id'))

    website = relationship('MonitoredWebsites',
                            back_populates='history')
