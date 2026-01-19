from pydantic import BaseModel, EmailStr, Field
from typing import Optional
from datetime import datetime


class UserBase(BaseModel):
    """Schema base para User"""
    email: EmailStr
    username: str = Field(..., min_length=3, max_length=50)
    full_name: Optional[str] = None
    is_active: bool = True
    is_superuser: bool = False


class UserCreate(BaseModel):
    """Schema para criar um novo usuário"""
    email: EmailStr
    username: str = Field(..., min_length=3, max_length=50)
    password: str = Field(..., min_length=6, max_length=100)
    full_name: Optional[str] = None


class UserUpdate(BaseModel):
    """Schema para atualizar um usuário"""
    email: Optional[EmailStr] = None
    username: Optional[str] = Field(None, min_length=3, max_length=50)
    full_name: Optional[str] = None
    password: Optional[str] = Field(None, min_length=6, max_length=100)
    is_active: Optional[bool] = None


class UserInDB(UserBase):
    """Schema do usuário como está no banco"""
    id: int
    created_at: datetime
    updated_at: Optional[datetime] = None
    
    class Config:
        from_attributes = True


class User(UserBase):
    """Schema de resposta do usuário (sem dados sensíveis)"""
    id: int
    created_at: datetime
    
    class Config:
        from_attributes = True