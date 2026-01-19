from pydantic_settings import BaseSettings
from typing import List
import os


class Settings(BaseSettings):
    """
    Configurações da aplicação usando Pydantic Settings.
    Carrega variáveis do arquivo .env automaticamente.
    """
    
    # API Settings
    API_V1_STR: str = "/api/v1"
    PROJECT_NAME: str = "Meu Projeto API"
    DEBUG: bool = True
    
    # Database
    DATABASE_URL: str
    DATABASE_HOST: str = "localhost"
    DATABASE_PORT: int = 5432
    DATABASE_USER: str
    DATABASE_PASSWORD: str
    DATABASE_NAME: str
    
    # JWT Authentication
    SECRET_KEY: str
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 30
    
    # CORS - Origens permitidas para fazer requisições
    BACKEND_CORS_ORIGINS: List[str] = [
    "http://localhost:5173",  # Vite
    "http://localhost:3000",  # Create React App
    "http://127.0.0.1:5173",
    "http://127.0.0.1:3000",
]
    
    # Environment
    ENVIRONMENT: str = "development"
    
    class Config:
        env_file = ".env"
        case_sensitive = True
        extra = "allow"  # Permite campos extras do .env


# Instância global das configurações
# Esta instância será importada em outros arquivos
settings = Settings()