import { useState, useCallback, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Skeleton } from '@/components/ui/skeleton';
import { useAuthContext } from '@/context/AuthContext';
import { useEvidenceCoverage } from '@/hooks/useEvidence';
import { useFindings, useP3Prerequisites } from '@/hooks/useFindings';
import { FindingCard } from '@/components/findings/FindingCard';
import { ObjectiveSufficiencyTable } from '@/components/findings/ObjectiveSufficiencyTable';
import type { ObjectiveRow } from '@/components/findings/ObjectiveSufficiencyTable';
import { P3PrerequisitesChecklist } from '@/components/findings/P3PrerequisitesChecklist';
import { P3DecisionPanel } from '@/components/findings/P3DecisionPanel';
import type { SufficiencyStatus } from '@/components/evidence/SufficiencyChip';
import { api } from '@/lib/api';

export function GateP3ReviewPage() {
  const { id: engagementId } = useParams<{ id: string }>();
  const { user } = useAuthContext();

  const { coverage, loading: coverageLoading, refresh: refreshCoverage } = useEvidenceCoverage(
    engagementId ?? ''
  );
  // useEvidenceCoverage doesn't expose refresh — we'll track local objective state for sufficiency updates
  const [localObjectiveStatuses, setLocalObjectiveStatuses] = useState<
    Record<string, SufficiencyStatus>
  >({});

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

  const [p3AlreadyApproved, setP3AlreadyApproved] = useState(false);

  // Check if P3 is already approved by looking at engagement phase
  useEffect(() => {
    if (!engagementId) return;
    api.get<{ engagement: { phase: string } }>(`/api/engagements/${engagementId}`)
      .then((res) => {
        if (res.ok) {
          const phase = res.data.engagement.phase;
          setP3AlreadyApproved(phase === 'draft' || phase === 'readiness' || phase === 'closed');
        }
      })
      .catch(() => {});
  }, [engagementId]);

  const roles = user?.roles ?? [];
  const canEditSufficiency = roles.some((r) => ['QA', 'EM', 'AD'].includes(r));
  const canDecide = roles.some((r) => ['QA', 'AD'].includes(r));

  const handleStatusChanged = useCallback(
    (objectiveId: string, newStatus: SufficiencyStatus) => {
      setLocalObjectiveStatuses((prev) => ({ ...prev, [objectiveId]: newStatus }));
      // Re-fetch prerequisites after sufficiency change
      refreshPrerequisites();
      // Also attempt refresh coverage if available
      if (refreshCoverage) refreshCoverage();
    },
    [refreshPrerequisites, refreshCoverage]
  );

  const handleDecisionMade = useCallback(() => {
    refreshFindings();
    refreshPrerequisites();
  }, [refreshFindings, refreshPrerequisites]);

  const allPrereqsPass = prerequisites?.all_pass ?? false;
  const blockers = prerequisites?.blockers ?? [];

  // Build objectives array for table, merging local status updates
  const objectives: ObjectiveRow[] = (coverage?.objectives ?? []).map((obj) => ({
    id: obj.id,
    objective_text: obj.objective_text,
    evidence_count: obj.evidence_count,
    sufficiency_status: localObjectiveStatuses[obj.id] ?? obj.sufficiency_status,
  }));

  return (
    <div>
      {/* Breadcrumb */}
      <nav
        aria-label="Breadcrumb"
        style={{ fontSize: 12, color: 'hsl(215 16% 47%)', marginBottom: 16 }}
      >
        Review Queue &rsaquo; P3 Evidence Sufficiency Review
      </nav>

      {/* Page header */}
      <div style={{ marginBottom: 24 }}>
        <h2 style={{ fontSize: 20, fontWeight: 600, margin: '0 0 4px 0' }}>
          Gate P3 — Evidence Sufficiency Review
        </h2>
        <p style={{ fontSize: 14, color: 'hsl(215 16% 47%)', margin: 0 }}>
          Phase: Evidence
        </p>
      </div>

      {/* Section 1 — Objective Sufficiency Table */}
      <section style={{ marginBottom: 24 }}>
        <h3
          style={{
            fontSize: 12,
            fontWeight: 400,
            textTransform: 'uppercase',
            letterSpacing: '0.05em',
            color: 'hsl(215 16% 47%)',
            marginBottom: 12,
            marginTop: 0,
          }}
        >
          Objective Sufficiency Table
        </h3>
        {coverageLoading ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            <Skeleton style={{ height: 48 }} />
            <Skeleton style={{ height: 48 }} />
            <Skeleton style={{ height: 48 }} />
          </div>
        ) : (
          <ObjectiveSufficiencyTable
            engagementId={engagementId ?? ''}
            objectives={objectives}
            canEdit={canEditSufficiency}
            onStatusChanged={handleStatusChanged}
          />
        )}
      </section>

      {/* Section 2 — Findings list (read-only) */}
      <section style={{ marginBottom: 24 }}>
        <h3
          style={{
            fontSize: 12,
            fontWeight: 400,
            textTransform: 'uppercase',
            letterSpacing: '0.05em',
            color: 'hsl(215 16% 47%)',
            marginBottom: 12,
            marginTop: 0,
          }}
        >
          Findings (Read-Only)
        </h3>
        {findingsLoading ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            <Skeleton style={{ height: 96, borderRadius: 6 }} />
            <Skeleton style={{ height: 96, borderRadius: 6 }} />
          </div>
        ) : findings.length === 0 ? (
          <p style={{ fontSize: 14, color: 'hsl(215 16% 47%)' }}>No findings yet.</p>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {findings.map((finding) => (
              <FindingCard
                key={finding.id}
                finding={finding}
                engagementId={engagementId ?? ''}
                onUpdated={refreshFindings}
                canEdit={false}
              />
            ))}
          </div>
        )}
      </section>

      {/* Section 3 — P3 Prerequisites Checklist with banner */}
      <section style={{ marginBottom: 24 }}>
        {/* Banner above checklist */}
        {!prereqLoading && prerequisites !== null && (
          <div
            style={{
              padding: '12px 16px',
              borderRadius: 6,
              marginBottom: 12,
              background: allPrereqsPass ? 'hsl(142 71% 88%)' : 'hsl(0 72% 93%)',
              color: allPrereqsPass ? 'hsl(142 70% 28%)' : 'hsl(0 72% 38%)',
              fontSize: 14,
              fontWeight: 500,
            }}
            role="status"
            aria-live="polite"
          >
            {allPrereqsPass
              ? 'All prerequisites are met. You may approve Gate P3.'
              : 'Resolve all blocking conditions before approving Gate P3.'}
          </div>
        )}

        {prereqLoading ? (
          <Skeleton style={{ height: 120, borderRadius: 8 }} />
        ) : prerequisites !== null ? (
          <P3PrerequisitesChecklist blockers={blockers} allPass={allPrereqsPass} />
        ) : null}
      </section>

      {/* Section 4 — P3 Decision Panel (QA/AD only) */}
      {canDecide && !p3AlreadyApproved && (
        <section>
          <P3DecisionPanel
            engagementId={engagementId ?? ''}
            allPrereqsPass={allPrereqsPass}
            onDecisionMade={handleDecisionMade}
          />
        </section>
      )}
      {p3AlreadyApproved && (
        <div
          style={{
            padding: '16px 20px',
            borderRadius: 8,
            background: 'hsl(142 71% 88%)',
            color: 'hsl(142 70% 28%)',
            fontSize: 14,
            fontWeight: 500,
            border: '1px solid hsl(142 71% 75%)',
          }}
          role="status"
        >
          ✓ Gate P3 has already been approved. This engagement is in the Draft phase.
        </div>
      )}
    </div>
  );
}
