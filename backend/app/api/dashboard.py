from datetime import date

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy import or_
from sqlalchemy.orm import Session

from app.api.auth import get_current_user
from app.db.database import get_db
from app.models.connection import Connection
from app.models.mood import Mood
from app.models.ping import Ping
from app.models.user import User
from app.schemas.dashboard import (
    DashboardResponse,
    FeedItem,
    MoodCreate,
    PartnerResponse,
    PingCreate,
)

router = APIRouter(prefix="/dashboard", tags=["dashboard"])


PING_TEXT_MAP = {
    "hug_me": "🤗 Hug me",
    "kiss_me": "😘 Kiss me",
    "miss_you": "🥺 I miss you",
    "thinking_of_you": "💌 Thinking of you",
    "date_tonight": "🔥 Date tonight?",
    "goodnight": "🌙 Goodnight",
}


def calculate_streak(db: Session, user: User) -> int:
    ping_days = {
        row[0]
        for row in db.query(Ping.created_at)
        .filter(Ping.sender_id == user.id)
        .all()
    }

    mood_days = {
        row[0]
        for row in db.query(Mood.created_at)
        .filter(Mood.user_id == user.id)
        .all()
    }

    all_days = set()

    for dt in ping_days:
        if dt:
            all_days.add(dt.date())

    for dt in mood_days:
        if dt:
            all_days.add(dt.date())

    if not all_days:
        return 0

    streak = 0
    current_day = date.today()

    while current_day in all_days:
        streak += 1
        current_day = date.fromordinal(current_day.toordinal() - 1)

    return streak


def get_partner_from_connection(db: Session, current_user: User) -> User | None:
    connection = (
        db.query(Connection)
        .filter(
            Connection.status == "accepted",
            or_(
                Connection.requester_id == current_user.id,
                Connection.receiver_id == current_user.id,
            ),
        )
        .first()
    )

    if not connection:
        return None

    partner_id = (
        connection.receiver_id
        if connection.requester_id == current_user.id
        else connection.requester_id
    )

    return db.query(User).filter(User.id == partner_id).first()


@router.get("", response_model=DashboardResponse)
def get_dashboard(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    latest_mood = (
        db.query(Mood)
        .filter(Mood.user_id == current_user.id)
        .order_by(Mood.created_at.desc())
        .first()
    )

    latest_ping = (
        db.query(Ping)
        .filter(Ping.sender_id == current_user.id)
        .order_by(Ping.created_at.desc())
        .first()
    )

    recent_pings = (
        db.query(Ping)
        .filter(
            (Ping.sender_id == current_user.id) | (Ping.receiver_id == current_user.id)
        )
        .order_by(Ping.created_at.desc())
        .limit(10)
        .all()
    )

    recent_moods = (
        db.query(Mood)
        .filter(Mood.user_id == current_user.id)
        .order_by(Mood.created_at.desc())
        .limit(10)
        .all()
    )

    feed: list[FeedItem] = []

    for ping in recent_pings:
        is_sender = ping.sender_id == current_user.id
        text = (
            f"You sent {PING_TEXT_MAP.get(ping.ping_type, ping.ping_type)}"
            if is_sender
            else f"You received {PING_TEXT_MAP.get(ping.ping_type, ping.ping_type)}"
        )

        feed.append(
            FeedItem(
                id=ping.id,
                type="ping",
                text=text,
                created_at=ping.created_at,
                is_mine=is_sender,
            )
        )

    # for mood in recent_moods:
    #     feed.append(
    #         FeedItem(
    #             id=100000 + mood.id,
    #             type="mood",
    #             text=f"Mood check-in: {mood.mood}",
    #             created_at=mood.created_at,
    #             is_mine=True,
    #         )
    #     )

    feed.sort(key=lambda item: item.created_at, reverse=True)
    feed = feed[:10]

    partner_user = get_partner_from_connection(db, current_user)
    partner = PartnerResponse.model_validate(partner_user) if partner_user else None

    return DashboardResponse(
        user_id=current_user.id,
        display_name=current_user.display_name,
        email=current_user.email,
        invite_code=current_user.invite_code,
        partner=partner,
        current_mood=latest_mood.mood if latest_mood else None,
        last_ping=latest_ping.ping_type if latest_ping else None,
        streak=calculate_streak(db, current_user),
        love_score=98,
        recent_activity=feed,
    )


@router.post("/pings")
def create_ping(
    payload: PingCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    partner_user = get_partner_from_connection(db, current_user)

    if not partner_user:
        raise HTTPException(
            status_code=400,
            detail="You are not connected to a partner yet.",
        )

    ping = Ping(
        sender_id=current_user.id,
        receiver_id=partner_user.id,
        ping_type=payload.ping_type,
    )

    db.add(ping)
    db.commit()
    db.refresh(ping)

    return {"message": "Ping sent successfully", "id": ping.id}


@router.post("/moods")
def create_mood(
    payload: MoodCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    mood = Mood(
        user_id=current_user.id,
        mood=payload.mood,
    )

    db.add(mood)
    db.commit()
    db.refresh(mood)

    return {"message": "Mood saved successfully", "id": mood.id}