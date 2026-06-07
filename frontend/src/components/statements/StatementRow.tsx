import { useState } from 'react';
import { Trash2, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
} from '@/components/ui/alert-dialog';
import { TableCell, TableRow } from '@/components/ui/table';
import { ReferenceStatusBadge } from './ReferenceStatusBadge';
import { WaiveReferenceCheckDialog } from './WaiveReferenceCheckDialog';
import type { Statement } from '@/hooks/useStatements';

interface StatementRowProps {
  statement: Statement;
  sequenceNumber: number;
  canWaive: boolean;
  canDelete: boolean;
  onWaive: (statementId: string, justification: string) => Promise<void>;
  onDelete: (statementId: string) => Promise<void>;
}

export function StatementRow({
  statement,
  sequenceNumber,
  canWaive,
  canDelete,
  onWaive,
  onDelete,
}: StatementRowProps) {
  const [waiveOpen, setWaiveOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState<string | null>(null);

  const isFailed = statement.ref_status === 'failed';

  async function handleDelete() {
    setDeleting(true);
    setDeleteError(null);
    try {
      await onDelete(statement.id);
      setDeleteOpen(false);
    } catch (e: unknown) {
      const err = e as Error & { status?: number };
      if (err.status === 409) {
        setDeleteError(
          'Cannot delete — this statement is linked to a completed reference check. Change status first.'
        );
      } else {
        setDeleteError(e instanceof Error ? e.message : 'Failed to delete statement');
      }
    } finally {
      setDeleting(false);
    }
  }

  async function handleWaiveConfirm(justification: string) {
    await onWaive(statement.id, justification);
    setWaiveOpen(false);
  }

  const discrepancyPreview =
    isFailed && statement.discrepancy_notes
      ? statement.discrepancy_notes.length > 60
        ? statement.discrepancy_notes.slice(0, 60) + '...'
        : statement.discrepancy_notes
      : null;

  return (
    <>
      <TableRow className={isFailed ? 'bg-red-50' : ''}>
        {/* # */}
        <TableCell className="text-xs text-muted-foreground w-10">
          {sequenceNumber}
        </TableCell>

        {/* Statement text */}
        <TableCell className="max-w-[300px]">
          <p className="text-sm line-clamp-2">{statement.statement_text}</p>
          {discrepancyPreview && (
            <p className="text-xs italic text-muted-foreground mt-0.5">
              Discrepancy: {discrepancyPreview}
            </p>
          )}
        </TableCell>

        {/* Evidence count */}
        <TableCell>
          {statement.evidence_count >= 1 ? (
            <span className="inline-flex items-center px-2 py-0.5 rounded text-xs bg-green-100 text-green-800">
              {statement.evidence_count} item{statement.evidence_count !== 1 ? 's' : ''} ✓
            </span>
          ) : (
            <span className="inline-flex items-center px-2 py-0.5 rounded text-xs bg-red-100 text-red-600">
              0 items
            </span>
          )}
        </TableCell>

        {/* Assigned */}
        <TableCell className="text-sm text-muted-foreground">
          {statement.assigned_ir_name ? (
            <span>{statement.assigned_ir_name}</span>
          ) : (
            <span className="italic">(Unassigned)</span>
          )}
        </TableCell>

        {/* Status */}
        <TableCell>
          <ReferenceStatusBadge status={statement.ref_status} />
        </TableCell>

        {/* Actions */}
        <TableCell>
          <div className="flex items-center gap-1">
            {canWaive && statement.ref_status !== 'waived' && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => setWaiveOpen(true)}
                className="text-xs h-7 px-2"
              >
                Waive
              </Button>
            )}
            {canDelete && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setDeleteOpen(true)}
                className="text-xs h-7 px-2 text-destructive hover:text-destructive"
              >
                <Trash2 size={12} />
              </Button>
            )}
          </div>
        </TableCell>
      </TableRow>

      {/* Waive dialog */}
      {waiveOpen && (
        <WaiveReferenceCheckDialog
          statement={statement}
          open={waiveOpen}
          onConfirm={handleWaiveConfirm}
          onCancel={() => setWaiveOpen(false)}
        />
      )}

      {/* Delete confirmation dialog */}
      <AlertDialog open={deleteOpen} onOpenChange={setDeleteOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Statement {sequenceNumber}?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently remove the statement and all reference check records. This action
              cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          {deleteError && (
            <p className="text-sm text-destructive px-1">{deleteError}</p>
          )}
          <AlertDialogFooter>
            <Button
              variant="ghost"
              onClick={() => { setDeleteOpen(false); setDeleteError(null); }}
              disabled={deleting}
            >
              Keep Statement
            </Button>
            <Button
              variant="destructive"
              onClick={handleDelete}
              disabled={deleting}
            >
              {deleting ? (
                <>
                  <Loader2 size={12} className="mr-1 animate-spin" />
                  Deleting...
                </>
              ) : (
                'Delete Statement'
              )}
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
