from pydantic import BaseModel


class UserCreate(BaseModel):
    email: str
    password: str


class UserLogin(BaseModel):
    email: str
    password: str


class Token(BaseModel):
    access_token: str
    token_type: str


class ClientDataCreate(BaseModel):
    name: str
    value: str


class ClientDataOut(BaseModel):
    id: int
    name: str
    value: str

    class Config:
        from_attributes = True