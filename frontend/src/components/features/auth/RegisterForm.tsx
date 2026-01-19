import { useState, type FormEvent } from 'react';
import { Mail, Lock, User, UserCircle } from 'lucide-react';
import { Button } from '../../common/Button';
import { Input } from '../../common/Input';
import type { RegisterData } from '../../../types/auth';

interface RegisterFormProps {
  onSubmit: (data: RegisterData) => Promise<void>;
  error?: string | null;
  isLoading?: boolean;
}

export function RegisterForm({ onSubmit, error, isLoading = false }: RegisterFormProps) {
  const [formData, setFormData] = useState({
    email: '',
    username: '',
    password: '',
    confirmPassword: '',
    full_name: '',
  });
  const [formError, setFormError] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    setFormError('');
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setFormError('');

    // Validações
    if (formData.password !== formData.confirmPassword) {
      setFormError('As senhas não coincidem');
      return;
    }

    if (formData.password.length < 6) {
      setFormError('A senha deve ter pelo menos 6 caracteres');
      return;
    }

    await onSubmit({
      email: formData.email,
      username: formData.username,
      password: formData.password,
      full_name: formData.full_name || undefined,
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {(error || formError) && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
          {error || formError}
        </div>
      )}

      <div className="relative">
        <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
        <Input
          type="email"
          name="email"
          placeholder="Email"
          value={formData.email}
          onChange={handleChange}
          className="pl-10"
          required
        />
      </div>

      <div className="relative">
        <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
        <Input
          type="text"
          name="username"
          placeholder="Nome de usuário"
          value={formData.username}
          onChange={handleChange}
          className="pl-10"
          required
        />
      </div>

      <div className="relative">
        <UserCircle className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
        <Input
          type="text"
          name="full_name"
          placeholder="Nome completo (opcional)"
          value={formData.full_name}
          onChange={handleChange}
          className="pl-10"
        />
      </div>

      <div className="relative">
        <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
        <Input
          type="password"
          name="password"
          placeholder="Senha"
          value={formData.password}
          onChange={handleChange}
          className="pl-10"
          required
        />
      </div>

      <div className="relative">
        <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
        <Input
          type="password"
          name="confirmPassword"
          placeholder="Confirmar senha"
          value={formData.confirmPassword}
          onChange={handleChange}
          className="pl-10"
          required
        />
      </div>

      <Button type="submit" variant="primary" className="w-full" isLoading={isLoading}>
        Criar Conta
      </Button>
    </form>
  );
}