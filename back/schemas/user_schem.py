from sqlmodel import SQLModel, Field
from typing import Optional

class UserBase(SQLModel):
    username: str = Field(..., max_length=50)  
    email: str = Field(..., max_length=100)     
    password: str = Field(..., min_length=6)    

class UserCreate(UserBase):
    pass

class UserUpdate(SQLModel):
    username: Optional[str] = Field(default=None, max_length=50)  
    email: Optional[str] = Field(default=None, max_length=100)     
    password: Optional[str] = Field(default=None, min_length=6)   

class UserRead(UserBase):
    id: int