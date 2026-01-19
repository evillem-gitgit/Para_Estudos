import api from './api';
import type { Post, PostCreate, PostUpdate } from '../types/post';

export const postService = {
  /**
   * Listar todos os posts
   */
  async getPosts(publishedOnly: boolean = false): Promise<Post[]> {
    const response = await api.get<Post[]>('/posts', {
      params: { published_only: publishedOnly },
    });
    return response.data;
  },

  /**
   * Obter um post específico
   */
  async getPost(id: number): Promise<Post> {
    const response = await api.get<Post>(`/posts/${id}`);
    return response.data;
  },

  /**
   * Criar novo post
   */
  async createPost(data: PostCreate): Promise<Post> {
    const response = await api.post<Post>('/posts', data);
    return response.data;
  },

  /**
   * Atualizar post
   */
  async updatePost(id: number, data: PostUpdate): Promise<Post> {
    const response = await api.put<Post>(`/posts/${id}`, data);
    return response.data;
  },

  /**
   * Deletar post
   */
  async deletePost(id: number): Promise<void> {
    await api.delete(`/posts/${id}`);
  },

  /**
   * Obter posts de um usuário específico
   */
  async getUserPosts(userId: number): Promise<Post[]> {
    const response = await api.get<Post[]>(`/posts/user/${userId}`);
    return response.data;
  },
};