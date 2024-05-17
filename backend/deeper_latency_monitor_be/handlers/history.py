from datetime import datetime

from sqlalchemy.orm import Session
from sqlalchemy.sql import func

from .. import models, schemas


def get_website_history(db: Session, website_id: int, offset: int = 0, limit: int = 100):
    return (db.query(models.MonitoringHistory)
              .filter(models.MonitoringHistory.website_id == website_id)
              .order_by(models.MonitoringHistory.created_at.desc())
              .offset(offset)
              .limit(limit)
              .all())


def get_latest_website_history(db: Session,
                               website_id: int,
                               rolling_average_options: schemas.RollingAverageOptions = None):
    latest = (db.query(models.MonitoringHistory)
                .filter(models.MonitoringHistory.website_id == website_id)
                .order_by(models.MonitoringHistory.created_at.desc())
                .first())

    if latest and rolling_average_options and rolling_average_options.enabled:
        avg_latency_query_func = func.avg(models.MonitoringHistory.latency_ms)
        avg_latency = (db.query(avg_latency_query_func)
                         .filter(models.MonitoringHistory.website_id == website_id,
                                 models.MonitoringHistory.created_at > datetime.now() - rolling_average_options.window)
                         .scalar())

        if avg_latency:
            return schemas.MonitoringHistoryView(
                id=latest.id,
                website_id=website_id,
                latency_ms=avg_latency,
                created_at=latest.created_at,
            )

    return latest


def create_history_record(db: Session, history: schemas.MonitoringHistoryCreate):
    db_history = models.MonitoringHistory(**history.dict())
    db.add(db_history)
    db.commit()
    return db_history


def clear_website_history(db: Session, website_id: int):
    row_count = (db.query(models.MonitoringHistory)
                   .filter(models.MonitoringHistory.website_id == website_id)
                   .delete())
    db.commit()
    return schemas.AffectedRows(affected_rows=row_count)
