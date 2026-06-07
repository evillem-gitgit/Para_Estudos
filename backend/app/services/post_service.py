from sqlalchemy.orm import Session, joinedload
from fastapi import HTTPException, status
from typing import List, Optional
from app.models.post import Post
from app.models.user import User
from app.schemas.post import PostCreate, PostUpdate


class PostService:
    """
    Service responsável pelas operações CRUD de posts.
    """
    
    @staticmethod
    def get_post_by_id(db: Session, post_id: int) -> Optional[Post]:
        """Busca um post por ID."""
        return db.query(Post).filter(Post.id == post_id).first()
    
    @staticmethod
    def get_posts(
        db: Session,
        skip: int = 0,
        limit: int = 100,
        published_only: bool = False
    ) -> List[Post]:
        """
        Lista posts com paginação.
        
        Args:
            db: Sessão do banco de dados
            skip: Número de posts para pular
            limit: Limite de posts a retornar
            published_only: Se True, retorna apenas posts publicados
        """
        query = db.query(Post).options(
            joinedload(Post.author)
        )
        
        if published_only:
            query = query.filter(Post.is_published == True)
        
        return query.offset(skip).limit(limit).all()
    
    @staticmethod
    def get_user_posts(
        db: Session,
        user_id: int,
        skip: int = 0,
        limit: int = 100
    ) -> List[Post]:
        """Lista posts de um usuário específico."""
        return db.query(Post).options(
            joinedload(Post.author)
        ).filter(
            Post.author_id == user_id
        ).offset(skip).limit(limit).all()
    
    @staticmethod
    def create_post(
        db: Session,
        post_data: PostCreate,
        author: User
    ) -> Post:
        """
        Cria um novo post.
        
        Args:
            db: Sessão do banco de dados
            post_data: Dados do novo post
            author: Usuário autor do post
            
        Returns:
            Post criado
        """
        db_post = Post(
            title=post_data.title,
            content=post_data.content,
            is_published=post_data.is_published,
            author_id=author.id
        )
        
        db.add(db_post)
        db.commit()
        db.refresh(db_post)
        
        return db_post
    
    @staticmethod
    def update_post(
        db: Session,
        post_id: int,
        post_data: PostUpdate,
        current_user: User
    ) -> Post:
        """
        Atualiza um post existente.
        
        Args:
            db: Sessão do banco de dados
            post_id: ID do post a ser atualizado
            post_data: Novos dados do post
            current_user: Usuário atual (para verificar permissão)
            
        Returns:
            Post atualizado
            
        Raises:
            HTTPException: Se post não existir ou usuário não tiver permissão
        """
        db_post = PostService.get_post_by_id(db, post_id)
        if not db_post:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Post not found"
            )
        
        # Verificar se o usuário é o autor ou superuser
        if db_post.author_id != current_user.id and not current_user.is_superuser:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Not enough permissions"
            )
        
        # Atualizar campos se fornecidos
        update_data = post_data.model_dump(exclude_unset=True)
        for field, value in update_data.items():
            setattr(db_post, field, value)
        
        db.commit()
        db.refresh(db_post)
        
        return db_post
    
    @staticmethod
    def delete_post(
        db: Session,
        post_id: int,
        current_user: User
    ) -> bool:
        """
        Deleta um post.
        
        Args:
            db: Sessão do banco de dados
            post_id: ID do post a ser deletado
            current_user: Usuário atual (para verificar permissão)
            
        Returns:
            True se deletado com sucesso
            
        Raises:
            HTTPException: Se post não existir ou usuário não tiver permissão
        """
        db_post = PostService.get_post_by_id(db, post_id)
        if not db_post:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Post not found"
            )
        
        # Verificar se o usuário é o autor ou superuser
        if db_post.author_id != current_user.id and not current_user.is_superuser:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Not enough permissions"
            )
        
        db.delete(db_post)
        db.commit()
        
        return True