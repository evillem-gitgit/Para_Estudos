import axios from 'axios';
import { API_URL } from '../utils/constants';

// Criar instância do Axios
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true, // IMPORTANTE: Envia cookies automaticamente
});

// Interceptor de resposta para tratar erros de autenticação
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // APENAS redirecionar se:
    // 1. Erro 401
    // 2. NÃO for na rota de login
    // 3. NÃO for na rota de check
    const isLoginRoute = error.config?.url?.includes('/auth/login');
    const isCheckRoute = error.config?.url?.includes('/auth/check');
    const isRegisterRoute = error.config?.url?.includes('/auth/register');
    
    if (error.response?.status === 401 && !isLoginRoute && !isCheckRoute && !isRegisterRoute) {
      // Token inválido ou expirado em OUTRAS rotas
      console.log('🚫 401 em rota protegida - redirecionando para login');
      window.location.href = '/login';
    }
    
    // Se for erro de login, apenas retornar o erro (NÃO redirecionar)
    if (isLoginRoute) {
      console.error('❌ Erro no login:', error.response?.data);
    }
    
    return Promise.reject(error);
  }
);

export default api;