from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
from app.database import get_db
from app.schemas.user import User, UserUpdate
from app.services.user_service import UserService
from app.utils.dependencies import get_current_active_user, get_current_superuser
from app.models.user import User as UserModel

router = APIRouter(prefix="/users", tags=["Users"])


@router.get("/", response_model=List[User])
def read_users(
    skip: int = 0,
    limit: int = 100,
    db: Session = Depends(get_db),
    current_user: UserModel = Depends(get_current_active_user)
):
    """
    Listar todos os usuários (paginado).
    
    Requer autenticação.
    
    - **skip**: Número de registros a pular (default: 0)
    - **limit**: Número máximo de registros (default: 100)
    """
    users = UserService.get_users(db, skip=skip, limit=limit)
    return users


@router.get("/{user_id}", response_model=User)
def read_user(
    user_id: int,
    db: Session = Depends(get_db),
    current_user: UserModel = Depends(get_current_active_user)
):
    """
    Obter um usuário específico por ID.
    
    Requer autenticação.
    """
    user = UserService.get_user_by_id(db, user_id)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found"
        )
    return user


@router.put("/{user_id}", response_model=User)
def update_user(
    user_id: int,
    user_data: UserUpdate,
    db: Session = Depends(get_db),
    current_user: UserModel = Depends(get_current_active_user)
):
    """
    Atualizar um usuário.
    
    - Usuários podem atualizar seus próprios dados
    - Superusers podem atualizar qualquer usuário
    """
    # Verificar permissões
    if current_user.id != user_id and not current_user.is_superuser:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not enough permissions"
        )
    
    return UserService.update_user(db, user_id, user_data)


@router.delete("/{user_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_user(
    user_id: int,
    db: Session = Depends(get_db),
    current_user: UserModel = Depends(get_current_superuser)
):
    """
    Deletar um usuário.
    
    Apenas superusers podem deletar usuários.
    """
    UserService.delete_user(db, user_id)
    return None