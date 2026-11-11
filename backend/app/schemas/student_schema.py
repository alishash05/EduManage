from datetime import date
from pydantic import BaseModel, ConfigDict, Field


class StudentCreate(BaseModel):
    class_name: str = Field(min_length=1, max_length=50)
    roll_number: str = Field(min_length=1, max_length=50)


class StudentResponse(BaseModel):
    id: int
    user_id: int
    admission_no: str
    name: str
    email: str
    phone: str
    date_of_birth: date | None = None
    gender: str | None = None
    class_name: str
    section: str | None = None
    guardian_name: str | None = None

    model_config = ConfigDict(from_attributes=True)