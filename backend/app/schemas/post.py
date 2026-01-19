from pydantic import BaseModel, Field
from typing import Optional
from datetime import datetime


class PostBase(BaseModel):
    """Schema base para Post"""
    title: str = Field(..., min_length=1)
    content: str = Field(..., min_length=1)
    is_published: bool = False


class PostCreate(PostBase):
    """Schema para criar um novo post"""
    pass


class PostUpdate(BaseModel):
    """Schema para atualizar um post"""
    title: Optional[str] = Field(None, min_length=1)
    content: Optional[str] = Field(None, min_length=1)
    is_published: Optional[bool] = None


class PostInDB(PostBase):
    """Schema do post como está no banco"""
    id: int
    author_id: int
    created_at: datetime
    updated_at: Optional[datetime] = None
    
    class Config:
        from_attributes = True


class Post(PostBase):
    """Schema de resposta do post"""
    id: int
    author_id: int
    created_at: datetime
    
    class Config:
        from_attributes = True