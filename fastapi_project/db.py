import databases
import sqlalchemy
from sqlalchemy import Column, String, Integer, Boolean

from fastapi_users.db import SQLAlchemyBaseUserTable, SQLAlchemyUserDatabase
from sqlalchemy.ext.declarative import DeclarativeMeta, declarative_base

from models import UserDB

DATABASE_URL = "sqlite:///./test.db"
database = databases.Database(DATABASE_URL)
Base: DeclarativeMeta = declarative_base()


class UserTable(Base, SQLAlchemyBaseUserTable):
    # username = Column(String(length=320))
    occupation = Column(String(length=320))
    address = Column(String(length=320))


engine = sqlalchemy.create_engine(
    DATABASE_URL, connect_args={"check_same_thread": False}
)
Base.metadata.create_all(engine)

users = UserTable.__table__


def get_user_db():
    yield SQLAlchemyUserDatabase(UserDB, database, users)
