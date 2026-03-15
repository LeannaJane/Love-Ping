from pydantic import BaseModel

from app.schemas.user import UserResponse


class ConnectByCodeRequest(BaseModel):
    invite_code: str


class ConnectionResponse(BaseModel):
    id: int
    requester_id: int
    receiver_id: int
    status: str

    class Config:
        from_attributes = True


class ConnectionWithUsersResponse(BaseModel):
    id: int
    requester_id: int
    receiver_id: int
    status: str
    requester: UserResponse
    receiver: UserResponse

    class Config:
        from_attributes = True