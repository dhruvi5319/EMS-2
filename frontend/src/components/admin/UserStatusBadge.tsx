import { cn } from '@/lib/utils';

interface UserStatusBadgeProps {
  isActive: boolean;
}

// Status badge colors from UI-SPEC
// Active: green-100 / green-800; Deactivated: gray-100 / gray-600
export function UserStatusBadge({ isActive }: UserStatusBadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center px-2 py-0.5 rounded text-xs font-medium',
        isActive
          ? 'bg-green-100 text-green-800'
          : 'bg-gray-100 text-gray-600'
      )}
    >
      {isActive ? 'Active' : 'Deactivated'}
    </span>
  );
}
