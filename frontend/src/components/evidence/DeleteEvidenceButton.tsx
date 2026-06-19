import React, { useState } from 'react';
import { Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
} from '@/components/ui/alert-dialog';
import { api } from '@/lib/api';
import { useToast } from '@/components/ui/use-toast';
import { useNavigate } from 'react-router-dom';

interface DeleteEvidenceButtonProps {
  engagementId: string;
  evidenceId: string;
  evidenceRef: string;
  objectiveCount: number;
  findingCount?: number;
  onDeleted?: () => void;
}

export const DeleteEvidenceButton: React.FC<DeleteEvidenceButtonProps> = ({
  engagementId,
  evidenceId,
  evidenceRef,
  objectiveCount,
  findingCount = 0,
  onDeleted,
}) => {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  const isLinked = objectiveCount > 0 || findingCount > 0;

  const handleDelete = async () => {
    setDeleting(true);
    try {
      const result = await api.delete(`/api/engagements/${engagementId}/evidence/${evidenceId}`);
      if (result.ok) {
        setDialogOpen(false);
        toast({ title: 'Deleted', description: 'Evidence item deleted.' });
        if (onDeleted) {
          onDeleted();
        } else {
          navigate(`/engagements/${engagementId}`, { replace: true });
        }
      } else {
        toast({
          title: 'Cannot delete',
          description:
            result.error ?? 'Cannot delete — linked to objectives or findings.',
          variant: 'destructive',
        });
        setDialogOpen(false);
      }
    } catch {
      toast({
        title: 'Error',
        description: 'Failed to delete evidence item.',
        variant: 'destructive',
      });
    } finally {
      setDeleting(false);
    }
  };

  if (isLinked) {
    return (
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <span id="delete-evidence-tooltip-anchor" className="inline-block">
              <Button
                variant="ghost"
                className="text-destructive cursor-not-allowed"
                aria-disabled="true"
                aria-describedby="delete-evidence-tooltip"
                tabIndex={0}
                onClick={(e) => e.preventDefault()}
              >
                Delete Evidence
              </Button>
            </span>
          </TooltipTrigger>
          <TooltipContent id="delete-evidence-tooltip">
            Cannot delete — linked to objectives or findings. Unlink first.
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    );
  }

  return (
    <>
      <Button
        variant="ghost"
        className="text-destructive hover:text-destructive"
        onClick={() => setDialogOpen(true)}
      >
        Delete Evidence
      </Button>

      <AlertDialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <AlertDialogContent className="max-w-[480px]">
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Evidence Item {evidenceRef}?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently remove the evidence record and all attached files. This action
              cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <Button
              variant="ghost"
              onClick={() => setDialogOpen(false)}
              disabled={deleting}
            >
              Keep Evidence
            </Button>
            <Button
              variant="destructive"
              onClick={handleDelete}
              disabled={deleting}
            >
              {deleting ? (
                <>
                  <Loader2 size={14} className="animate-spin mr-2" />
                  Deleting...
                </>
              ) : (
                'Delete Evidence'
              )}
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};
