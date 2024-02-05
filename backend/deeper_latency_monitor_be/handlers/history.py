from sqlalchemy.orm import Session

from .. import models, schemas


def get_latest_history(db: Session, website_id: int):
    return (db.query(models.MonitoringHistory)
              .filter(models.MonitoringHistory.website_id == website_id)
              .order_by(models.MonitoringHistory.timestamp.desc())
              .first())


def create_history_record(db: Session, history: schemas.MonitoringHistoryCreate):
    db_history = models.MonitoringHistory(**history.dict())
    db.add(db_history)
    db.commit()
    db.refresh(db_history)
    return db_history
