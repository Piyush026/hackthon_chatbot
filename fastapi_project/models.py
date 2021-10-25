from fastapi_users import models


class User(models.BaseUser):
    # username: str
    occupation: str
    address: str


class UserCreate(models.BaseUserCreate):
    # username: str
    occupation: str
    address: str


class UserUpdate(models.BaseUserUpdate):
    username: str
    occupation: str
    address: str


class UserDB(User, models.BaseUserDB):
    # username: str
    occupation: str
    address: str
