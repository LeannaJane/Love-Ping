from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy import or_
from sqlalchemy.orm import Session

from app.api.auth import get_current_user
from app.db.database import get_db
from app.models.connection import Connection
from app.models.user import User
from app.schemas.connection import ConnectByCodeRequest, ConnectionResponse
from app.schemas.user import UserResponse

router = APIRouter(prefix="/connections", tags=["connections"])


@router.post("/connect", response_model=ConnectionResponse)
def connect_by_invite_code(
    payload: ConnectByCodeRequest,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    target_user = db.query(User).filter(User.invite_code == payload.invite_code).first()

    if not target_user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Invite code not found",
        )

    if target_user.id == current_user.id:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="You cannot connect to yourself",
        )

    existing_connection = (
        db.query(Connection)
        .filter(
            or_(
                (Connection.requester_id == current_user.id) & (Connection.receiver_id == target_user.id),
                (Connection.requester_id == target_user.id) & (Connection.receiver_id == current_user.id),
            )
        )
        .first()
    )

    if existing_connection:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Connection already exists",
        )

    connection = Connection(
        requester_id=current_user.id,
        receiver_id=target_user.id,
        status="accepted",
    )

    db.add(connection)
    db.commit()
    db.refresh(connection)

    return connection


@router.get("/mine")
def get_my_connection(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    connection = (
        db.query(Connection)
        .filter(
            or_(
                Connection.requester_id == current_user.id,
                Connection.receiver_id == current_user.id,
            )
        )
        .first()
    )

    if not connection:
        return {"connected": False, "connection": None}

    partner_id = (
        connection.receiver_id
        if connection.requester_id == current_user.id
        else connection.requester_id
    )

    partner = db.query(User).filter(User.id == partner_id).first()

    return {
        "connected": True,
        "connection": {
            "id": connection.id,
            "status": connection.status,
            "partner": UserResponse.model_validate(partner).model_dump(),
        },
    }