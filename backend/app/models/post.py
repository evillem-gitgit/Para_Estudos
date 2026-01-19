from sqlalchemy import Column, Integer, Text, Boolean, DateTime, ForeignKey
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from app.database import Base


class Post(Base):
    """
    Model de Post/Artigo.
    Representa a tabela 'posts' no banco de dados.
    """
    
    __tablename__ = "posts"
    
    id = Column(Integer, primary_key=True, index=True)
    title = Column(Text, nullable=False, index=True)
    content = Column(Text, nullable=False)
    is_published = Column(Boolean, default=False)
    
    # Foreign Key para User
    author_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    
    # Timestamps
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
    
    # Relacionamento com User
    author = relationship("User", back_populates="posts")
    
    def __repr__(self):
        return f"<Post(id={self.id}, title={self.title}, author_id={self.author_id})>"