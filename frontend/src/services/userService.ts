import api from './api';
import type { User, UserUpdate } from '../types/user';

export const userService = {
  /**
   * Listar todos os usuários
   */
  async getUsers(): Promise<User[]> {
    const response = await api.get<User[]>('/users');
    return response.data;
  },

  /**
   * Obter um usuário específico
   */
  async getUser(id: number): Promise<User> {
    const response = await api.get<User>(`/users/${id}`);
    return response.data;
  },

  /**
   * Atualizar usuário
   */
  async updateUser(id: number, data: UserUpdate): Promise<User> {
    const response = await api.put<User>(`/users/${id}`, data);
    return response.data;
  },

  /**
   * Deletar usuário (apenas superuser)
   */
  async deleteUser(id: number): Promise<void> {
    await api.delete(`/users/${id}`);
  },
};