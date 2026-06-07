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
      if (!e.matches) setMobileOpen(false);
    };
    update(mq);
    mq.addEventListener('change', update);
    return () => mq.removeEventListener('change', update);
  }, []);

  const roleLabels = user?.roles.join(', ') ?? '';

  return (
    <>
      {/* Mobile hamburger */}
      <button
        className="md:hidden fixed top-4 left-4 z-30 p-2 rounded-[var(--r-md)] bg-white border border-[var(--c-border)] hover:bg-[var(--c-sunken)] transition-colors duration-150"
        aria-label="Open navigation"
        onClick={() => setMobileOpen(true)}
        style={{ top: 14 }}
      >
        <Menu size={20} className="text-[var(--c-text-1)]" />
      </button>

      {/* Mobile overlay backdrop */}
      {mobileOpen && (
        <div
          className="md:hidden fixed inset-0 z-40 bg-[var(--c-text-1)]/20"
          onClick={() => setMobileOpen(false)}
          aria-hidden="true"
        />
      )}

      {/* Desktop sidebar */}
      <aside
        className={cn(
          'fixed left-0 top-0 h-full bg-white border-r border-[var(--c-border)] z-40 flex flex-col',
          'transition-all duration-150',
          'hidden md:flex',
          collapsed ? 'w-14' : 'w-[220px]',
          mobileOpen && '!flex w-[220px]'
        )}
        style={{ paddingTop: 64 }}
        aria-label="Main navigation"
      >
        {/* Mobile close */}
        {mobileOpen && (
          <button
            className="md:hidden absolute top-4 right-4 p-1 rounded-[var(--r-sm)] hover:bg-[var(--c-sunken)] transition-colors duration-150"
            aria-label="Close navigation"
            onClick={() => setMobileOpen(false)}
          >
            <X size={18} className="text-[var(--c-text-2)]" />
          </button>
        )}

        {/* Nav */}
        <div className="flex-1 overflow-y-auto py-3">
          <RoleFilteredNav collapsed={collapsed && !mobileOpen} />
        </div>

        {/* User info at bottom */}
        <div
          className={cn(
            'border-t border-[var(--c-border)] py-4',
            collapsed && !mobileOpen ? 'px-0 items-center flex flex-col' : 'px-4'
          )}
        >
          {!collapsed || mobileOpen ? (
            <>
              <div className="text-[12px] text-[var(--c-text-2)] mb-1.5 font-sans">
                {user?.display_name}
              </div>
              <div className="flex flex-wrap gap-1">
                {user?.roles.map((role) => (
                  <span
                    key={role}
                    className="inline-block font-mono text-[11px] px-1.5 py-0.5 rounded-[var(--r-sm)] bg-[var(--c-accent-50)] text-[var(--c-accent-800)]"
                  >
                    {role}
                  </span>
                ))}
              </div>
            </>
          ) : (
            <div
              className="w-8 h-8 rounded-full bg-[var(--c-accent-600)] text-white flex items-center justify-center font-mono text-[11px] font-medium"
              title={`${user?.display_name} (${roleLabels})`}
            >
              {user?.display_name?.slice(0, 1) ?? '?'}
            </div>
          )}
        </div>
      </aside>

      {/* Mobile full-screen sidebar overlay */}
      <aside
        className={cn(
          'md:hidden fixed left-0 top-0 h-full w-full bg-white z-40 flex flex-col',
          'transition-transform duration-150',
          mobileOpen ? 'translate-x-0' : '-translate-x-full'
        )}
        style={{ paddingTop: 64 }}
        aria-label="Main navigation"
        aria-hidden={!mobileOpen}
      >
        <button
          className="absolute top-4 right-4 p-1 rounded-[var(--r-sm)] hover:bg-[var(--c-sunken)] transition-colors duration-150"
          aria-label="Close navigation"
          onClick={() => setMobileOpen(false)}
        >
          <X size={18} className="text-[var(--c-text-2)]" />
        </button>
        <div className="flex-1 overflow-y-auto py-3">
          <RoleFilteredNav collapsed={false} />
        </div>
        <div className="border-t border-[var(--c-border)] px-4 py-4">
          <div className="text-[12px] text-[var(--c-text-2)] mb-1.5">{user?.display_name}</div>
          <div className="flex flex-wrap gap-1">
            {user?.roles.map((role) => (
              <span
                key={role}
                className="inline-block font-mono text-[11px] px-1.5 py-0.5 rounded-[var(--r-sm)] bg-[var(--c-accent-50)] text-[var(--c-accent-800)]"
              >
                {role}
              </span>
            ))}
          </div>
        </div>
      </aside>
    </>
  );
}
