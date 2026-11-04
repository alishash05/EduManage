from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.database.connection import get_db
from app.schemas.auth_schema import LoginRequest
from app.services.auth_service import login_user

from app.schemas.auth_schema import RefreshTokenRequest
from app.services.auth_service import refresh_access_token

from app.schemas.auth_schema import (
    RegisterRequest,
    RegisterOTPVerifyRequest
)

from app.services.registration_service import (
    register_user,
    verify_registration_otp
)

# Create router
router = APIRouter(
    prefix="/auth",
    tags=["Authentication"]
)


@router.post("/refresh")
def refresh_token(
    refresh_data: RefreshTokenRequest,

    db: Session = Depends(get_db)
):
    return refresh_access_token(
        db=db,
        refresh_token=refresh_data.refresh_token
    )

# Login API
@router.post("/login")
def login(
    login_data: LoginRequest,
    db: Session = Depends(get_db)
):
    return login_user(
        db=db,
        email=login_data.email,
        password=login_data.password
    )

# Registration API
@router.post("/register")
def register(
    data: RegisterRequest,
    db: Session = Depends(get_db)
):
    return register_user(db=db, data=data)


# Registration OTP verification API
@router.post("/verify-registration-otp")
def verify_registration(
    data: RegisterOTPVerifyRequest,
    db: Session = Depends(get_db)
):
    return verify_registration_otp(
        db=db,
        email=data.email,
        otp=data.otp
    )