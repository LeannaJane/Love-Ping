from datetime import datetime
from typing import Literal

from pydantic import BaseModel, ConfigDict


class PartnerResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    display_name: str
    email: str


class FeedItem(BaseModel):
    id: int
    type: Literal["ping", "mood"]
    text: str
    created_at: datetime
    is_mine: bool


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


class PingCreate(BaseModel):
    ping_type: str


class MoodCreate(BaseModel):
    mood: str