
from sqlalchemy import Column, Integer, String, Boolean, DateTime, func

from app.database.connection import Base


class OTPVerification(Base):

    __tablename__ = "otp_verifications"

    id = Column(Integer, primary_key=True, index=True)

    email = Column(String(150), unique=True, nullable=False, index=True)

    is_verified = Column(Boolean, default=False, nullable=False)

    created_at = Column(DateTime(timezone=True), server_default=func.now())

    updated_at = Column(
        DateTime(timezone=True),
        server_default=func.now(),
        onupdate=func.now()
    )
