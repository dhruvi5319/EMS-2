import React, { useState } from 'react';
import { AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
} from '@/components/ui/alert-dialog';
import { useToast } from '@/components/ui/use-toast';
import { api } from '@/lib/api';
import { EvidenceTypeBadge } from '@/components/evidence/EvidenceTypeBadge';
import { FindingStatusBadge } from './FindingStatusBadge';
import type { FindingStatus } from './FindingStatusBadge';
import type { EvidenceType } from '@/components/evidence/EvidenceTypeBadge';

export interface Finding {
  id: string;
  engagement_id: string;
  finding_text: string;
  status: FindingStatus;
  created_by: string;
  created_at: string;
  updated_at: string;
  evidence_ids?: string[];
  evidence_count?: number;
  // evidence detail for display
  evidence_items?: Array<{
    id: string;
    evidence_type: EvidenceType;
    source: string;
    sensitivity: 'standard' | 'restricted';
  }>;
  objective_ids?: string[];
}

interface FindingCardProps {
  finding: Finding;
  engagementId: string;
  onUpdated: () => void;
  canEdit: boolean;
  onEditClick?: (finding: Finding) => void;
}

/**
 * Truncate string at given length, appending "..." if truncated.
 */
function truncate(str: string, maxLen: number): string {
  if (str.length <= maxLen) return str;
  return str.slice(0, maxLen) + '…';
}

export const FindingCard: React.FC<FindingCardProps> = ({
  finding,
  engagementId,
  onUpdated,
  canEdit,
  onEditClick,
}) => {
  const { toast } = useToast();
  const [expanded, setExpanded] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);

  // Format finding ID as FD-NNN
  const findingIndex = finding.id.slice(-3).padStart(3, '0');
  const findingLabel = `FD-${findingIndex}`;

  const hasEvidence = (finding.evidence_count ?? 0) > 0 || (finding.evidence_ids?.length ?? 0) > 0;

  const handleDelete = async () => {
    setDeleting(true);
    try {
      const result = await api.delete(`/engagements/${engagementId}/findings/${finding.id}`);
      if (result.ok) {
        toast({ title: 'Finding deleted.' });
        setDeleteOpen(false);
        onUpdated();
      } else {
        toast({ title: result.error ?? 'Failed to delete finding.', variant: 'destructive' });
      }
    } catch {
      toast({ title: 'Failed to delete finding.', variant: 'destructive' });
    } finally {
      setDeleting(false);
    }
  };

  return (
    <>
      <div
        role="article"
        aria-label={`Finding ${findingLabel}`}
        style={{
          background: 'white',
          border: '1px solid hsl(214 32% 91%)',
          borderRadius: 6,
          padding: 16,
          cursor: 'pointer',
        }}
        onClick={() => setExpanded((e) => !e)}
      >
        {/* Header row */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
          <span
            style={{
              fontFamily: "ui-monospace, 'Cascadia Code', 'Source Code Pro', monospace",
              fontSize: 14,
              fontWeight: 400,
              flex: 1,
            }}
          >
            {findingLabel}
          </span>
          <FindingStatusBadge status={finding.status} />
          {canEdit && (
            <>
              <Button
                variant="outline"
                size="sm"
                style={{ fontSize: 12, height: 36 }}
                onClick={(e) => {
                  e.stopPropagation();
                  onEditClick?.(finding);
                }}
              >
                Edit
              </Button>
              <Button
                variant="ghost"
                size="sm"
                style={{ fontSize: 12, color: 'hsl(0 72% 51%)', height: 36 }}
                onClick={(e) => {
                  e.stopPropagation();
                  setDeleteOpen(true);
                }}
                aria-label={`Delete finding ${findingLabel}`}
              >
                ✕
              </Button>
            </>
          )}
        </div>

        {/* Finding text */}
        <p
          style={{
            fontSize: 14,
            fontWeight: 400,
            lineHeight: 1.5,
            margin: '0 0 8px 0',
            overflow: 'hidden',
            display: '-webkit-box',
            WebkitLineClamp: expanded ? 'unset' : 3,
            WebkitBoxOrient: 'vertical',
          }}
        >
          {finding.finding_text}
        </p>

        {/* Evidence line */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 6,
            fontSize: 12,
            color: 'hsl(215 16% 47%)',
            marginBottom: 4,
          }}
          onClick={(e) => e.stopPropagation()}
        >
          {hasEvidence ? (
            <>
              <span>Evidence:</span>
              {finding.evidence_items && finding.evidence_items.length > 0 ? (
                finding.evidence_items.map((ev) => (
                  <span
                    key={ev.id}
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: 3,
                      padding: '1px 6px',
                      background: 'hsl(0 0% 93%)',
                      borderRadius: 4,
                      fontSize: 12,
                    }}
                  >
                    {ev.sensitivity === 'restricted' ? (
                      <span
                        style={{
                          background: 'hsl(0 72% 93%)',
                          color: 'hsl(0 72% 38%)',
                          borderRadius: 3,
                          padding: '0 4px',
                          fontSize: 11,
                        }}
                      >
                        [Restricted]
                      </span>
                    ) : (
                      <>
                        <EvidenceTypeBadge type={ev.evidence_type} />
                        <span>{truncate(ev.source, 30)}</span>
                      </>
                    )}
                  </span>
                ))
              ) : (
                <span>{finding.evidence_ids?.length ?? 0} item(s)</span>
              )}
            </>
          ) : (
            <span
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 4,
                color: 'hsl(0 72% 51%)',
              }}
            >
              <AlertCircle size={16} style={{ color: 'hsl(0 72% 51%)' }} />
              None linked 🔴
            </span>
          )}
        </div>

        {/* Objectives line */}
        {finding.objective_ids && finding.objective_ids.length > 0 && (
          <div style={{ fontSize: 12, color: 'hsl(215 16% 47%)' }}>
            Objectives:{' '}
            {finding.objective_ids.map((objId, idx) => (
              <span key={objId}>
                Obj {idx + 1} ✓{idx < (finding.objective_ids?.length ?? 0) - 1 ? ', ' : ''}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Delete Finding AlertDialog */}
      <AlertDialog open={deleteOpen} onOpenChange={setDeleteOpen}>
        <AlertDialogContent style={{ maxWidth: 480 }}>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Finding {findingLabel}?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently remove the finding record. This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <Button variant="ghost" onClick={() => setDeleteOpen(false)} disabled={deleting}>
              Keep Finding
            </Button>
            <Button
              variant="destructive"
              onClick={handleDelete}
              disabled={deleting}
              aria-label="Confirm delete finding"
            >
              {deleting ? 'Deleting…' : 'Delete Finding'}
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};
