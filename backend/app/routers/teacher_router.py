from fastapi import APIRouter, Depends, status
from sqlalchemy.orm import Session

from app.database.connection import get_db
from app.schemas.teacher_schema import TeacherCreate, TeacherResponse

from fastapi import Depends
from app.core.dependencies import get_current_user
from app.models.user import User

from app.core.dependencies import role_required

from app.services.teacher_service import (
create_teacher,
get_all_teachers,
get_teacher_by_id,
update_teacher,
delete_teacher
)


router = APIRouter(
    prefix="/teachers",
    tags=["Teachers"]
)

# post>>>
@router.post(
    "/",
    response_model=TeacherResponse,
    status_code=status.HTTP_201_CREATED
)
def add_teacher(
    teacher_data: TeacherCreate,
    db: Session = Depends(get_db)
):
    return create_teacher(db, teacher_data)

@router.get("/", response_model=list[TeacherResponse])
def list_teachers(db: Session = Depends(get_db)):
    return get_all_teachers(db)



@router.get("/principal-dashboard")
def principal_dashboard(
    current_user: User = Depends(role_required("principal"))
):
    return {
        "message": "Welcome to Principal Dashboard",
        "name": current_user.name,
        "role": current_user.role
    }

#get teacher by id
@router.get("/{teacher_id}", response_model=TeacherResponse)
def get_teacher(
teacher_id: int,
db: Session = Depends(get_db)
):
    return get_teacher_by_id(db, teacher_id)

#update>>>
@router.put("/{teacher_id}", response_model=TeacherResponse)
def edit_teacher(
teacher_id: int,
teacher_data: TeacherCreate,
db: Session = Depends(get_db)
):
    return update_teacher(db, teacher_id, teacher_data)

#delete>>>
@router.delete("/{teacher_id}")
def remove_teacher(
teacher_id: int,
db: Session = Depends(get_db)
):
    return delete_teacher(db, teacher_id)

@router.get("/my-rofile")
def my_profile(
    current_user: User = Depends(get_current_user)
):
    return {
        "message": "Authentication successful",
        "user_id": current_user.id,
        "name": current_user.name,
        "email": current_user.email,
        "role": current_user.role
    }
