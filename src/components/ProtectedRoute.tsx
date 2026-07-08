import { Navigate } from 'react-router-dom';
import { isRegistered } from '@/lib/auth';
import { type ReactNode } from 'react';

interface ProtectedRouteProps {
  children: ReactNode;
}

export default function ProtectedRoute({ children }: ProtectedRouteProps) {
  if (!isRegistered()) {
    return <Navigate to="/checking" replace />;
  }
  return <>{children}</>;
}
