from fastapi import HTTPException, status
from sqlalchemy.orm import Session

from app.models.teacher import Teacher
from app.schemas.teacher_schema import TeacherCreate


# CREATE a teacher
def create_teacher(db: Session, teacher_data: TeacherCreate):

    existing_teacher = (
        db.query(Teacher)
        .filter(Teacher.email == teacher_data.email)
        .first()
    )

    if existing_teacher:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="Teacher with this email already exists"
        )

    new_teacher = Teacher(
        name=teacher_data.name,
        email=teacher_data.email,
        phone=teacher_data.phone,
        subject=teacher_data.subject,
        qualification=teacher_data.qualification
    )

    try:
        db.add(new_teacher)
        db.commit()
        db.refresh(new_teacher)

        return new_teacher

    except Exception:
        db.rollback()
        raise


# READ all teachers
def get_all_teachers(db: Session):

    return db.query(Teacher).all()


# READ one teacher by ID
def get_teacher_by_id(db: Session, teacher_id: int):

    teacher = (
        db.query(Teacher)
        .filter(Teacher.id == teacher_id)
        .first()
    )

    if not teacher:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Teacher not found"
        )

    return teacher


# UPDATE a teacher
def update_teacher(
    db: Session,
    teacher_id: int,
    teacher_data: TeacherCreate
):

    teacher = get_teacher_by_id(db, teacher_id)

    # Check whether another teacher uses this email
    existing_teacher = (
        db.query(Teacher)
        .filter(
            Teacher.email == teacher_data.email,
            Teacher.id != teacher_id
        )
        .first()
    )

    if existing_teacher:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="Another teacher already uses this email"
        )

    teacher.name = teacher_data.name
    teacher.email = teacher_data.email
    teacher.phone = teacher_data.phone
    teacher.subject = teacher_data.subject
    teacher.qualification = teacher_data.qualification

    try:
        db.commit()
        db.refresh(teacher)

        return teacher

    except Exception:
        db.rollback()
        raise


# DELETE a teacher
def delete_teacher(db: Session, teacher_id: int):

    teacher = get_teacher_by_id(db, teacher_id)

    try:
        db.delete(teacher)
        db.commit()

        return {
            "message": "Teacher deleted successfully"
        }

    except Exception:
        db.rollback()
        raise