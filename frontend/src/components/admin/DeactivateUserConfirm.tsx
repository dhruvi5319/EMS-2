import {
  AlertDialog, AlertDialogContent, AlertDialogTitle, AlertDialogDescription,
  AlertDialogFooter, AlertDialogCancel, AlertDialogAction,
} from '@/components/ui/alert-dialog';
import { useToast } from '@/components/ui/use-toast';
import { useState } from 'react';
import type { UserRecord } from '@/hooks/useUsers';
import type { useUsers } from '@/hooks/useUsers';

interface DeactivateUserConfirmProps {
  user: UserRecord | null;
  open: boolean;
  onClose: () => void;
  onConfirm: ReturnType<typeof useUsers>['deactivate'];
}

export function DeactivateUserConfirm({ user, open, onClose, onConfirm }: DeactivateUserConfirmProps) {
  const { toast } = useToast();
  const [submitting, setSubmitting] = useState(false);

  const handleConfirm = async () => {
    if (!user) return;
    setSubmitting(true);
    try {
      await onConfirm(user.id);
      toast({ title: 'User deactivated.' });
      onClose();
    } catch {
      toast({ title: 'Failed to deactivate user.', variant: 'destructive' });
    } finally {
      setSubmitting(false);
    }
  };

  if (!user) return null;

  return (
    <AlertDialog open={open} onOpenChange={(o) => { if (!o) onClose(); }}>
      <AlertDialogContent className="max-w-[480px]">
        {/* "Deactivate {user full_name}?" — exact title pattern from UI-SPEC */}
        <AlertDialogTitle>Deactivate {user.display_name}?</AlertDialogTitle>
        <AlertDialogDescription>
          They will no longer be able to log in. This can be reversed.
        </AlertDialogDescription>
        <AlertDialogFooter>
          {/* [Keep User Active] — exact copy from UI-SPEC */}
          <AlertDialogCancel onClick={onClose}>Keep User Active</AlertDialogCancel>
          {/* [Confirm Deactivate] — destructive — exact copy from UI-SPEC */}
          <AlertDialogAction
            onClick={handleConfirm}
            disabled={submitting}
            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
          >
            {submitting ? 'Deactivating...' : 'Confirm Deactivate'}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
