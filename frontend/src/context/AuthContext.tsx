import type { ReactNode } from 'react';
import { createContext, useState, useEffect } from 'react';
import { authService } from '../services/authService';
import type { User } from '../types/user';
import type { LoginCredentials, RegisterData } from '../types/auth';
import { getErrorMessage } from '../utils/helpers';

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  error: string | null;
  login: (credentials: LoginCredentials) => Promise<void>;
  register: (data: RegisterData) => Promise<boolean>;
  logout: () => Promise<void>;
  clearError: () => void;
  isAuthenticated: boolean;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const clearError = () => {
    setError(null);
  };

  // Carregar usuário ao iniciar (verifica cookie)
  useEffect(() => {
    const loadUser = async () => {
      try {
        const isAuth = await authService.isAuthenticated();
        if (isAuth) {
          const userData = await authService.getCurrentUser();
          setUser(userData);
        }
      } catch (err) {
        console.error('Error loading user:', err);
      } finally {
        setIsLoading(false);
      }
    };

    loadUser();
  }, []);

  // Fazer login
  const login = async (credentials: LoginCredentials): Promise<void> => {
    console.log('🔐 AuthContext.login() chamado');
    setIsLoading(true);
    
    try {
      const response = await authService.login(credentials);
      console.log('✅ authService.login() retornou:', response);
      
      setUser(response.user);
      setError(null); // Limpar erro apenas se SUCESSO
      
      console.log('✅ User setado no estado');
    } catch (err) {
      console.error('❌ authService.login() falhou:', err);
      
      const errorMessage = getErrorMessage(err);
      setError(errorMessage);
      
      // IMPORTANTE: Re-lançar o erro para o Login.tsx capturar
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  // Registrar
  const register = async (data: RegisterData): Promise<boolean> => {
  setIsLoading(true);
  
  try {
    await authService.register(data);

    // Login automático após registrar
    await login({
      email: data.email,
      password: data.password,
    });
    return true;
  } catch (err) {
    const errorMessage = getErrorMessage(err);
    setError(errorMessage);
    return false;
  } finally {
    setIsLoading(false);
  }
};

  // Fazer logout
  const logout = async () => {
    try {
      await authService.logout();
      setUser(null);
      setError(null);
    } catch (err) {
      console.error('Logout error:', err);
    }
  };

  const value: AuthContextType = {
    user,
    isLoading,
    error,
    login,
    register,
    logout,
    clearError,
    isAuthenticated: !!user,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}