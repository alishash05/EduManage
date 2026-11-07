
from sqlalchemy import Column, Integer, String, ForeignKey, Date
from app.database.connection import Base


class Student(Base):

    __tablename__ = "students"

    id = Column(Integer, primary_key=True, index=True)

    admission_no = Column(String(50), unique=True, nullable=False)

    name = Column(String(100), nullable=False)

    email = Column(String(150), nullable=False)

    phone = Column(String(15), nullable=False)

    date_of_birth = Column(Date, nullable=True)

    gender = Column(String(20), nullable=True)

    class_name = Column(String(20), nullable=False)

    section = Column(String(10), nullable=True)

    guardian_name = Column(String(100), nullable=True)

    user_id = Column(
        Integer,
        ForeignKey("users.id"),
        unique=True,
        nullable=False
    )
