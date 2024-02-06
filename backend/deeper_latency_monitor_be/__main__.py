import asyncio
from contextlib import asynccontextmanager
from threading import Event

from dotenv import load_dotenv
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from . import models, routes
from .database import engine, get_db
from .settings import get_settings
from .website_monitor import website_monitor_manager

load_dotenv()
models.Base.metadata.create_all(bind=engine)


@asynccontextmanager
async def lifespan(app: FastAPI):

    # start_up
    db = next(get_db())
    settings = get_settings()
    loop = asyncio.get_event_loop()
    stop_event = Event()
    future = loop.run_in_executor(
        None,
        website_monitor_manager,
        settings,
        db,
        stop_event,
    )
    yield

    # shut_down
    stop_event.set()
    while not future.done():
        await asyncio.sleep(0)
    future.result()

app = FastAPI(lifespan=lifespan)
app.include_router(routes.settings_router)
app.include_router(routes.monitor_router)
app.include_router(routes.history_router)

app.add_middleware(
    CORSMiddleware,
    allow_origins='*',
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get('/', status_code=418, include_in_schema=False)
def root():
    return {'Message': 'This is not the endpoint you are looking for'}
