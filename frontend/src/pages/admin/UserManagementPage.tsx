import { useState } from 'react';
import { useToast } from '@/components/ui/use-toast';
import { useUsers } from '@/hooks/useUsers';
import { UserTable } from '@/components/admin/UserTable';
import { CreateUserDialog } from '@/components/admin/CreateUserDialog';
import { EditUserRolesDialog } from '@/components/admin/EditUserRolesDialog';
import { DeactivateUserConfirm } from '@/components/admin/DeactivateUserConfirm';
import type { UserRecord } from '@/hooks/useUsers';

export function UserManagementPage() {
  const { toast } = useToast();
  const { users, loading, createUser, updateRoles, deactivate, activate } = useUsers();

  const [createOpen, setCreateOpen] = useState(false);
  const [editUser, setEditUser] = useState<UserRecord | null>(null);
  const [deactivateUser, setDeactivateUser] = useState<UserRecord | null>(null);

  const handleActivate = async (userId: string) => {
    try {
      await activate(userId);
      toast({ title: 'User reactivated.' });
    } catch {
      toast({ title: 'Failed to reactivate user.', variant: 'destructive' });
    }
  };

  return (
    <div>
      {/* Page header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          {/* Breadcrumb */}
          <nav aria-label="Breadcrumb" className="mb-1">
            <ol className="flex items-center gap-1 text-xs text-muted-foreground">
              <li>Admin</li>
              <li aria-hidden="true">›</li>
              <li className="text-foreground">User Management</li>
            </ol>
          </nav>
          <h1 className="text-xl font-semibold text-foreground">User Management</h1>
        </div>
        {/* [+ Create User] button — top-right per UI-SPEC */}
        <button
          onClick={() => setCreateOpen(true)}
          className="inline-flex items-center gap-2 px-4 py-2 text-sm font-semibold bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors"
        >
          + Create User
        </button>
      </div>

      {/* User table */}
      <UserTable
        users={users}
        loading={loading}
        onEditRoles={(user) => setEditUser(user)}
        onDeactivate={(user) => setDeactivateUser(user)}
        onActivate={handleActivate}
      />

      {/* Dialogs */}
      <CreateUserDialog
        open={createOpen}
        onClose={() => setCreateOpen(false)}
        onCreate={createUser}
      />
      <EditUserRolesDialog
        user={editUser}
        open={editUser !== null}
        onClose={() => setEditUser(null)}
        onSave={updateRoles}
      />
      <DeactivateUserConfirm
        user={deactivateUser}
        open={deactivateUser !== null}
        onClose={() => setDeactivateUser(null)}
        onConfirm={deactivate}
      />
    </div>
  );
}
