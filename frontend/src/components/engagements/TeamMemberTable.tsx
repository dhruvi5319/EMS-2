import { useState } from 'react';
import { Users } from 'lucide-react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/lib/utils';
import type { TeamAssignment } from '@/lib/team.api';

// Role badge color mapping per UI-SPEC Screen 4
const ROLE_BADGE_COLORS: Record<string, string> = {
  EM: 'bg-blue-100 text-blue-800',
  QA: 'bg-purple-100 text-purple-800',
  AN: 'bg-teal-100 text-teal-800',
  IR: 'bg-orange-100 text-orange-800',
  PC: 'bg-amber-100 text-amber-800',
  AL: 'bg-gray-100 text-gray-600',
  RO: 'bg-gray-100 text-gray-600',
};

const ROLE_LABELS: Record<string, string> = {
  EM: 'Engagement Mgr',
  QA: 'QA Reviewer',
  AN: 'Analyst',
  IR: 'Indep. Ref.',
  PC: 'Project Coord.',
  AL: 'Audit Lead',
  RO: 'Read Only',
};

function TeamRoleBadge({ role }: { role: string }) {
  const colors = ROLE_BADGE_COLORS[role] ?? 'bg-gray-100 text-gray-600';
  const label = ROLE_LABELS[role] ?? role;
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs',
        colors,
      )}
    >
      <span className="font-medium">[{role}]</span>
      {label}
    </span>
  );
}

export interface RemoveGuard {
  blocked: boolean;
  tooltip: string;
}

interface TeamMemberTableProps {
  assignments: TeamAssignment[];
  loading: boolean;
  canEdit: boolean;
  canRemove: (assignment: TeamAssignment) => RemoveGuard;
  onRemove: (assignment: TeamAssignment) => Promise<void>;
}

function SkeletonRow() {
  return (
    <TableRow>
      <TableCell><Skeleton className="h-4 w-32" /></TableCell>
      <TableCell><Skeleton className="h-5 w-24" /></TableCell>
      <TableCell><Skeleton className="h-8 w-16" /></TableCell>
    </TableRow>
  );
}

export function TeamMemberTable({
  assignments,
  loading,
  canEdit,
  canRemove,
  onRemove,
}: TeamMemberTableProps) {
  const [confirmAssignment, setConfirmAssignment] = useState<TeamAssignment | null>(null);
  const [removing, setRemoving] = useState(false);

  async function handleConfirmRemove() {
    if (!confirmAssignment) return;
    setRemoving(true);
    try {
      await onRemove(confirmAssignment);
    } finally {
      setRemoving(false);
      setConfirmAssignment(null);
    }
  }

  if (loading) {
    return (
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Role</TableHead>
            {canEdit && <TableHead>Actions</TableHead>}
          </TableRow>
        </TableHeader>
        <TableBody>
          <SkeletonRow />
          <SkeletonRow />
          <SkeletonRow />
        </TableBody>
      </Table>
    );
  }

  if (assignments.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-10 space-y-2">
        <Users className="h-8 w-8 text-slate-300" />
        <p className="text-xl font-semibold text-foreground">No team members assigned yet.</p>
        <p className="text-sm text-muted-foreground">
          Add at least one Engagement Manager and QA Reviewer before submitting for P2.
        </p>
      </div>
    );
  }

  return (
    <>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Role</TableHead>
            {canEdit && <TableHead>Actions</TableHead>}
          </TableRow>
        </TableHeader>
        <TableBody>
          {assignments.map((a) => {
            const guard = canEdit ? canRemove(a) : { blocked: false, tooltip: '' };
            return (
              <TableRow key={a.id} className="h-12">
                <TableCell className="text-sm">{a.user.display_name}</TableCell>
                <TableCell>
                  <TeamRoleBadge role={a.role} />
                </TableCell>
                {canEdit && (
                  <TableCell>
                    <div className="relative group/remove inline-block">
                      <Button
                        variant="outline"
                        size="sm"
                        className={cn(
                          'text-xs h-9 text-destructive border-destructive hover:bg-destructive/10',
                          guard.blocked && 'opacity-50 cursor-not-allowed',
                        )}
                        disabled={guard.blocked}
                        onClick={() => {
                          if (!guard.blocked) setConfirmAssignment(a);
                        }}
                        aria-label={`Remove ${a.user.display_name}`}
                      >
                        Remove
                      </Button>
                      {guard.blocked && guard.tooltip && (
                        <div className="absolute bottom-full left-0 mb-1 hidden group-hover/remove:block z-10 w-64 rounded bg-slate-800 px-2 py-1 text-xs text-white shadow-lg">
                          {guard.tooltip}
                        </div>
                      )}
                    </div>
                  </TableCell>
                )}
              </TableRow>
            );
          })}
        </TableBody>
      </Table>

      <AlertDialog
        open={!!confirmAssignment}
        onOpenChange={(open) => {
          if (!open) setConfirmAssignment(null);
        }}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              Remove {confirmAssignment?.user.display_name}?
            </AlertDialogTitle>
            <AlertDialogDescription>
              They will no longer have access to this engagement in this role. This can be
              reversed.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Keep Objective</AlertDialogCancel>
            <AlertDialogAction
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              onClick={handleConfirmRemove}
              disabled={removing}
            >
              {removing ? 'Removing...' : 'Confirm Remove'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
