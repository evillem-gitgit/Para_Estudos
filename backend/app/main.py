from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.config import settings
from app.routers import auth_router, users_router, posts_router

# Criar aplicação FastAPI
app = FastAPI(
    title=settings.PROJECT_NAME,
    version="1.0.0",
    description="API completa com autenticação JWT, CRUD de usuários e posts",
    docs_url="/docs",
    redoc_url="/redoc"
)

# Configurar CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.BACKEND_CORS_ORIGINS,
    allow_credentials=True,  # IMPORTANTE para cookies!
    allow_methods=["*"],
    allow_headers=["*"],
)

# Incluir routers
app.include_router(auth_router, prefix=settings.API_V1_STR)
app.include_router(users_router, prefix=settings.API_V1_STR)
app.include_router(posts_router, prefix=settings.API_V1_STR)


@app.get("/")
def root():
    """
    Endpoint raiz da API.
    """
    return {
        "message": "Bem-vindo à API!",
        "docs": "/docs",
        "version": "1.0.0"
    }


@app.get("/health")
def health_check():
    """
    Health check endpoint para verificar se a API está funcionando.
    """
    return {
        "status": "healthy",
        "environment": settings.ENVIRONMENT
    }


# Evento de startup (opcional)
@app.on_event("startup")
async def startup_event():
    """
    Executado quando a aplicação inicia.
    Pode ser usado para inicializar conexões, etc.
    """
    print(f"🚀 {settings.PROJECT_NAME} iniciado!")
    print(f"📝 Documentação: http://localhost:8000/docs")
    print(f"🔧 Environment: {settings.ENVIRONMENT}")


# Evento de shutdown (opcional)
@app.on_event("shutdown")
async def shutdown_event():
    """
    Executado quando a aplicação é desligada.
    Pode ser usado para fechar conexões, etc.
    """
    print("👋 Aplicação encerrada!")