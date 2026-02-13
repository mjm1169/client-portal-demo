from sqlalchemy import Column, Integer, String, ForeignKey
from sqlalchemy.orm import relationship

from database import Base


class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    email = Column(String, unique=True, index=True, nullable=False)
    hashed_password = Column(String, nullable=False)

    dataset = Column(String, default="data1.csv")

    records = relationship("ClientData", back_populates="owner")


class ClientData(Base):
    __tablename__ = "client_data"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, index=True)
    value = Column(String)

    owner_id = Column(Integer, ForeignKey("users.id"))

    owner = relationship("User", back_populates="records")
