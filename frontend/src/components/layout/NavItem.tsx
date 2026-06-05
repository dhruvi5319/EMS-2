import { NavLink } from 'react-router-dom';
import { type LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

interface NavItemProps {
  label: string;
  icon: LucideIcon;
  to: string;
  badge?: React.ReactNode;
  collapsed?: boolean; // 56px icon-only mode
}

export function NavItem({ label, icon: Icon, to, badge, collapsed = false }: NavItemProps) {
  return (
    <NavLink
      to={to}
      aria-label={collapsed ? label : undefined}
      className={({ isActive }) =>
        cn(
          'flex items-center h-10 text-sm transition-colors cursor-pointer group relative',
          collapsed ? 'justify-center px-0' : 'gap-2 pr-4',
          isActive
            ? 'text-primary bg-muted border-l-4 border-primary'
            : 'text-foreground hover:bg-muted border-l-4 border-transparent',
          collapsed && isActive ? 'pl-0 justify-center' : collapsed ? 'pl-0' : isActive ? 'pl-3' : 'pl-4'
        )
      }
    >
      {({ isActive }) => (
        <>
          {/* Collapsed tooltip */}
          {collapsed && (
            <span
              className="absolute left-14 z-50 hidden group-hover:flex group-focus-within:flex items-center px-2 py-1 rounded-md bg-foreground text-background text-xs whitespace-nowrap pointer-events-none shadow-md"
              role="tooltip"
            >
              {label}
            </span>
          )}

          <Icon
            size={16}
            className={cn(
              'shrink-0',
              isActive ? 'text-primary' : 'text-muted-foreground'
            )}
            aria-hidden="true"
          />

          {!collapsed && (
            <>
              <span className="flex-1">{label}</span>
              {badge && <span className="ml-auto">{badge}</span>}
            </>
          )}

          {/* Active indicator aria */}
          {isActive && <span className="sr-only">(current page)</span>}
        </>
      )}
    </NavLink>
  );
}
