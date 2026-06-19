import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { FileSearch, Plus } from 'lucide-react';
import { api } from '@/lib/api';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { useAuthContext } from '@/context/AuthContext';
import { useFindings, useP3Prerequisites } from '@/hooks/useFindings';
import { useEvidenceCoverage } from '@/hooks/useEvidence';
import { FindingCard } from '@/components/findings/FindingCard';
import type { Finding } from '@/components/findings/FindingCard';
import { ObjectiveSufficiencySummary } from '@/components/findings/ObjectiveSufficiencySummary';
import { P3PrerequisitesChecklist } from '@/components/findings/P3PrerequisitesChecklist';
import { AddFindingDialog } from '@/components/findings/AddFindingDialog';

export function FindingsListPage() {
  const { id: engagementId } = useParams<{ id: string }>();
  const { user } = useAuthContext();

  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingFinding, setEditingFinding] = useState<Finding | undefined>(undefined);

  const {
    findings,
    loading: findingsLoading,
    refresh: refreshFindings,
  } = useFindings(engagementId ?? '');

  const {
    prerequisites,
    loading: prereqLoading,
    refresh: refreshPrerequisites,
  } = useP3Prerequisites(engagementId ?? '');

  const { coverage, loading: coverageLoading } = useEvidenceCoverage(engagementId ?? '');

  const roles = user?.roles ?? [];
  const canEdit = roles.some((r) => ['AN', 'AD'].includes(r));
  const canReview = roles.some((r) => ['QA', 'AD'].includes(r));

  // Check if P3 is already approved (engagement phase = draft or later)
  const [p3Approved, setP3Approved] = useState(false);
  useEffect(() => {
    if (!engagementId) return;
    api.get<{ engagement: { phase: string } }>(`/api/engagements/${engagementId}`)
      .then((res) => {
        if (res.ok) {
          const ph = res.data.engagement.phase;
          setP3Approved(ph === 'draft' || ph === 'readiness' || ph === 'closed');
        }
      })
      .catch(() => {});
  }, [engagementId]);

  const handleSaved = () => {
    refreshFindings();
    refreshPrerequisites();
  };

  const handleEditClick = (finding: Finding) => {
    setEditingFinding(finding);
    setDialogOpen(true);
  };

  const handleAddClick = () => {
    setEditingFinding(undefined);
    setDialogOpen(true);
  };

  const handleDialogClose = () => {
    setDialogOpen(false);
    setEditingFinding(undefined);
  };

  const allPass = prerequisites?.all_pass ?? false;
  const blockers = prerequisites?.blockers ?? [];

  return (
    <div>
      {/* Breadcrumb hint */}
      <nav aria-label="Breadcrumb" style={{ fontSize: 12, color: 'hsl(215 16% 47%)', marginBottom: 16 }}>
        Engagements &rsaquo; Findings
      </nav>

      {/* Header */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: 16,
        }}
      >
        <h2 style={{ fontSize: 20, fontWeight: 600, margin: 0 }}>Findings</h2>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          {canReview && (
            <Link
              to={`/engagements/${engagementId}/evidence/p3-review`}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                height: 40,
                padding: '0 16px',
                fontSize: 14,
                fontWeight: 500,
                borderRadius: 6,
                border: '1px solid hsl(215 16% 47% / 0.4)',
                color: 'hsl(221 83% 53%)',
                textDecoration: 'none',
              }}
            >
              Gate P3 Review →
            </Link>
          )}
          {canEdit && (
          <Button
            onClick={handleAddClick}
            style={{ height: 40 }}
            aria-label="Add finding"
          >
            <Plus size={16} style={{ marginRight: 6 }} />
            + Add Finding
          </Button>
          )}
        </div>
      </div>

      {/* Objective Sufficiency Summary bar */}
      {p3Approved ? (
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 8,
            padding: '10px 16px',
            borderRadius: 6,
            background: 'hsl(142 71% 88%)',
            color: 'hsl(142 70% 28%)',
            fontSize: 14,
            fontWeight: 500,
            marginBottom: 16,
            border: '1px solid hsl(142 71% 75%)',
          }}
          role="status"
        >
          ✓ Gate P3 approved — engagement is in Draft phase.
        </div>
      ) : (!coverageLoading && coverage && (
        <ObjectiveSufficiencySummary
          objectives={coverage.objectives}
          allPass={
            coverage.objectives.length > 0 &&
            coverage.objectives.every(
              (o) => o.sufficiency_status !== 'evidence_needed' && o.evidence_count > 0
            )
          }
        />
      ))}
      {coverageLoading && (
        <div style={{ marginBottom: 16 }}>
          <Skeleton style={{ height: 80, borderRadius: 8 }} />
        </div>
      )}

      {/* Findings list */}
      {findingsLoading ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 16 }}>
          <Skeleton style={{ height: 96, borderRadius: 6 }} />
          <Skeleton style={{ height: 96, borderRadius: 6 }} />
          <Skeleton style={{ height: 96, borderRadius: 6 }} />
        </div>
      ) : findings.length === 0 ? (
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '48px 24px',
            textAlign: 'center',
          }}
        >
          <FileSearch size={32} style={{ color: 'hsl(215 16% 47%)', marginBottom: 12 }} />
          <p style={{ fontSize: 16, fontWeight: 600, marginBottom: 8 }}>No findings yet.</p>
          <p style={{ fontSize: 14, color: 'hsl(215 16% 47%)', marginBottom: 16, maxWidth: 400 }}>
            Add findings to document conclusions supported by your evidence. Link each finding to
            evidence before Gate P3.
          </p>
          {canEdit && (
            <Button onClick={handleAddClick} style={{ height: 40 }}>
              <Plus size={16} style={{ marginRight: 6 }} />
              + Add Finding
            </Button>
          )}
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 16 }}>
          {findings.map((finding) => (
            <FindingCard
              key={finding.id}
              finding={finding}
              engagementId={engagementId ?? ''}
              onUpdated={handleSaved}
              canEdit={canEdit}
              onEditClick={handleEditClick}
            />
          ))}
        </div>
      )}

      {/* P3 Prerequisites Checklist — hide when P3 already approved */}
      {!p3Approved && !prereqLoading && prerequisites !== null && (
        <P3PrerequisitesChecklist blockers={blockers} allPass={allPass} />
      )}
      {!p3Approved && prereqLoading && (
        <Skeleton style={{ height: 120, borderRadius: 8, marginTop: 16 }} />
      )}

      {/* Add/Edit Finding Dialog */}
      <AddFindingDialog
        engagementId={engagementId ?? ''}
        open={dialogOpen}
        onClose={handleDialogClose}
        onSaved={handleSaved}
        finding={editingFinding}
      />
    </div>
  );
}
