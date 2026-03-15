from fastapi import Depends, FastAPI, Header
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session

from app.api.auth import get_current_user, router as auth_router
from app.db.database import Base, engine, get_db
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


@app.get("/health")
def health_check():
    return {"status": "ok"}


@app.get("/me", response_model=UserResponse)
def me(
    authorization: str = Header(...),
    db: Session = Depends(get_db),
):
    return get_current_user(authorization, db)