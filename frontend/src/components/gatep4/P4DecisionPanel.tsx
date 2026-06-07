import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { ApproveP4ConfirmDialog } from './ApproveP4ConfirmDialog';

type Outcome = 'ready_for_issuance' | 'closed';

interface P4DecisionPanelProps {
  engagementId: string;
  jobCode: string;
  allPrereqsPass: boolean;
  isPC: boolean; // PC role sees only "Ready for Issuance"
  onDecisionMade: () => void;
}

export const P4DecisionPanel: React.FC<P4DecisionPanelProps> = ({
  engagementId,
  jobCode,
  allPrereqsPass,
  isPC,
  onDecisionMade,
}) => {
  const [outcome, setOutcome] = useState<Outcome>('ready_for_issuance');
  const [comment, setComment] = useState('');
  const [confirmOpen, setConfirmOpen] = useState(false);

  const commentLength = comment.trim().length;
  const commentValid = commentLength >= 10;
  const approveEnabled = allPrereqsPass && commentValid;

  const handleApproveClick = () => {
    if (approveEnabled) {
      setConfirmOpen(true);
    }
  };

  return (
    <TooltipProvider>
      <div
        role="region"
        aria-label="Gate P4 Decision"
        style={{
          background: 'white',
          border: '1px solid hsl(214 32% 91%)',
          borderRadius: 8,
          padding: 24,
          borderLeft: '4px solid hsl(221 83% 53%)',
          marginTop: 16,
        }}
        className="border-l-4 border-blue-600"
      >
        <h3
          style={{
            fontSize: 12,
            fontWeight: 400,
            textTransform: 'uppercase',
            letterSpacing: '0.05em',
            color: 'hsl(215 16% 47%)',
            marginBottom: 16,
            marginTop: 0,
          }}
        >
          P4 Decision
        </h3>

        {/* Outcome radio group */}
        <div style={{ marginBottom: 16 }}>
          <label
            style={{ fontSize: 14, fontWeight: 500, display: 'block', marginBottom: 8 }}
          >
            Engagement Outcome <span style={{ color: 'hsl(0 72% 51%)' }}>*</span>
          </label>
          <RadioGroup
            value={outcome}
            onValueChange={(v) => setOutcome(v as Outcome)}
            aria-label="Select engagement outcome after P4 approval"
            style={{ display: 'flex', flexDirection: 'column', gap: 8 }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <RadioGroupItem value="ready_for_issuance" id="outcome-rfi" />
              <label htmlFor="outcome-rfi" style={{ fontSize: 14, cursor: 'pointer' }}>
                Ready for Issuance
              </label>
            </div>
            {/* EM/AD can also select "Closed" — PC cannot */}
            {!isPC && (
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <RadioGroupItem value="closed" id="outcome-closed" />
                <label htmlFor="outcome-closed" style={{ fontSize: 14, cursor: 'pointer' }}>
                  Closed
                </label>
              </div>
            )}
          </RadioGroup>
        </div>

        {/* Comment textarea */}
        <div style={{ marginBottom: 16 }}>
          <label
            htmlFor="p4-approval-comment"
            style={{ fontSize: 14, fontWeight: 500, display: 'block', marginBottom: 6 }}
          >
            Final Approval Comment{' '}
            <span style={{ color: 'hsl(0 72% 51%)' }}>*</span>{' '}
            <span style={{ fontSize: 12, fontWeight: 400, color: 'hsl(215 16% 47%)' }}>
              (minimum 10 characters)
            </span>
          </label>

          <Textarea
            id="p4-approval-comment"
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="Final approval comment..."
            aria-required="true"
            aria-describedby="p4-comment-count"
            style={{
              minHeight: 100,
              borderColor:
                comment.length > 0 && !commentValid ? 'hsl(0 72% 51%)' : undefined,
            }}
          />

          {/* Char count */}
          <div
            style={{
              display: 'flex',
              justifyContent: 'flex-end',
              alignItems: 'center',
              gap: 6,
              marginTop: 4,
            }}
          >
            {comment.length > 0 && !commentValid && (
              <span style={{ fontSize: 12, color: 'hsl(0 72% 51%)' }}>
                Final approval comment must be at least 10 characters.
              </span>
            )}
            {commentValid && (
              <span
                style={{ fontSize: 12, color: 'hsl(221 83% 53%)' }}
                aria-live="polite"
              >
                ●
              </span>
            )}
            <span
              id="p4-comment-count"
              aria-live="polite"
              style={{
                fontSize: 12,
                color: commentValid
                  ? 'hsl(215 16% 47%)'
                  : comment.length > 0
                  ? 'hsl(0 72% 51%)'
                  : 'hsl(215 16% 47%)',
              }}
            >
              {commentLength} / 10
            </span>
          </div>
        </div>

        {/* Approve button */}
        <div
          id="p4-approve-desc"
          style={{ display: 'none' }}
          aria-hidden="true"
        >
          Resolve failing prerequisites to enable approval
        </div>

        <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
          {approveEnabled ? (
            <Button
              onClick={handleApproveClick}
              style={{ height: 40, minWidth: 200 }}
            >
              ✓ Approve Final Readiness
            </Button>
          ) : (
            <Tooltip>
              <TooltipTrigger asChild>
                <span
                  aria-disabled="true"
                  aria-describedby="p4-approve-desc"
                  style={{ display: 'inline-block', cursor: 'not-allowed' }}
                >
                  <Button
                    disabled
                    aria-disabled="true"
                    style={{ height: 40, minWidth: 200, pointerEvents: 'none' }}
                  >
                    ✓ Approve Final Readiness
                  </Button>
                </span>
              </TooltipTrigger>
              <TooltipContent>
                Resolve failing prerequisites to enable approval
              </TooltipContent>
            </Tooltip>
          )}
        </div>
      </div>

      {/* Confirm dialog */}
      <ApproveP4ConfirmDialog
        open={confirmOpen}
        onOpenChange={setConfirmOpen}
        engagementId={engagementId}
        jobCode={jobCode}
        outcome={outcome}
        comment={comment}
        onDecisionMade={onDecisionMade}
      />
    </TooltipProvider>
  );
};
