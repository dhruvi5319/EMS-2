import { useNavigate } from 'react-router-dom';
import { LoginCard } from '../components/auth/LoginCard';

export function LoginPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center">
      {/* Wordmark above card */}
      <div className="mb-8 text-center">
        <div className="text-[28px] font-semibold text-slate-900">EMS</div>
        <div className="text-sm text-slate-500 mt-1">Engagement Management System</div>
      </div>

      <LoginCard onSuccess={() => navigate('/dashboard')} />

      {/* Footer */}
      <p className="mt-8 text-xs text-slate-400">© 2026 Engagement Management System</p>
    </div>
  );
}
