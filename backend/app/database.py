from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
from app.config import settings

# Criar engine do SQLAlchemy
engine = create_engine(
    settings.DATABASE_URL,
    echo=settings.DEBUG,  # Log SQL queries em modo debug
    pool_pre_ping=True,  # Verifica conexão antes de usar
)

# Criar SessionLocal class
SessionLocal = sessionmaker(
    autocommit=False,
    autoflush=False,
    bind=engine
)

# Base class para os models
Base = declarative_base()


def get_db():
    """
    Dependency que cria uma sessão de database.
    Usado nos endpoints FastAPI para injeção de dependência.
    
    Uso:
        @app.get("/users")
        def get_users(db: Session = Depends(get_db)):
            ...
    """
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()