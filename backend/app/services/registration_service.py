import secrets
import hmac

from fastapi import HTTPException, status
from sqlalchemy.orm import Session
from sqlalchemy.exc import IntegrityError

from app.models.user import User
from app.models.teacher import Teacher
from app.core.security import hash_password
from app.services.redis_service import get_redis_client

from app.core.security import (
    hash_password,
    create_access_token,
    create_refresh_token
)

def register_user(db: Session, data):

    # 1. Check whether email already exists
    existing_email = db.query(User).filter(
        User.email == data.email
    ).first()

    if existing_email:
        raise HTTPException(
            status_code=409,
            detail="Email already registered"
        )

    # 2. Check whether phone already exists
    existing_phone = db.query(User).filter(
        User.phone == data.phone
    ).first()

    if existing_phone:
        raise HTTPException(
            status_code=409,
            detail="Phone number already registered"
        )

    # 3. Generate six-digit OTP code 
    otp = str(secrets.randbelow(900000) + 100000)

    # 4. Hash password register new password
    hashed_password = hash_password(data.password)

    # 5. Store registration data temporarily in Memurai
    client = get_redis_client()

    redis_key = f"registration:{data.email.lower()}"

    registration_data = {
        "name": data.name,
        "email": data.email.lower(),
        "phone": data.phone,
        "hashed_password": hashed_password,
        "role": data.role
    }

    client.hset(redis_key, mapping=registration_data)
    client.hset(redis_key, "otp", otp)
    client.expire(redis_key, 300)

    # Development testing only
    print("Registration OTP:", otp)

    return {
        "message": "OTP generated successfully",
        "expires_in": 300
    }



def verify_registration_otp(db: Session, email: str, otp: str):

    client = get_redis_client()

    redis_key = f"registration:{email.lower()}"

    # 1. Get temporary registration details
    registration_data = client.hgetall(redis_key)

    if not registration_data:
        raise HTTPException(
            status_code=400,
            detail="Registration expired or not found"
        )

    # 2. Check OTP
    stored_otp = registration_data.get("otp")

    if not stored_otp or not hmac.compare_digest(stored_otp, otp):
        raise HTTPException(
            status_code=400,
            detail="Invalid OTP"
        )

    # 3. Create user object
    new_user = User(
        name=registration_data["name"],
        email=registration_data["email"],
        phone=registration_data["phone"],
        hashed_password=registration_data["hashed_password"],
        role=registration_data["role"]
    )

    # 4. Save user in PostgreSQL
    try:
        db.add(new_user)
        db.flush()

        if new_user.role == "teacher":
            new_teacher = Teacher(
                user_id=new_user.id,
                name=new_user.name,
                email=new_user.email,
                phone=new_user.phone
            )
            db.add(new_teacher)

        db.commit()
        db.refresh(new_user)
    except IntegrityError:
        db.rollback()
        raise HTTPException(
            status_code=409,
            detail="Email or phone number already registered"
        )

    # 5. Generate tokens after successful registration
    access_token = create_access_token(new_user.id)
    refresh_token = create_refresh_token(new_user.id)

    # 6. Delete temporary registration data
    client.delete(redis_key)

    # 7. Return successful registration response
    return {
        "message": "Registration successful",
        "access_token": access_token,
        "refresh_token": refresh_token,
        "token_type": "bearer",
        "user": {
            "id": new_user.id,
            "name": new_user.name,
            "email": new_user.email,
            "role": new_user.role
        }
    }
