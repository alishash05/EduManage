from pydantic import BaseModel, ConfigDict, Field


class StudentCreate(BaseModel):
    class_name: str = Field(min_length=1, max_length=50)
    roll_number: str = Field(min_length=1, max_length=50)


class StudentResponse(BaseModel):
    id: int
    user_id: int
    class_name: str
    roll_number: str

    model_config = ConfigDict(from_attributes=True)