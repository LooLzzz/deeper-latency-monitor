from os import getenv

from pydantic import PostgresDsn
from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker

POSTGRES_PASSWORD = getenv('POSTGRES_PASSWORD')
POSTGRES_USER = getenv('POSTGRES_USER')
POSTGRES_DB = getenv('POSTGRES_DB')
POSTGRES_HOST = getenv('POSTGRES_HOST', 'localhost')

SQLALCHEMY_DATABASE_URI = PostgresDsn.build(
    scheme='postgresql',
    user=POSTGRES_USER,
    password=POSTGRES_PASSWORD,
    host=POSTGRES_HOST,
    path=f'/{POSTGRES_DB}',
)

engine = create_engine(
    url=SQLALCHEMY_DATABASE_URI,
)
SessionLocal = sessionmaker(autocommit=False, autoflush=True, bind=engine)

Base = declarative_base()


def get_db():
    """A dependency injection to get a database connection"""
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
