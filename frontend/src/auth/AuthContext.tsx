/**
 * AuthContext — re-exports from src/context/AuthContext.
 * Canonical source is src/context/AuthContext.tsx; this module provides
 * the src/auth/ path alias expected by the plan and future phases.
 */
export {
  AuthProvider,
  useAuthContext,
  type AuthUser,
} from '../context/AuthContext';
