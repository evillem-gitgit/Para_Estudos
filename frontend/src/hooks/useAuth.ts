import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';

/**
 * Hook para acessar o contexto de autenticação
 * 
 * Uso:
 * const { user, login, logout, isLoading } = useAuth();
 */
export function useAuth() {
  const context = useContext(AuthContext);
  
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  
  return context;
}