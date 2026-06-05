import { useState, useRef, useEffect, FormEvent } from 'react';
import { Eye, EyeOff, Loader2 } from 'lucide-react';
import { useAuthContext } from '../../context/AuthContext';
import { ErrorAlert } from './ErrorAlert';

interface LoginCardProps {
  onSuccess: () => void;
}

export function LoginCard({ onSuccess }: LoginCardProps) {
  const { login } = useAuthContext();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<{ username?: string; password?: string }>({});
  const usernameRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    usernameRef.current?.focus();
  }, []);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    setFieldErrors({});

    // Field validation
    const errors: { username?: string; password?: string } = {};
    if (!username) errors.username = 'Username is required.';
    if (!password) errors.password = 'Password is required.';
    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);
      return;
    }

    setLoading(true);
    try {
      await login(username, password);
      onSuccess();
    } catch (err: unknown) {
      const e = err as { status?: number; message?: string };
      if (e.status === 423) {
        setError('Account locked due to repeated failures. Try again in 15 minutes.');
      } else {
        setError('Invalid username or password.');
      }
    } finally {
      setLoading(false);
    }
  };

  const inputBase = 'w-full h-10 rounded-md border border-slate-200 px-3 py-2 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-offset-0 focus:border-blue-600';
  const inputError = 'border-red-500 focus:ring-red-500 focus:border-red-500';

  return (
    <div className="w-[400px] bg-white rounded-lg border border-slate-200 shadow-md px-8 py-12">
      {/* Heading */}
      <h1 className="text-xl font-semibold text-slate-900 text-center mb-6">
        Sign in to your account
      </h1>

      <form onSubmit={handleSubmit} noValidate>
        {/* Username field */}
        <div className="mb-4">
          <label htmlFor="username" className="block text-sm text-slate-900 mb-2">
            Username
          </label>
          <input
            ref={usernameRef}
            id="username"
            type="text"
            autoComplete="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                document.getElementById('password')?.focus();
              }
            }}
            aria-describedby={fieldErrors.username ? 'username-error' : undefined}
            className={`${inputBase} ${fieldErrors.username ? inputError : ''}`}
          />
          {fieldErrors.username && (
            <p id="username-error" className="mt-1 text-xs text-red-600">
              {fieldErrors.username}
            </p>
          )}
        </div>

        {/* Password field */}
        <div className="mb-6">
          <label htmlFor="password" className="block text-sm text-slate-900 mb-2">
            Password
          </label>
          <div className="relative">
            <input
              id="password"
              type={showPassword ? 'text' : 'password'}
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              aria-describedby={fieldErrors.password ? 'password-error' : undefined}
              className={`${inputBase} pr-10 ${fieldErrors.password ? inputError : ''}`}
            />
            <button
              type="button"
              onClick={() => setShowPassword((prev) => !prev)}
              aria-label={showPassword ? 'Hide password' : 'Show password'}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
            >
              {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          </div>
          {fieldErrors.password && (
            <p id="password-error" className="mt-1 text-xs text-red-600">
              {fieldErrors.password}
            </p>
          )}
        </div>

        {/* Submit button */}
        <button
          type="submit"
          disabled={loading}
          aria-disabled={loading}
          aria-label={loading ? 'Signing in, please wait' : undefined}
          className="w-full h-10 rounded-md bg-blue-600 text-white text-sm font-semibold hover:bg-blue-700 disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2 transition-colors"
        >
          {loading && <Loader2 size={16} className="animate-spin" />}
          {loading ? 'Signing in...' : 'Sign In'}
        </button>

        {/* Error alert — below button, inside card */}
        <ErrorAlert message={error} />
      </form>
    </div>
  );
}
