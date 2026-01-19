import { useState, type FormEvent } from 'react';
import { Mail, Lock } from 'lucide-react';
import { Button } from '../../common/Button';
import { Input } from '../../common/Input';
import type { LoginCredentials } from '../../../types/auth';

interface LoginFormProps {
  onSubmit: (credentials: LoginCredentials) => Promise<void>;
  error?: string | null;
  isLoading?: boolean;
  onClearError?: () => void;
}

export function LoginForm({ onSubmit, error, isLoading = false, onClearError }: LoginFormProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    await onSubmit({ email, password });
  };

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
    // Limpar erro quando começar a digitar
    if (error && onClearError) {
      onClearError();
    }
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value);
    // Limpar erro quando começar a digitar
    if (error && onClearError) {
      onClearError();
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
          {error}
        </div>
      )}

      <div className="space-y-4">
        <div className="relative">
          <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <Input
            type="email"
            placeholder="Email"
            value={email}
            onChange={handleEmailChange}
            className="pl-10"
            required
            autoComplete="email"
          />
        </div>

        <div className="relative">
          <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <Input
            type="password"
            placeholder="Senha"
            value={password}
            onChange={handlePasswordChange}
            className="pl-10"
            required
            autoComplete="current-password"
          />
        </div>
      </div>

      <Button type="submit" variant="primary" className="w-full" isLoading={isLoading}>
        Entrar
      </Button>
    </form>
  );
}