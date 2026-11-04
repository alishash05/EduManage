from pydantic import BaseModel, EmailStr, Field


# Data received during login
class LoginRequest(BaseModel):
    email: EmailStr
    password: str = Field(min_length=1)


# Data returned after successful login
class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"

class RefreshTokenRequest(BaseModel):
    refresh_token: str

# Registration details
class RegisterRequest(BaseModel):
    name: str = Field(min_length=2, max_length=100)
    email: EmailStr
    phone: str = Field(min_length=10, max_length=15)
    password: str = Field(min_length=8)
    role: str


# OTP verification request
class RegisterOTPVerifyRequest(BaseModel):
    email: EmailStr
    otp: str = Field(min_length=6, max_length=6)

