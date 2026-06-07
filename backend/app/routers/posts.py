from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
from app.database import get_db
from app.schemas.post import Post, PostCreate, PostUpdate
from app.services.post_service import PostService
from app.utils.dependencies import get_current_active_user_from_cookie
from app.models.user import User as UserModel

router = APIRouter(prefix="/posts", tags=["Posts"])


@router.get("", response_model=List[Post])
def read_posts(
    skip: int = 0,
    limit: int = 100,
    published_only: bool = False,
    db: Session = Depends(get_db)
):
    """
    Listar posts (paginado).
    
    Não requer autenticação para posts públicos.
    """
    posts = PostService.get_posts(
        db,
        skip=skip,
        limit=limit,
        published_only=published_only
    )
    return posts




@router.get("/user/{user_id}", response_model=List[Post])
def read_user_posts(
    user_id: int,
    skip: int = 0,
    limit: int = 100,
    db: Session = Depends(get_db)
):
    """
    Listar posts de um usuário específico.
    """
    posts = PostService.get_user_posts(
        db,
        user_id=user_id,
        skip=skip,
        limit=limit
    )
    return posts


@router.get("/{post_id}", response_model=Post)
def read_post(
    post_id: int,
    db: Session = Depends(get_db)
):
    """
    Obter um post específico por ID.
    """
    post = PostService.get_post_by_id(db, post_id)
    if not post:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Post not found"
        )
    return post


@router.post("", response_model=Post, status_code=status.HTTP_201_CREATED)
def create_post(
    post_data: PostCreate,
    db: Session = Depends(get_db),
    current_user: UserModel = Depends(get_current_active_user_from_cookie)
):
    """
    Criar um novo post.
    
    Requer autenticação via cookie.
    """
    return PostService.create_post(db, post_data, current_user)


@router.put("/{post_id}", response_model=Post)
def update_post(
    post_id: int,
    post_data: PostUpdate,
    db: Session = Depends(get_db),
    current_user: UserModel = Depends(get_current_active_user_from_cookie)
):
    """
    Atualizar um post.
    
    Requer autenticação via cookie.
    Apenas o autor ou superusers podem atualizar.
    """
    return PostService.update_post(db, post_id, post_data, current_user)


@router.delete("/{post_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_post(
    post_id: int,
    db: Session = Depends(get_db),
    current_user: UserModel = Depends(get_current_active_user_from_cookie)
):
    """
    Deletar um post.
    
    Requer autenticação via cookie.
    Apenas o autor ou superusers podem deletar.
    """
    PostService.delete_post(db, post_id, current_user)
    return None