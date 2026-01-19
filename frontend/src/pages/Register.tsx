import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { Card } from '../components/common/Card';
import { RegisterForm } from '../components/features/auth/RegisterForm';
import type { RegisterData } from '../types/auth';

export function Register() {
  const navigate = useNavigate();
  const { register, error } = useAuth();
  const [isLoading, setIsLoading] = useState(false);

  const handleRegister = async (data: RegisterData) => {
    setIsLoading(true);
    try {
      const success = await register(data);
      if (success) {
        navigate('/dashboard');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-gray-900">Criar Conta</h2>
          <p className="mt-2 text-sm text-gray-600">
            Já tem uma conta?{' '}
            <Link to="/login" className="text-primary-600 hover:text-primary-700 font-medium">
              Faça login
            </Link>
          </p>
        </div>

        <Card>
          <RegisterForm onSubmit={handleRegister} error={error} isLoading={isLoading} />
        </Card>
      </div>
    </div>
  );
}