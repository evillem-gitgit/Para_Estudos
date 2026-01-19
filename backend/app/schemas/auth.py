from pydantic import BaseModel, EmailStr
from typing import Optional


class Token(BaseModel):
    """Schema de resposta do token JWT"""
    access_token: str
    token_type: str = "bearer"


class TokenData(BaseModel):
    """Schema dos dados contidos no token"""
    username: Optional[str] = None


class LoginRequest(BaseModel):
    """Schema de requisição de login"""
    email: EmailStr
    password: str