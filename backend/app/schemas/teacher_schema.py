from pydantic import BaseModel, ConfigDict, EmailStr, Field


class TeacherCreate(BaseModel):
    name: str = Field(min_length=1, max_length=100)
    email: EmailStr
    phone: str = Field(min_length=10, max_length=15)
    subject: str = Field(min_length=1, max_length=100)
    qualification: str = Field(min_length=1, max_length=150)


class TeacherResponse(BaseModel):
    id: int
    name: str
    email: EmailStr
    phone: str
    subject: str
    qualification: str

    model_config = ConfigDict(from_attributes=True)