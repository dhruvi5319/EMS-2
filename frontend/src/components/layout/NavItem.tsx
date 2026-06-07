import { NavLink } from 'react-router-dom';
import { type LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

interface NavItemProps {
  label: string;
  icon: LucideIcon;
  to: string;
  badge?: React.ReactNode;
  collapsed?: boolean;
}

export function NavItem({ label, icon: Icon, to, badge, collapsed = false }: NavItemProps) {
  return (
    <NavLink
      to={to}
      aria-label={collapsed ? label : undefined}
      className={({ isActive }) =>
        cn(
          'flex items-center h-10 text-[13px] transition-[color,background-color,border-color] duration-150 cursor-pointer group relative select-none',
          collapsed ? 'justify-center px-0' : 'gap-2.5 pr-4',
          isActive
            ? [
                'text-[var(--c-accent-600)]',
                'bg-[var(--c-accent-50)]',
                'border-l-2 border-[var(--c-accent-600)]',
                collapsed ? 'pl-0 justify-center' : 'pl-[14px]',
              ].join(' ')
            : [
                'text-[var(--c-text-2)]',
                'hover:text-[var(--c-text-1)]',
                'hover:bg-[var(--c-sunken)]',
                'border-l-2 border-transparent',
                collapsed ? 'pl-0' : 'pl-4',
              ].join(' ')
        )
      }
    >
      {({ isActive }) => (
        <>
          {/* Collapsed tooltip */}
          {collapsed && (
            <span
              className="absolute left-14 z-50 hidden group-hover:flex group-focus-within:flex items-center px-2 py-1 rounded-[var(--r-sm)] bg-[var(--c-text-1)] text-white text-[12px] whitespace-nowrap pointer-events-none shadow-md"
              role="tooltip"
            >
              {label}
            </span>
          )}

          <Icon
            size={16}
            className={cn(
              'shrink-0',
              isActive ? 'text-[var(--c-accent-600)]' : 'text-[var(--c-text-3)]'
            )}
            aria-hidden="true"
          />

          {!collapsed && (
            <>
              <span className="flex-1 font-sans">{label}</span>
              {badge && <span className="ml-auto">{badge}</span>}
            </>
          )}

          {isActive && <span className="sr-only">(current page)</span>}
        </>
      )}
    </NavLink>
  );
}
