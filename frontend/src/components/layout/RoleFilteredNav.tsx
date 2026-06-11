import {
  LayoutDashboard,
  FileText,
  Briefcase,
  Archive,
  ClipboardCheck,
  BarChart2,
  Users,
} from 'lucide-react';
import { type LucideIcon } from 'lucide-react';
import { useAuthContext } from '@/context/AuthContext';
import { NavItem } from './NavItem';
import { ReviewQueueBadge } from './ReviewQueueBadge';

interface NavSection {
  label: string;
  icon: LucideIcon;
  to: string;
  allowedRoles: string[]; // Empty = all roles allowed
}

// Complete 6×8 role matrix from 02-UI-SPEC.md — MUST match exactly
const NAV_SECTIONS: NavSection[] = [
  {
    label: 'Dashboard',
    icon: LayoutDashboard,
    to: '/dashboard',
    allowedRoles: [], // ALL roles
  },
  {
    label: 'Requests',
    icon: FileText,
    to: '/requests',
    allowedRoles: ['AL', 'EM', 'RO', 'AD'],
  },
  {
    label: 'Engagements',
    icon: Briefcase,
    to: '/engagements',
    allowedRoles: [], // ALL roles
  },
  {
    label: 'Evidence',
    icon: Archive,
    to: '/evidence',
    allowedRoles: ['AN', 'EM', 'QA', 'IR', 'PC', 'AD'],
  },
  {
    label: 'Review Queue',
    icon: ClipboardCheck,
    to: '/review-queue',
    allowedRoles: ['AL', 'QA', 'IR', 'PC', 'AD'],
  },
  {
    label: 'Reports',
    icon: BarChart2,
    to: '/reports',
    allowedRoles: ['AL', 'EM', 'QA', 'PC', 'RO', 'AD'],
  },
  {
    label: 'User Management',
    icon: Users,
    to: '/admin/users',
    allowedRoles: ['AD'], // Admin only
  },
];

// Placeholder badge count — will be replaced by real API call in Phase 3+
const REVIEW_QUEUE_COUNT = 0;

interface RoleFilteredNavProps {
  collapsed?: boolean;
}

export function RoleFilteredNav({ collapsed = false }: RoleFilteredNavProps) {
  const { user } = useAuthContext();
  const userRoles = user?.roles ?? [];

  const visibleSections = NAV_SECTIONS.filter((section) => {
    // Empty allowedRoles = visible to all roles
    if (section.allowedRoles.length === 0) return true;
    // User must have at least one matching role
    return section.allowedRoles.some((role) => userRoles.includes(role));
  });

  return (
    <nav aria-label="Main navigation">
      {visibleSections.map((section) => (
        <NavItem
          key={section.to}
          label={section.label}
          icon={section.icon}
          to={section.to}
          collapsed={collapsed}
          badge={
            section.label === 'Review Queue' ? (
              <ReviewQueueBadge count={REVIEW_QUEUE_COUNT} />
            ) : undefined
          }
        />
      ))}
    </nav>
  );
}
