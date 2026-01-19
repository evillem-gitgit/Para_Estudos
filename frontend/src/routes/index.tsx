import { Routes, Route } from 'react-router-dom';
import { ProtectedRoute } from './ProtectedRoute';
import { PublicRoute } from './PublicRoute';

// Pages
import { Home } from '../pages/Home';
import { Login } from '../pages/Login';
import { Register } from '../pages/Register';
import { Dashboard } from '../pages/Dashboard';
import { NotFound } from '../pages/NotFound';

export function AppRoutes() {
  return (
    <Routes>
      {/* Rota pública - Home */}
      <Route path="/" element={<Home />} />

      {/* Rotas públicas - Apenas para não autenticados */}
      <Route
        path="/login"
        element={
          <PublicRoute>
            <Login />
          </PublicRoute>
        }
      />
      <Route
        path="/register"
        element={
          <PublicRoute>
            <Register />
          </PublicRoute>
        }
      />

      {/* Rotas protegidas - Apenas para autenticados */}
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        }
      />

      {/* 404 - Página não encontrada */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}