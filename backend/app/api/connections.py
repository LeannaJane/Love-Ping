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


def get_user_connection(db: Session, user_id: int) -> Connection | None:
    return (
        db.query(Connection)
        .filter(
            Connection.status == "accepted",
            or_(
                Connection.requester_id == user_id,
                Connection.receiver_id == user_id,
            ),
        )
        .order_by(Connection.created_at.desc())
        .first()
    )


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

    current_user_existing_connection = get_user_connection(db, current_user.id)
    if current_user_existing_connection:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="You are already connected to a partner. Unlink first to connect with someone else.",
        )

    target_user_existing_connection = get_user_connection(db, target_user.id)
    if target_user_existing_connection:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="That user is already connected to a partner.",
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
    connection = get_user_connection(db, current_user.id)

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


@router.delete("/unlink")
def unlink_partner(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    connections = (
        db.query(Connection)
        .filter(
            Connection.status == "accepted",
            or_(
                Connection.requester_id == current_user.id,
                Connection.receiver_id == current_user.id,
            ),
        )
        .all()
    )

    if not connections:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="You are not connected to a partner.",
        )

    deleted_count = len(connections)

    for connection in connections:
        db.delete(connection)

    db.commit()

    return {
        "message": "Partner unlinked successfully",
        "deleted_connections": deleted_count,
    }