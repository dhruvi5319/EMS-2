import { Navigate } from 'react-router-dom';
import { useAuthContext } from '../context/AuthContext';

/**
 * ProtectedRoute — renders children only when the user is authenticated.
 * Unauthenticated users are redirected to /login.
 * While the auth state is loading (session-restore in progress), renders a
 * full-screen spinner so the redirect doesn't flash.
 */
export function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuthContext();

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-muted-foreground text-sm">Loading...</div>
      </div>
    );
  }

  if (!user) return <Navigate to="/login" replace />;
  return <>{children}</>;
}
