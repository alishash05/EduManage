from fastapi import FastAPI

from app.database.connection import Base, engine

# Import all models
from app.models import User, Teacher

# Import routers
from app.routers.teacher_router import router as teacher_router
from app.routers.auth_router import router as auth_router


# Create missing database tables
Base.metadata.create_all(bind=engine)


app = FastAPI(
    title="EduManage API",
    description="School Data Management System",
    version="1.0.0"
)

app.include_router(teacher_router)
app.include_router(auth_router)


@app.get("/")
def home():
    return {
        "message": "Welcome to EduManage API"
    }