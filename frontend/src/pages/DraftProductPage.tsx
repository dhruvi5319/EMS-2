import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FileEdit, Lock, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/components/ui/use-toast';
import { useAuthContext } from '@/context/AuthContext';
import { useDraftProduct } from '@/hooks/useDraftProduct';
import type { DraftStatus } from '@/hooks/useDraftProduct';
import { DraftStatusStepper } from '@/components/draft/DraftStatusStepper';
import { DraftStatusBadge } from '@/components/draft/DraftStatusBadge';
import { CreateDraftProductDialog } from '@/components/draft/CreateDraftProductDialog';
import { DraftFileSection } from '@/components/draft/DraftFileSection';
import { ReviewCommentThread } from '@/components/draft/ReviewCommentThread';
import { StatementsIndexingSummary } from '@/components/draft/StatementsIndexingSummary';
import type { GateDecision } from '@/lib/engagements.api';

const ADVANCE_BUTTON_LABELS: Record<DraftStatus, string> = {
  drafting: 'Advance to Under Review →',
  under_review: 'Mark Ready for Reference Check →',
  ready_for_ref_check: 'Mark Ready for Final Review →',
  ready_for_final_review: 'Proceed to Gate P4 →',
};

const NEXT_STATUS: Record<DraftStatus, DraftStatus | null> = {
  drafting: 'under_review',
  under_review: 'ready_for_ref_check',
  ready_for_ref_check: 'ready_for_final_review',
  ready_for_final_review: null,
};

const STATUS_LABELS: Record<DraftStatus, string> = {
  drafting: 'Drafting',
  under_review: 'Under Review',
  ready_for_ref_check: 'Ready for Reference Check',
  ready_for_final_review: 'Ready for Final Review',
};

interface DraftProductPageProps {
  engagementId: string;
  gateDecisions?: GateDecision[];
}

export default function DraftProductPage({ engagementId, gateDecisions = [] }: DraftProductPageProps) {
  const { user } = useAuthContext();
  const { toast } = useToast();
  const navigate = useNavigate();

  const {
    draft,
    loading,
    fetchDraft,
    createDraft,
    updateDraft,
    uploadFile,
    removeFile,
    fetchComments,
    addComment,
  } = useDraftProduct(engagementId);

  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [advancing, setAdvancing] = useState(false);
  const [returning, setReturning] = useState(false);

  const roles = user?.roles ?? [];
  const canCreate = roles.some((r) => ['EM', 'AN', 'AD'].includes(r));
  const canAdvance = roles.some((r) => ['EM', 'AD'].includes(r));
  const canReturn = roles.some((r) => ['QA', 'AD'].includes(r));
  const canEditMeta = roles.some((r) => ['EM', 'AN', 'AD'].includes(r));
  const canEditFile = roles.some((r) => ['EM', 'AN', 'AD'].includes(r));
  const canAddComment = roles.some((r) => ['EM', 'QA', 'AN', 'AD'].includes(r));

  const p3Approved = gateDecisions.some(
    (d) =>
      d.gate_name === 'P3' &&
      (d.decision?.toLowerCase() === 'approved' ||
        d.decision?.toLowerCase() === 'approve'),
  );

  useEffect(() => {
    fetchDraft();
  }, [fetchDraft]);

  async function handleCreate(data: { title: string; version: string; owner_id: string }) {
    await createDraft(data);
    toast({ title: 'Draft product record created.' });
  }

  async function handleAdvance() {
    if (!draft) return;
    if (draft.status === 'ready_for_final_review') {
      navigate(`/engagements/${engagementId}/gates/p4`);
      return;
    }
    const nextStatus = NEXT_STATUS[draft.status];
    if (!nextStatus) return;
    setAdvancing(true);
    try {
      await updateDraft({ status: nextStatus });
      toast({ title: `Draft status updated to ${STATUS_LABELS[nextStatus]}.` });
    } catch {
      toast({ title: 'Failed to update draft status.', variant: 'destructive' });
    } finally {
      setAdvancing(false);
    }
  }

  async function handleReturnToDrafting() {
    if (!draft) return;
    setReturning(true);
    try {
      await updateDraft({ status: 'drafting' });
      toast({ title: 'Draft status updated to Drafting.' });
    } catch {
      toast({ title: 'Failed to return to drafting.', variant: 'destructive' });
    } finally {
      setReturning(false);
    }
  }

  if (loading) {
    return (
      <div className="flex items-center gap-2 py-8 text-sm text-muted-foreground">
        <Loader2 size={16} className="animate-spin" />
        Loading draft product...
      </div>
    );
  }

  // Empty state — no draft product
  if (!draft) {
    return (
      <div className="py-12 flex flex-col items-center text-center gap-4">
        {p3Approved ? (
          <>
            <FileEdit size={32} className="text-slate-300" aria-hidden="true" />
            <div>
              <p className="text-lg font-semibold text-foreground">No draft product record yet.</p>
              <p className="text-sm text-muted-foreground mt-1 max-w-md">
                Create the draft product record to begin indexing statements and preparing for
                final readiness review.
              </p>
            </div>
            {canCreate && (
              <Button onClick={() => setCreateDialogOpen(true)}>
                Create Draft Product
              </Button>
            )}
          </>
        ) : (
          <>
            <Lock size={32} className="text-slate-300" aria-hidden="true" />
            <div>
              <p className="text-lg font-semibold text-foreground">Draft product not available yet.</p>
              <p className="text-sm text-muted-foreground mt-1 max-w-md">
                Gate P3 must be approved before creating a draft product.
              </p>
            </div>
          </>
        )}

        <CreateDraftProductDialog
          open={createDialogOpen}
          engagementId={engagementId}
          p3Approved={p3Approved}
          onClose={() => setCreateDialogOpen(false)}
          onCreated={handleCreate}
        />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Draft Status Section */}
      <section aria-labelledby="draft-status-heading">
        <p
          id="draft-status-heading"
          className="text-xs font-medium uppercase tracking-wide text-muted-foreground mb-3"
        >
          Draft Status
        </p>

        <div className="p-4 border border-slate-200 rounded-lg bg-white space-y-4">
          <div className="flex items-center gap-3">
            <DraftStatusBadge status={draft.status} />
          </div>

          <DraftStatusStepper currentStatus={draft.status} />

          <div className="flex items-center gap-3 pt-2">
            {canAdvance && (
              <Button onClick={handleAdvance} disabled={advancing}>
                {advancing ? (
                  <>
                    <Loader2 size={14} className="mr-2 animate-spin" />
                    Updating...
                  </>
                ) : (
                  ADVANCE_BUTTON_LABELS[draft.status]
                )}
              </Button>
            )}
            {canReturn && draft.status === 'under_review' && (
              <Button
                variant="outline"
                onClick={handleReturnToDrafting}
                disabled={returning}
              >
                {returning ? (
                  <>
                    <Loader2 size={14} className="mr-2 animate-spin" />
                    Returning...
                  </>
                ) : (
                  'Return to Drafting'
                )}
              </Button>
            )}
          </div>
        </div>
      </section>

      <Separator />

      {/* Draft Metadata Section */}
      <section aria-labelledby="draft-metadata-heading">
        <div className="flex items-center justify-between mb-3">
          <p
            id="draft-metadata-heading"
            className="text-xs font-medium uppercase tracking-wide text-muted-foreground"
          >
            Draft Metadata
          </p>
          {canEditMeta && (
            <Button variant="outline" size="sm">
              Edit
            </Button>
          )}
        </div>

        <div className="grid grid-cols-2 gap-3 text-sm">
          <div>
            <p className="text-xs text-muted-foreground">Title</p>
            <p className="font-medium">{draft.title}</p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground">Version</p>
            <p>{draft.version}</p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground">Owner</p>
            <p>{draft.owner_name}</p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground">Created</p>
            <p>
              {new Date(draft.created_at).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              })}
            </p>
          </div>
        </div>
      </section>

      <Separator />

      {/* Draft File Attachment Section */}
      <section aria-labelledby="draft-file-heading">
        <p
          id="draft-file-heading"
          className="text-xs font-medium uppercase tracking-wide text-muted-foreground mb-3"
        >
          Draft File Attachment
        </p>
        <DraftFileSection
          filename={draft.filename}
          fileSize={draft.file_size}
          fileRef={draft.file_ref}
          engagementId={engagementId}
          onUpload={async (file) => {
            await uploadFile(file);
            toast({ title: 'File uploaded.' });
          }}
          onRemove={async () => {
            await removeFile();
            toast({ title: 'File removed.' });
          }}
          canEdit={canEditFile}
        />
      </section>

      <Separator />

      {/* Review Comments Section */}
      <section aria-labelledby="review-comments-heading">
        <p
          id="review-comments-heading"
          className="text-xs font-medium uppercase tracking-wide text-muted-foreground mb-3"
        >
          Review Comments
        </p>
        <ReviewCommentThread
          engagementId={engagementId}
          canAddComment={canAddComment}
          fetchComments={fetchComments}
          addComment={addComment}
        />
      </section>

      <Separator />

      {/* Draft Statements Section */}
      <section aria-labelledby="draft-statements-heading">
        <p
          id="draft-statements-heading"
          className="text-xs font-medium uppercase tracking-wide text-muted-foreground mb-3"
        >
          Draft Statements (Indexing)
        </p>
        <StatementsIndexingSummary
          engagementId={engagementId}
          draftProductId={draft.id}
        />
      </section>
    </div>
  );
}
