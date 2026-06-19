import * as React from 'react';
import { Loader2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { useToast } from '@/components/ui/use-toast';
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogFooter,
  AlertDialogTitle,
  AlertDialogDescription,
} from '@/components/ui/alert-dialog';
import { P2ReadinessChecklist } from './P2ReadinessChecklist';
import { recordP2Decision } from '@/lib/gate.api';
import type { PlanningRecord, Objective, IndependenceAffirmation } from '@/lib/planning.api';

export interface GateP2ReviewPanelProps {
  engagementId: string;
  planningRecord: PlanningRecord;
  objectives: Objective[];
  independence_affirmations: IndependenceAffirmation[];
  onDecisionRecorded: () => void;
}

// ---- Sub-components ----

function SectionHeader({ label }: { label: string }) {
  return (
    <p className="text-xs font-medium uppercase tracking-wide text-slate-500 mb-2">
      {label}
    </p>
  );
}

function ReadOnlyTextarea({
  value,
  placeholder,
}: {
  value: string | null;
  placeholder?: string;
}) {
  return (
    <Textarea
      value={value ?? ''}
      readOnly
      aria-readonly="true"
      placeholder={placeholder}
      className="min-h-[80px] text-sm border-slate-200 rounded-md"
      style={{ backgroundColor: 'hsl(210 20% 97%)' }}
    />
  );
}

// ---- ApproveP2ConfirmDialog ----

interface ApproveDialogProps {
  open: boolean;
  jobCode: string;
  onClose: () => void;
  onConfirm: () => Promise<void>;
}

function ApproveP2ConfirmDialog({ open, jobCode, onClose, onConfirm }: ApproveDialogProps) {
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  async function handleConfirm() {
    setLoading(true);
    setError(null);
    try {
      await onConfirm();
      // onConfirm handles navigation — dialog closes as parent unmounts
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to approve. Please try again.');
      setLoading(false);
    }
  }

  function handleClose() {
    if (!loading) {
      setError(null);
      onClose();
    }
  }

  return (
    <AlertDialog open={open} onOpenChange={(v) => !v && handleClose()}>
      <AlertDialogContent className="max-w-[520px]">
        <AlertDialogHeader>
          <AlertDialogTitle>Approve Planning Baseline?</AlertDialogTitle>
          <AlertDialogDescription>
            This will lock the planning record for {jobCode}. The engagement will advance to
            the Evidence phase. This action creates a permanent gate decision record.
          </AlertDialogDescription>
        </AlertDialogHeader>

        {error && (
          <p className="text-sm text-red-600 px-1">{error}</p>
        )}

        <AlertDialogFooter>
          <button
            type="button"
            onClick={handleClose}
            disabled={loading}
            className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 hover:bg-accent hover:text-accent-foreground h-10 px-4 py-2"
          >
            Keep Under Review
          </button>
          <Button
            onClick={handleConfirm}
            disabled={loading}
            className="min-w-[180px]"
          >
            {loading ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Processing approval...
              </>
            ) : (
              'Confirm Approve P2 ✓'
            )}
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

// ---- ReturnP2ConfirmDialog ----

interface ReturnDialogProps {
  open: boolean;
  emName: string;
  onClose: () => void;
  onConfirm: () => Promise<void>;
}

function ReturnP2ConfirmDialog({ open, emName, onClose, onConfirm }: ReturnDialogProps) {
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  async function handleConfirm() {
    setLoading(true);
    setError(null);
    try {
      await onConfirm();
      // onConfirm handles navigation — dialog closes as parent unmounts
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to return. Please try again.');
      setLoading(false);
    }
  }

  function handleClose() {
    if (!loading) {
      setError(null);
      onClose();
    }
  }

  return (
    <AlertDialog open={open} onOpenChange={(v) => !v && handleClose()}>
      <AlertDialogContent className="max-w-[480px]">
        <AlertDialogHeader>
          <AlertDialogTitle>Return for Revision?</AlertDialogTitle>
          <AlertDialogDescription>
            The planning record will be returned to {emName} with your comments. It will be
            removed from the Review Queue.
          </AlertDialogDescription>
        </AlertDialogHeader>

        {error && (
          <p className="text-sm text-red-600 px-1">{error}</p>
        )}

        <AlertDialogFooter>
          <button
            type="button"
            onClick={handleClose}
            disabled={loading}
            className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 hover:bg-accent hover:text-accent-foreground h-10 px-4 py-2"
          >
            Keep in Review
          </button>
          <Button
            variant="outline"
            onClick={handleConfirm}
            disabled={loading}
            className="min-w-[140px] border-amber-500 text-amber-700 hover:bg-amber-50"
          >
            {loading ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Processing...
              </>
            ) : (
              'Confirm Return'
            )}
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

// ---- Main GateP2ReviewPanel ----

export function GateP2ReviewPanel({
  engagementId,
  planningRecord,
  objectives,
  onDecisionRecorded,
}: GateP2ReviewPanelProps) {
  const { toast } = useToast();
  const navigate = useNavigate();

  // Decision panel state
  const [comment, setComment] = React.useState('');
  const [allChecklistPass, setAllChecklistPass] = React.useState(false);

  // Dialog state
  const [showApproveDialog, setShowApproveDialog] = React.useState(false);
  const [showReturnDialog, setShowReturnDialog] = React.useState(false);

  const commentLength = comment.trim().length;
  const commentValid = commentLength >= 10;
  const approveEnabled = commentValid && allChecklistPass;
  const returnEnabled = commentValid;

  // Derive submission date and EM name from planning record
  const submittedDate = planningRecord.updated_at
    ? new Date(planningRecord.updated_at).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      })
    : null;

  // Engagement job code is not directly on planning record — derive from EM display
  const emDisplayName = planningRecord.created_by ?? 'Engagement Manager';

  async function handleApproveConfirm() {
    await recordP2Decision(engagementId, { decision: 'approved', comment: comment.trim() });
    setShowApproveDialog(false);
    toast({ description: 'Gate P2 approved.' });
    onDecisionRecorded();
    navigate(`/engagements/${engagementId}`);
  }

  async function handleReturnConfirm() {
    await recordP2Decision(engagementId, { decision: 'returned', comment: comment.trim() });
    setShowReturnDialog(false);
    toast({ description: 'Planning record returned for revision.' });
    onDecisionRecorded();
    navigate('/review-queue');
  }

  return (
    <div className="space-y-6">
      {/* Submission metadata */}
      {submittedDate && (
        <p className="text-xs text-muted-foreground">
          Submitted: {submittedDate} · By: {emDisplayName}
        </p>
      )}

      {/* P2 Completeness Checklist (QA mode — system-computed, read-only) */}
      <section>
        <P2ReadinessChecklist
          engagementId={engagementId}
          mode="qa"
          onAllPass={(pass) => setAllChecklistPass(pass)}
        />
      </section>

      {/* Planning Record (Read-Only) */}
      <section>
        <div className="border border-slate-200 rounded-lg p-4 bg-slate-50 space-y-5">
          <SectionHeader label="Planning Record (Read-Only)" />

          {/* Objectives — read-only list */}
          <div>
            <SectionHeader label="Objectives" />
            {objectives.length === 0 ? (
              <p className="text-sm text-muted-foreground italic">No objectives added.</p>
            ) : (
              <ol className="list-decimal list-inside space-y-2">
                {objectives.map((obj, idx) => (
                  <li key={obj.id} className="text-sm text-slate-800">
                    <span className="font-medium">{idx + 1}. </span>
                    {obj.objective_text}
                    {obj.information_need && (
                      <p className="ml-4 mt-0.5 text-xs text-muted-foreground">
                        Information Need: {obj.information_need}
                      </p>
                    )}
                  </li>
                ))}
              </ol>
            )}
          </div>

          {/* Design Approach */}
          <div>
            <SectionHeader label="Design Approach" />
            <ReadOnlyTextarea
              value={planningRecord.design_approach}
              placeholder="[not provided]"
            />
          </div>

          {/* Schedule Notes */}
          <div>
            <SectionHeader label="Schedule Notes" />
            <ReadOnlyTextarea
              value={planningRecord.schedule_notes}
              placeholder="[not provided]"
            />
          </div>

          {/* Risk Notes */}
          <div>
            <SectionHeader label="Risk Notes" />
            <ReadOnlyTextarea
              value={planningRecord.risk_notes}
              placeholder="[not provided]"
            />
          </div>

          {/* Data Reliability Notes */}
          <div>
            <SectionHeader label="Data Reliability Notes" />
            <ReadOnlyTextarea
              value={planningRecord.data_reliability_notes}
              placeholder="[not provided]"
            />
          </div>
        </div>
      </section>

      {/* P2 Decision Panel */}
      <section
        className="bg-white border border-slate-200 rounded-lg p-6 border-l-4 border-l-blue-600"
      >
        <p className="text-sm font-semibold text-slate-800 mb-4">P2 Decision</p>

        {/* Decision Comment */}
        <div className="mb-4">
          <Label htmlFor="p2-decision-comment" className="text-sm font-medium mb-1 block">
            Decision Comment <span className="text-red-600">*</span>
          </Label>
          <Textarea
            id="p2-decision-comment"
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="e.g., Planning baseline meets all P2 requirements..."
            className={[
              'min-h-[100px] text-sm',
              !commentValid && comment.length > 0
                ? 'border-red-500'
                : 'border-slate-200',
            ].join(' ')}
            aria-required="true"
          />
          <div className="flex justify-between items-center mt-1">
            {!commentValid && comment.length > 0 ? (
              <p className="text-xs text-red-600">Minimum 10 characters.</p>
            ) : commentValid ? (
              <p className="text-xs text-muted-foreground">
                <span className="text-green-600">●</span> Comment meets minimum length.
              </p>
            ) : (
              <span />
            )}
            <p className="text-[12px] text-muted-foreground ml-auto">
              {commentLength} / 10
            </p>
          </div>
        </div>

        {/* Button row */}
        <div className="flex justify-between items-center gap-3 flex-wrap">
          {/* Return for Revision — left */}
          <Button
            variant="outline"
            onClick={() => setShowReturnDialog(true)}
            disabled={!returnEnabled}
            aria-disabled={!returnEnabled}
            className="border-amber-500 text-amber-700 hover:bg-amber-50"
          >
            Return for Revision
          </Button>

          {/* Approve P2 — right */}
          <Button
            onClick={() => setShowApproveDialog(true)}
            disabled={!approveEnabled}
            aria-disabled={!approveEnabled}
            className="min-w-[160px] h-10"
          >
            ✓ Approve P2
          </Button>
        </div>
      </section>

      {/* ApproveP2ConfirmDialog */}
      <ApproveP2ConfirmDialog
        open={showApproveDialog}
        jobCode={engagementId}
        onClose={() => setShowApproveDialog(false)}
        onConfirm={handleApproveConfirm}
      />

      {/* ReturnP2ConfirmDialog */}
      <ReturnP2ConfirmDialog
        open={showReturnDialog}
        emName={emDisplayName}
        onClose={() => setShowReturnDialog(false)}
        onConfirm={handleReturnConfirm}
      />
    </div>
  );
}
