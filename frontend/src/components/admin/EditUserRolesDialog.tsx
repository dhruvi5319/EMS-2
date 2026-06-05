import { useState, useEffect, FormEvent } from 'react';
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogClose,
} from '@/components/ui/dialog';
import { useToast } from '@/components/ui/use-toast';
import { Loader2 } from 'lucide-react';
import { RoleCheckboxGroup } from './RoleCheckboxGroup';
import type { UserRecord } from '@/hooks/useUsers';
import type { useUsers } from '@/hooks/useUsers';

interface EditUserRolesDialogProps {
  user: UserRecord | null;
  open: boolean;
  onClose: () => void;
  onSave: ReturnType<typeof useUsers>['updateRoles'];
}

export function EditUserRolesDialog({ user, open, onClose, onSave }: EditUserRolesDialogProps) {
  const { toast } = useToast();
  const [roles, setRoles] = useState<string[]>(user?.roles ?? []);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Sync roles when user changes
  useEffect(() => {
    if (user) setRoles(user.roles);
  }, [user]);

  const handleClose = () => {
    setError(null);
    onClose();
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!user) return;
    if (roles.length === 0) {
      setError('At least one role is required.');
      return;
    }
    setSubmitting(true);
    setError(null);
    try {
      await onSave(user.id, roles);
      toast({ title: 'Roles updated.' });
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update roles.');
    } finally {
      setSubmitting(false);
    }
  };

  if (!user) return null;

  return (
    <Dialog open={open} onOpenChange={(o) => { if (!o) handleClose(); }}>
      <DialogContent className="max-w-[520px]">
        <DialogHeader>
          {/* "Edit Roles — {user full_name}" — exact heading pattern from UI-SPEC */}
          <DialogTitle className="text-xl font-semibold">
            Edit Roles — {user.display_name}
          </DialogTitle>
        </DialogHeader>

        {error && (
          <p role="alert" className="text-sm text-destructive">{error}</p>
        )}

        <form onSubmit={handleSubmit} noValidate>
          <RoleCheckboxGroup
            selectedRoles={roles}
            onChange={setRoles}
            error={roles.length === 0 && error ? error : undefined}
          />

          <DialogFooter className="pt-4">
            {/* [Discard Changes] — exact copy from UI-SPEC */}
            <DialogClose asChild>
              <button
                type="button"
                onClick={handleClose}
                className="px-4 py-2 text-sm text-muted-foreground hover:text-foreground rounded-md hover:bg-muted transition-colors"
              >
                Discard Changes
              </button>
            </DialogClose>
            <button
              type="submit"
              disabled={submitting}
              className="px-4 py-2 text-sm font-semibold bg-primary text-primary-foreground rounded-md hover:bg-primary/90 disabled:opacity-70 disabled:cursor-not-allowed flex items-center gap-2 transition-colors"
            >
              {submitting && <Loader2 size={14} className="animate-spin" />}
              {submitting ? 'Saving...' : 'Save Roles'}
            </button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
