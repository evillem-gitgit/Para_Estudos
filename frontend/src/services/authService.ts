import api from './api';
import type { LoginCredentials, RegisterData } from '../types/auth';
import type { User } from '../types/user';

/**
 * AuthService usando HttpOnly Cookies
 */

export const authService = {
  /**
   * Fazer login
   */
  async login(credentials: LoginCredentials): Promise<any> {
    console.log('📡 authService.login() iniciado');
    console.log('📧 Email:', credentials.email);
    
    // Criar URLSearchParams (formato correto para OAuth2)
    const formData = new URLSearchParams();
    formData.append('username', credentials.email);
    formData.append('password', credentials.password);

    try {
      console.log('🚀 Enviando requisição POST /auth/login...');
      
      const response = await api.post('/auth/login', formData.toString(), {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      });
      
      console.log('✅ Login bem-sucedido!');
      console.log('📦 Resposta:', response.data);
      
      return response.data;
      
    } catch (error: any) {
      console.error('❌ authService.login() ERRO:');
      console.error('Status:', error.response?.status);
      console.error('Data:', error.response?.data);
      console.error('Error completo:', error);
      
      // Re-lançar o erro para o AuthContext/Login.tsx capturar
      throw error;
    }
  },

  /**
   * Registrar novo usuário
   */
  async register(data: RegisterData): Promise<User> {
    const response = await api.post<User>('/auth/register', data);
    return response.data;
  },

  /**
   * Obter dados do usuário atual
   */
  async getCurrentUser(): Promise<User> {
    const response = await api.get<User>('/auth/me');
    return response.data;
  },

  /**
   * Fazer logout
   */
  async logout(): Promise<void> {
    await api.post('/auth/logout');
  },

  /**
   * Verificar se está autenticado
   */
  async isAuthenticated(): Promise<boolean> {
    try {
      const response = await api.get('/auth/check');
      return response.data.authenticated;
    } catch {
      return false;
    }
  },
};