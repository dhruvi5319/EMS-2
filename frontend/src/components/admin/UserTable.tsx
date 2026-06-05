import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from '@/components/ui/table';
import { Skeleton } from '@/components/ui/skeleton';
import { UserStatusBadge } from './UserStatusBadge';
import type { UserRecord } from '@/hooks/useUsers';

interface UserTableProps {
  users: UserRecord[];
  loading: boolean;
  onEditRoles: (user: UserRecord) => void;
  onDeactivate: (user: UserRecord) => void;
  onActivate: (userId: string) => void;
}

export function UserTable({ users, loading, onEditRoles, onDeactivate, onActivate }: UserTableProps) {
  if (loading) {
    return (
      <div className="space-y-2 mt-4">
        {[0, 1, 2, 3, 4].map((i) => (
          <Skeleton key={i} className="h-12 w-full rounded-md" />
        ))}
      </div>
    );
  }

  if (users.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center">
        <h2 className="text-xl font-semibold text-foreground mb-2">No users found.</h2>
        <p className="text-sm text-muted-foreground">Create the first user to get started.</p>
      </div>
    );
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Name</TableHead>
          <TableHead>Email</TableHead>
          <TableHead>Roles</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {users.map((user) => (
          <TableRow key={user.id}>
            <TableCell className="font-medium text-sm">{user.display_name}</TableCell>
            <TableCell className="text-sm text-muted-foreground">{user.email}</TableCell>
            <TableCell>
              <div className="flex flex-wrap gap-1">
                {user.roles.map((role) => (
                  <span
                    key={role}
                    className="inline-flex items-center px-1.5 py-0.5 rounded text-xs font-medium bg-primary text-primary-foreground"
                  >
                    {role}
                  </span>
                ))}
              </div>
            </TableCell>
            <TableCell>
              <UserStatusBadge isActive={user.is_active} />
            </TableCell>
            <TableCell>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => onEditRoles(user)}
                  className="text-xs text-primary hover:underline"
                >
                  Edit Roles
                </button>
                {user.is_active ? (
                  <button
                    onClick={() => onDeactivate(user)}
                    className="text-xs text-muted-foreground hover:text-destructive"
                  >
                    Deactivate
                  </button>
                ) : (
                  <button
                    onClick={() => onActivate(user.id)}
                    className="text-xs text-muted-foreground hover:text-primary"
                  >
                    Reactivate
                  </button>
                )}
              </div>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
