import { useAuthContext } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';

export function TopBar() {
  const { user, logout } = useAuthContext();
  const navigate = useNavigate();

  const initials = user?.display_name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2) ?? '?';

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  return (
    <header
      className="fixed top-0 left-0 right-0 bg-white border-b border-slate-200 flex items-center px-6 z-10"
      style={{ height: 64 }}
    >
      {/* Logo */}
      <div className="font-semibold text-slate-900 text-base" style={{ width: 220 }}>
        EMS
      </div>

      {/* Search placeholder (static in Phase 1 — functional in Phase 2) */}
      <div className="flex-1 mx-6">
        <div className="max-w-md mx-auto">
          <input
            type="text"
            placeholder="Search engagements..."
            disabled
            className="w-full h-9 rounded-md border border-slate-200 px-3 text-sm text-slate-400 bg-slate-50 cursor-not-allowed"
            aria-label="Global search (available in Phase 2)"
          />
        </div>
      </div>

      {/* User menu */}
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2">
          <div
            className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center text-xs font-semibold"
            aria-hidden="true"
          >
            {initials}
          </div>
          <span className="text-sm text-slate-700">{user?.display_name}</span>
        </div>
        <button
          onClick={handleLogout}
          className="text-sm text-slate-600 hover:text-slate-900 px-3 py-1.5 rounded-md hover:bg-slate-100 transition-colors"
        >
          Log Out
        </button>
      </div>
    </header>
  );
}
