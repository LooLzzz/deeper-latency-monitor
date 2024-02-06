from sqlalchemy.orm import Session

from .. import models, schemas


def get_website_history(db: Session, website_id: int, offset: int = 0, limit: int = 100):
    return (db.query(models.MonitoringHistory)
              .filter(models.MonitoringHistory.website_id == website_id)
              .order_by(models.MonitoringHistory.created_at.desc())
              .offset(offset)
              .limit(limit)
              .all())


def create_history_record(db: Session, history: schemas.MonitoringHistoryCreate):
    db_history = models.MonitoringHistory(**history.dict())
    db.add(db_history)
    db.commit()
    # db.refresh(db_history)  # this hangs indefinitely for some reason
    return db_history


def clear_website_history(db: Session, website_id: int):
    row_count = (db.query(models.MonitoringHistory)
                   .filter(models.MonitoringHistory.website_id == website_id)
                   .delete())
    db.commit()
    return schemas.AffectedRows(affected_rows=row_count)
