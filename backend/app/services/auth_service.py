from sqlalchemy.orm import Session
from fastapi import HTTPException, status
from app.models.user import User
from app.schemas.auth import LoginRequest, Token
from app.utils.security import verify_password, create_access_token


class AuthService:
    """
    Service responsável pela autenticação de usuários.
    Contém a lógica de negócio para login e geração de tokens.
    """
    
    @staticmethod
    def authenticate_user(db: Session, email: str, password: str) -> User:
        """
        Autentica um usuário verificando email e senha.
        
        Args:
            db: Sessão do banco de dados
            email: Email do usuário
            password: Senha em texto plano
            
        Returns:
            Usuário autenticado
            
        Raises:
            HTTPException: Se as credenciais forem inválidas
        """
        user = db.query(User).filter(User.email == email).first()
        
        if not user:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Email ou senha incorretos",
                headers={"WWW-Authenticate": "Bearer"},
            )
        
        if not verify_password(password, user.hashed_password):
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Email ou senha incorretos",
                headers={"WWW-Authenticate": "Bearer"},
            )
        
        return user
    
    @staticmethod
    def login(db: Session, login_data: LoginRequest) -> Token:
        """
        Realiza o login e retorna um token JWT.
        
        Args:
            db: Sessão do banco de dados
            login_data: Dados de login (email e senha)
            
        Returns:
            Token JWT
        """
        # Autenticar usuário
        user = AuthService.authenticate_user(
            db,
            login_data.email,
            login_data.password
        )
        
        # Criar token de acesso
        access_token = create_access_token(data={"sub": user.username})
        
        return Token(access_token=access_token, token_type="bearer")
    