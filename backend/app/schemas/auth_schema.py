from pydantic import BaseModel, EmailStr, Field


# Data received during login
class LoginRequest(BaseModel):
    email: EmailStr
    password: str = Field(min_length=1)


# Data returned after successful login
class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"