from sqlmodel import SQLModel, Field

class RecruiterBase(SQLModel):
    first_name: str = Field(max_length=50)
    last_name: str = Field(max_length=100)
    phone_number: str = Field(max_length=10)
    id_user: int
class RecruiterCreate(RecruiterBase):
    pass

class RecruiterRead(RecruiterBase):
    id: int