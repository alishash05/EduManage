from sqlalchemy import Column, Integer, String, ForeignKey
from app.database.connection import Base


class Student(Base):

    __tablename__ = "students"

    id = Column(Integer, primary_key=True, index=True)

    user_id = Column(
        Integer,
        ForeignKey("users.id"),
        unique=True,
        nullable=False
    )

    class_name = Column(String(50), nullable=False)

    roll_number = Column(String(50), unique=True, nullable=False)