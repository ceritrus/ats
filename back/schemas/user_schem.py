from sqlmodel import SQLModel, Field

class UserBase(SQLModel):
    username: str = Field(max_length=50)
    email: str = Field(max_length=100)
    password: str

class UserCreate(UserBase):
    pass

class UserRead(UserBase):
    id: int