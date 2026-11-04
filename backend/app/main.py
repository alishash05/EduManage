from fastapi import FastAPI

from app.database.connection import Base, engine

# Import all models
from app.models import User, Teacher

# Import routers
from app.routers.teacher_router import router as teacher_router
from app.routers.auth_router import router as auth_router

#from app.services.valkey_service import get_valkey_client

import secrets
import hmac
from pydantic import BaseModel,EmailStr
from fastapi import HTTPException
from app.services.redis_service import get_redis_client

from app.routers import otp
# Create missing database tables
Base.metadata.create_all(bind=engine)


app = FastAPI(
    title="EduManage API",
    description="School Data Management System",
    version="1.0.0"
)

app.include_router(teacher_router)
app.include_router(auth_router)
app.include_router(otp.router)

@app.get("/test-redis")
def test_redis():

    client = get_redis_client()

    response = client.ping()

    return {
        "message": "Redis connected successfully",
        "ping": response
    }

@app.get("/redis/set")
def set_data():

    client = get_redis_client()

    client.set("user:name", "Alisha")

    return {
        "message": "Data stored successfully"
    }


@app.get("/redis/get")
def get_data():

    client = get_redis_client()

    value = client.get("user:name")

    return {
        "key": "user:name",
        "value": value
    }


@app.get("/redis/delete")
def delete_data():

    client = get_redis_client()

    client.delete("user:name")

    return {
        "message": "Data deleted successfully"
    }

@app.get("/")
def home():
    return {
        "message": "Welcome to EduManage API"
    }