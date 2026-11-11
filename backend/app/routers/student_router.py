
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.database.connection import get_db
from app.models.student import Student
from app.schemas.student_schema import StudentCreate, StudentResponse

from app.core.dependencies import get_current_user, role_required


router = APIRouter(
    prefix="/students",
    tags=["Students"]
)


@router.post(
    "/",
    response_model=StudentResponse,
    status_code=status.HTTP_201_CREATED
)
def create_student(
    data: StudentCreate,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user)
):

    # Check user role
    if current_user.role.lower() != "principal":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Only Principal can create student records"
        )

    # Check duplicate roll number
    existing_student = db.query(Student).filter(
        Student.roll_number == data.roll_number
    ).first()

    if existing_student:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="Student roll number already exists"
        )

    # Create student
    student = Student(
        user_id=current_user.id,
        class_name=data.class_name,
        roll_number=data.roll_number
    )

    db.add(student)

    try:
        db.commit()
        db.refresh(student)
    except Exception:
        db.rollback()
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Unable to create student"
        )

    return student

@router.get("/", response_model=list[StudentResponse])
def get_students(
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user)
):
    if current_user.role.lower() not in ["principal","teacher"]:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Only Principal can view all students"
        )

    students = db.query(Student).order_by(Student.id.desc()).all()

    return students


@router.get("/{student_id}", response_model=StudentResponse)
def get_student_by_id(
    student_id: int,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user)
):
    if current_user.role.lower() not in ["principal", "teacher"]:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Only Principal can view student details"
        )

    student = db.query(Student).filter(
        Student.id == student_id
    ).first()

    if not student:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Student not found"
        )

    return student