import { Navigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

interface PublicRouteProps {
  children: React.ReactNode;
}

/**
 * Rota pública - Apenas usuários NÃO autenticados podem acessar
 * Se estiver autenticado, redireciona para /dashboard
 * Útil para páginas de login e registro
 */
export function PublicRoute({ children }: PublicRouteProps) {
  const { isAuthenticated } = useAuth();

  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }

  return <>{children}</>;
}