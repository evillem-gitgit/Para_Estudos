from fastapi import APIRouter, Depends, HTTPException, status, Response, Cookie
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy.orm import Session
from typing import Optional
from app.database import get_db
from app.schemas.auth import Token
from app.schemas.user import UserCreate, User
from app.services.auth_service import AuthService
from app.services.user_service import UserService
from app.utils.dependencies import get_current_active_user_from_cookie
from app.models.user import User as UserModel
from app.utils.security import create_access_token

router = APIRouter(prefix="/auth", tags=["Authentication"])


@router.post("/register", response_model=User, status_code=status.HTTP_201_CREATED)
def register(
    user_data: UserCreate,
    db: Session = Depends(get_db)
):
    """
    Registrar um novo usuário.
    """
    return UserService.create_user(db, user_data)


@router.post("/login")
def login(
    response: Response,
    form_data: OAuth2PasswordRequestForm = Depends(),
    db: Session = Depends(get_db)
):
    """
    Login de usuário usando HttpOnly Cookie.
    
    O token JWT é armazenado em um cookie HttpOnly, tornando-o
    inacessível via JavaScript e protegendo contra ataques XSS.
    
    **No Swagger UI:** Use o botão "Authorize"
    - **username**: Coloque seu EMAIL aqui
    - **password**: Sua senha
    """
    # Autenticar usuário
    user = AuthService.authenticate_user(
        db,
        email=form_data.username,
        password=form_data.password
    )
    
    # Criar token JWT
    access_token = create_access_token(data={"sub": user.username})
    
    # Configurar cookie HttpOnly
    response.set_cookie(
        key="access_token",
        value=access_token,
        httponly=True,      # JavaScript não pode acessar
        secure=False,       # True em produção (HTTPS)
        samesite="lax",     # Proteção CSRF
        max_age=1800,       # 30 minutos (mesma duração do token)
        path="/"
    )
    
    return {
        "message": "Login successful",
        "user": {
            "id": user.id,
            "email": user.email,
            "username": user.username,
            "full_name": user.full_name
        }
        
    }

@router.post("/login-json", response_model=Token)
def login_json(
    response: Response,
    form_data: OAuth2PasswordRequestForm = Depends(),
    db: Session = Depends(get_db)
):
    """
    Login alternativo que também retorna token no corpo da resposta.
    Útil para testes e compatibilidade.
    
    TAMBÉM configura o HttpOnly Cookie.
    """
    # Autenticar usuário
    user = AuthService.authenticate_user(
        db,
        email=form_data.username,
        password=form_data.password
    )
    
    # Criar token
    access_token = create_access_token(data={"sub": user.username})
    
    # Configurar cookie
    response.set_cookie(
        key="access_token",
        value=access_token,
        httponly=True,
        secure=False,
        samesite="lax",
        max_age=1800,
        path="/"
    )
    
    return Token(access_token=access_token, token_type="bearer")


@router.get("/me", response_model=User)
def read_users_me(
    current_user: UserModel = Depends(get_current_active_user_from_cookie)
):
    """
    Obter dados do usuário atual autenticado via cookie.
    
    O token é extraído automaticamente do cookie HttpOnly.
    """
    return current_user


@router.post("/logout")
def logout(response: Response):
    """
    Logout do usuário - Remove o cookie.
    """
    response.delete_cookie(
        key="access_token",
        path="/"
    )
    return {"message": "Successfully logged out"}


@router.get("/check")
def check_auth(
    access_token: Optional[str] = Cookie(None)
):
    """
    Endpoint para verificar se o usuário está autenticado.
    Útil para o frontend verificar o estado da sessão.
    """
    if access_token:
        return {"authenticated": True}
    return {"authenticated": False}