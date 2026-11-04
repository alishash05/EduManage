from fastapi import HTTPException, status
from sqlalchemy.orm import Session

from app.models.user import User
from app.core.security import (
    verify_password, 
    create_access_token,
    create_refresh_token,
    verify_refresh_token
)

def refresh_access_token(db: Session, refresh_token: str):

    # 1. Verify refresh token
    payload = verify_refresh_token(refresh_token)

    # 2. Get user ID from token
    user_id = payload.get("sub")

    # 3. Find user in database
    user = db.query(User).filter(
        User.id == int(user_id)
    ).first()

    # 4. Check user exists
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="User not found"
        )

    # 5. Check account status
    if not user.is_active:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="User account is inactive"
        )

    # 6. Generate a new access token
    new_access_token = create_access_token(user.id)

    # 7. Return new access token
    return {
        "access_token": new_access_token,
        "token_type": "bearer"
    }


def login_user(db: Session, email: str, password: str):

    # Step 1: Find user by email
    user = db.query(User).filter(User.email == email).first()

    # Step 2: Check whether user exists
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid email or password"
        )

    # Step 3: Verify password
    password_is_valid = verify_password(
        password,
        user.hashed_password
    )

    if not password_is_valid:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid email or password"
        )

    # Step 4: Check account status
    if not user.is_active:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Your account is inactive"
        )

    # Step 5: Generate access token
    access_token = create_access_token(user.id)

    # Step 6:Generating refreshtoken
    refresh_token = create_refresh_token(user.id)

    # Step 7: Return token and user information
    return {
        "access_token": access_token,
        "refresh_token":refresh_token,
        "token_type": "bearer",
        "user": {
            "id": user.id,
            "name": user.name,
            "email": user.email,
            "role": user.role
        }
    }