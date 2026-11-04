from sqlalchemy import Column, Integer, String, ForeignKey
from app.database.connection import Base


class Teacher(Base):

    __tablename__ = "teachers"

    id = Column(Integer, primary_key=True, index=True)

    user_id = Column(
        Integer,
        ForeignKey("users.id"),
        unique=True,
        nullable=False
    )

    name = Column(String(100), nullable=False)
    email = Column(String(150), unique=True, nullable=False)
    phone = Column(String(15), nullable=False)
    
    subject = Column(String(100), nullable=True)
    qualification = Column(String(150), nullable=True)