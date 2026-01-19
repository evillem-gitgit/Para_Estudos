// API Base URL
export const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api/v1';

// Routes
export const ROUTES = {
  HOME: '/',
  LOGIN: '/login',
  REGISTER: '/register',
  DASHBOARD: '/dashboard',
  PROFILE: '/profile',
  NOT_FOUND: '*',
} as const;

// Messages
export const MESSAGES = {
  LOGIN_SUCCESS: 'Login realizado com sucesso!',
  LOGOUT_SUCCESS: 'Logout realizado com sucesso!',
  REGISTER_SUCCESS: 'Cadastro realizado com sucesso!',
  ERROR_GENERIC: 'Ocorreu um erro. Tente novamente.',
  ERROR_NETWORK: 'Erro de conexão. Verifique sua internet.',
} as const;