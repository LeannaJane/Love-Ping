from fastapi import Depends, FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.api.auth import get_current_user, router as auth_router
from app.api.connections import router as connections_router
from app.api.dashboard import router as dashboard_router
from app.db.database import Base, engine
from app.models.mood import Mood
from app.models.ping import Ping
from app.models.user import User
from app.schemas.user import UserResponse

Base.metadata.create_all(bind=engine)

app = FastAPI(title="Love Ping API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://127.0.0.1:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth_router)
app.include_router(connections_router)
app.include_router(dashboard_router)


@app.get("/health")
def health_check():
    return {"status": "ok"}


@app.get("/me", response_model=UserResponse)
def me(current_user=Depends(get_current_user)):
    return current_user