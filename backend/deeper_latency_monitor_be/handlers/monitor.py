from sqlalchemy.orm import Session

from .. import models, schemas
from .history import clear_website_history


def get_all_monitored_websites(db: Session):
    return db.query(models.MonitoredWebsites).all()


def create_monitored_website(db: Session, website: schemas.MonitoredWebsitesCreate):
    db_website = models.MonitoredWebsites(**website.dict())
    db.add(db_website)
    db.commit()
    db.refresh(db_website)
    return db_website


def delete_monitored_website(db: Session, website_id: int):
    history_row_count = clear_website_history(db, website_id)
    row_count = (db.query(models.MonitoredWebsites)
                   .filter(models.MonitoredWebsites.id == website_id)
                   .delete())
    db.commit()
    return schemas.AffectedRows(affected_rows=row_count + history_row_count.affected_rows)


def update_monitored_website(db: Session, website_id: int, website: schemas.MonitoredWebsitesUpdate):
    row_count = (db.query(models.MonitoredWebsites)
                   .filter(models.MonitoredWebsites.id == website_id)
                   .update(website.dict(exclude_unset=True)))
    db.commit()
    return schemas.AffectedRows(affected_rows=row_count)
