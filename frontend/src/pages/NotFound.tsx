import { Link } from 'react-router-dom';
import { Home } from 'lucide-react';
import { Button } from '../components/common/Button';

export function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="text-center">
        <h1 className="text-9xl font-bold text-primary-600 mb-4">404</h1>
        <h2 className="text-3xl font-bold text-gray-900 mb-4">Página não encontrada</h2>
        <p className="text-gray-600 mb-8 max-w-md">
          A página que você está procurando não existe ou foi movida.
        </p>
        <Link to="/">
          <Button variant="primary" className="flex items-center gap-2 mx-auto">
            <Home className="w-5 h-5" />
            Voltar para Home
          </Button>
        </Link>
      </div>
    </div>
  );
}