import { useAuthContext } from '@/context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { GlobalSearchBar } from '@/components/search/GlobalSearchBar';

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
      className="fixed top-0 left-0 right-0 bg-background border-b border-border flex items-center px-6 z-10"
      style={{ height: 64 }}
    >
      {/* Logo */}
      <div className="font-semibold text-foreground text-base shrink-0" style={{ width: 220 }}>
        EMS
      </div>

      {/* Global search — functional (replaces Phase 1 placeholder) */}
      <GlobalSearchBar />

      {/* User menu */}
      <div className="flex items-center gap-3 shrink-0">
        <div className="flex items-center gap-2">
          <div
            className="w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-xs font-semibold"
            aria-hidden="true"
          >
            {initials}
          </div>
          <span className="text-sm text-foreground hidden sm:block">{user?.display_name}</span>
        </div>
        <button
          onClick={handleLogout}
          className="text-sm text-muted-foreground hover:text-foreground px-3 py-1.5 rounded-md hover:bg-muted transition-colors"
        >
          Log Out
        </button>
      </div>
    </header>
  );
}
