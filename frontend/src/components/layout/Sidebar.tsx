import { useState, useEffect } from 'react';
import { Menu, X } from 'lucide-react';
import { useAuthContext } from '@/context/AuthContext';
import { RoleFilteredNav } from './RoleFilteredNav';
import { cn } from '@/lib/utils';

export function Sidebar() {
  const { user } = useAuthContext();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [collapsed, setCollapsed] = useState(false);

  // Detect tablet breakpoint (≤1024px) for collapsed mode
  useEffect(() => {
    const mq = window.matchMedia('(max-width: 1024px)');
    const update = (e: MediaQueryListEvent | MediaQueryList) => {
      setCollapsed(e.matches);
      if (!e.matches) setMobileOpen(false); // Close mobile overlay on resize to desktop
    };
    update(mq);
    mq.addEventListener('change', update);
    return () => mq.removeEventListener('change', update);
  }, []);

  const roleLabels = user?.roles.join(', ') ?? '';

  return (
    <>
      {/* Mobile hamburger button (visible <768px only) */}
      <button
        className="md:hidden fixed top-4 left-4 z-30 p-2 rounded-md bg-background border border-border hover:bg-muted transition-colors"
        aria-label="Open navigation"
        onClick={() => setMobileOpen(true)}
        style={{ top: 14 }}
      >
        <Menu size={20} className="text-foreground" />
      </button>

      {/* Mobile overlay backdrop */}
      {mobileOpen && (
        <div
          className="md:hidden fixed inset-0 z-40 bg-foreground/20"
          onClick={() => setMobileOpen(false)}
          aria-hidden="true"
        />
      )}

      {/* Sidebar — desktop (collapsed at 1024px) + mobile overlay */}
      <aside
        className={cn(
          'fixed left-0 top-0 h-full bg-secondary border-r border-border z-40 flex flex-col transition-all duration-200',
          // Desktop: always visible; width toggles between 220px (expanded) and 56px (collapsed)
          'hidden md:flex',
          collapsed ? 'w-14' : 'w-[220px]',
          // Mobile override: full-width overlay when mobileOpen
          mobileOpen && '!flex w-[220px]'
        )}
        style={{ paddingTop: 64 }}
        aria-label="Main navigation"
      >
        {/* Mobile close button */}
        {mobileOpen && (
          <button
            className="md:hidden absolute top-4 right-4 p-1 rounded-md hover:bg-muted"
            aria-label="Close navigation"
            onClick={() => setMobileOpen(false)}
          >
            <X size={18} className="text-muted-foreground" />
          </button>
        )}

        {/* Scrollable nav area */}
        <div className="flex-1 overflow-y-auto py-4">
          <RoleFilteredNav collapsed={collapsed && !mobileOpen} />
        </div>

        {/* Bottom: user info */}
        <div className={cn('border-t border-border py-4', collapsed && !mobileOpen ? 'px-0 items-center flex flex-col' : 'px-4')}>
          {!collapsed || mobileOpen ? (
            <>
              <div className="text-xs text-muted-foreground mb-1">{user?.display_name}</div>
              {user?.roles.map((role) => (
                <span
                  key={role}
                  className="inline-block text-xs px-1.5 py-0.5 rounded bg-primary text-primary-foreground mr-1 mb-1"
                >
                  {role}
                </span>
              ))}
            </>
          ) : (
            <div
              className="w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-xs font-semibold"
              title={`${user?.display_name} (${roleLabels})`}
            >
              {user?.display_name?.slice(0, 1) ?? '?'}
            </div>
          )}
        </div>
      </aside>

      {/* Mobile sidebar overlay (below md breakpoint: full-screen) */}
      <aside
        className={cn(
          'md:hidden fixed left-0 top-0 h-full w-full bg-background z-40 flex flex-col transition-transform duration-200',
          mobileOpen ? 'translate-x-0' : '-translate-x-full'
        )}
        style={{ paddingTop: 64 }}
        aria-label="Main navigation"
        aria-hidden={!mobileOpen}
      >
        <button
          className="absolute top-4 right-4 p-1 rounded-md hover:bg-muted"
          aria-label="Close navigation"
          onClick={() => setMobileOpen(false)}
        >
          <X size={18} className="text-muted-foreground" />
        </button>
        <div className="flex-1 overflow-y-auto py-4">
          <RoleFilteredNav collapsed={false} />
        </div>
        <div className="border-t border-border px-4 py-4">
          <div className="text-xs text-muted-foreground mb-1">{user?.display_name}</div>
          {user?.roles.map((role) => (
            <span
              key={role}
              className="inline-block text-xs px-1.5 py-0.5 rounded bg-primary text-primary-foreground mr-1 mb-1"
            >
              {role}
            </span>
          ))}
        </div>
      </aside>
    </>
  );
}
