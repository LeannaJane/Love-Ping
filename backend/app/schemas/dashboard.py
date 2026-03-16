from datetime import datetime
from pydantic import BaseModel


class PartnerResponse(BaseModel):
    id: int
    display_name: str
    email: str

    class Config:
        from_attributes = True


class PingCreate(BaseModel):
    ping_type: str


class MoodCreate(BaseModel):
    mood: str


class FeedItem(BaseModel):
    id: int
    type: str
    text: str
    created_at: datetime


class DashboardResponse(BaseModel):
    user_id: int
    display_name: str
    email: str
    invite_code: str
    partner: PartnerResponse | None
    current_mood: str | None
    last_ping: str | None
    streak: int
    love_score: int
    recent_activity: list[FeedItem]