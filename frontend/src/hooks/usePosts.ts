import { useState, useEffect } from 'react';
import { postService } from '../services/postService';
import type { Post, PostCreate, PostUpdate } from '../types/post';
import { getErrorMessage } from '../utils/helpers';

/**
 * Hook para gerenciar posts
 */
export function usePosts(publishedOnly: boolean = false) {
  const [posts, setPosts] = useState<Post[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Carregar posts
  const fetchPosts = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const data = await postService.getPosts(publishedOnly);
      setPosts(data);
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setIsLoading(false);
    }
  };

  // Criar post
  const createPost = async (data: PostCreate): Promise<Post | null> => {
    try {
      const newPost = await postService.createPost(data);
      setPosts((prev) => [newPost, ...prev]);
      return newPost;
    } catch (err) {
      setError(getErrorMessage(err));
      return null;
    }
  };

  // Atualizar post
  const updatePost = async (id: number, data: PostUpdate): Promise<Post | null> => {
    try {
      const updatedPost = await postService.updatePost(id, data);
      setPosts((prev) =>
        prev.map((post) => (post.id === id ? updatedPost : post))
      );
      return updatedPost;
    } catch (err) {
      setError(getErrorMessage(err));
      return null;
    }
  };

  // Deletar post
  const deletePost = async (id: number): Promise<boolean> => {
    try {
      await postService.deletePost(id);
      setPosts((prev) => prev.filter((post) => post.id !== id));
      return true;
    } catch (err) {
      setError(getErrorMessage(err));
      return false;
    }
  };
  // Carregar posts ao montar o componente
  useEffect(() => {
    fetchPosts();
  }, [publishedOnly]);

  return {
    posts,
    isLoading,
    error,
    fetchPosts,
    createPost,
    updatePost,
    deletePost,
  };
}