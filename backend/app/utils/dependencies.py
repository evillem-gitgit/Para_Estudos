from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from sqlalchemy.orm import Session
from jose import JWTError
from app.database import get_db
from app.utils.security import decode_access_token
from app.models.user import User
from fastapi import Cookie
from typing import Optional

# OAuth2 scheme - Pega o token do header Authorization: Bearer <token>
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/api/v1/auth/login")


async def get_current_user(
    token: str = Depends(oauth2_scheme),
    db: Session = Depends(get_db)
) -> User:
    """
    Dependency que retorna o usuário atual baseado no token JWT.
    
    Uso nos endpoints:
        @app.get("/me")
        def read_me(current_user: User = Depends(get_current_user)):
            return current_user
    
    Args:
        token: Token JWT extraído do header Authorization
        db: Sessão do banco de dados
        
    Returns:
        Usuário autenticado
        
    Raises:
        HTTPException: Se o token for inválido ou usuário não existir
    """
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    
    # Decodificar o token
    payload = decode_access_token(token)
    if payload is None:
        raise credentials_exception
    
    username: str = payload.get("sub")
    if username is None:
        raise credentials_exception
    
    # Buscar usuário no banco
    user = db.query(User).filter(User.username == username).first()
    if user is None:
        raise credentials_exception
    
    return user


async def get_current_active_user(
    current_user: User = Depends(get_current_user)
) -> User:
    """
    Dependency que verifica se o usuário está ativo.
    
    Args:
        current_user: Usuário autenticado
        
    Returns:
        Usuário ativo
        
    Raises:
        HTTPException: Se o usuário estiver inativo
    """
    if not current_user.is_active:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Inactive user"
        )
    return current_user


async def get_current_superuser(
    current_user: User = Depends(get_current_active_user)
) -> User:
    """
    Dependency que verifica se o usuário é superuser.
    
    Args:
        current_user: Usuário ativo autenticado
        
    Returns:
        Superuser
        
    Raises:
        HTTPException: Se o usuário não for superuser
    """
    if not current_user.is_superuser:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not enough permissions"
        )
    return current_user



async def get_current_user_from_cookie(
    access_token: Optional[str] = Cookie(None),
    db: Session = Depends(get_db)
) -> User:
    """
    Dependency que retorna o usuário atual baseado no cookie HttpOnly.
    
    Similar ao get_current_user, mas busca o token do cookie ao invés
    do header Authorization.
    
    Args:
        access_token: Token JWT extraído do cookie
        db: Sessão do banco de dados
        
    Returns:
        Usuário autenticado
        
    Raises:
        HTTPException: Se o token for inválido ou usuário não existir
    """
    if not access_token:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Not authenticated - No cookie found",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    
    # Decodificar o token
    payload = decode_access_token(access_token)
    if payload is None:
        raise credentials_exception
    
    username: str = payload.get("sub")
    if username is None:
        raise credentials_exception
    
    # Buscar usuário no banco
    user = db.query(User).filter(User.username == username).first()
    if user is None:
        raise credentials_exception
    
    return user


async def get_current_active_user_from_cookie(
    current_user: User = Depends(get_current_user_from_cookie)
) -> User:
    """
    Dependency que verifica se o usuário do cookie está ativo.
    
    Args:
        current_user: Usuário autenticado via cookie
        
    Returns:
        Usuário ativo
        
    Raises:
        HTTPException: Se o usuário estiver inativo
    """
    if not current_user.is_active:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Inactive user"
        )
    return current_user

