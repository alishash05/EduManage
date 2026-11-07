
from fastapi import APIRouter, HTTPException
import secrets
import hmac

from app.schemas.otp import OTPRequest, OTPVerifyRequest
from app.services.redis_service import get_redis_client

router = APIRouter(
    prefix="/otp",
    tags=["OTP"]
)


@router.post("/generate")
def generate_otp(data: OTPRequest):
    client = get_redis_client()

    otp = str(secrets.randbelow(900000) + 100000)

    # here we use redis key
    redis_key = f"otp:{data.email.lower()}"

#store otp in in redis key 
    client.set(redis_key, otp, ex=300)

    #to check otp in terminal
    print("Generated OTP:", otp)

    return {
        "message": "OTP generated successfully",
        "expires_in": 300
    }


@router.post("/verify")
def verify_otp(data: OTPVerifyRequest):
    client = get_redis_client()

    redis_key = f"otp:{data.email.lower()}"

    stored_otp = client.get(redis_key)
    

    if stored_otp is None:
        raise HTTPException(
            status_code=400,
            detail="OTP expired or not generated"
        )

    if not hmac.compare_digest(stored_otp, data.otp):
        raise HTTPException(
            status_code=400,
            detail="Invalid OTP"
        )

    client.delete(redis_key)

    return {
        "message": "Email OTP verified successfully"
    }

