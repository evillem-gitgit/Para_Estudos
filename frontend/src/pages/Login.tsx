import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { Card } from '../components/common/Card';
import { LoginForm } from '../components/features/auth/LoginForm';
import type { LoginCredentials } from '../types/auth';

export function Login() {
  const navigate = useNavigate();
  const { login, isLoading } = useAuth();
  
  // Estado LOCAL para o erro (não depende do AuthContext)
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleLogin = async (credentials: LoginCredentials) => {
    try {
      // Limpar erro anterior
      setErrorMessage(null);
      
      // Tentar fazer login
      await login(credentials);
      
      // Se chegou aqui, login foi SUCESSO
      console.log('✅ Login bem-sucedido! Navegando para dashboard...');
      navigate('/dashboard');
      
    } catch (err: any) {
      // Se entrou aqui, login FALHOU
      console.error('❌ Login falhou:', err);
      
      // Extrair mensagem de erro
      const message = err?.response?.data?.detail || 
                      err?.message || 
                      'Email ou senha incorretos';
      
      setErrorMessage(message);
      
      // NÃO navega para dashboard
      console.log('🚫 Permanecendo na página de login');
    }
  };

  const handleClearError = () => {
    setErrorMessage(null);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-gray-900">Fazer Login</h2>
          <p className="mt-2 text-sm text-gray-600">
            Ou{' '}
            <Link to="/register" className="text-primary-600 hover:text-primary-700 font-medium">
              crie uma nova conta
            </Link>
          </p>
        </div>

        <Card>
          <LoginForm
            onSubmit={handleLogin}
            error={errorMessage}
            isLoading={isLoading}
            onClearError={handleClearError}
          />
        </Card>

      </div>
    </div>
  );
}