import { useState, useCallback, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { XOctagon } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { useAuthContext } from '@/context/AuthContext';
import { api } from '@/lib/api';
import { P4PrerequisitesChecklist, type PrerequisiteItem } from '@/components/gatep4/P4PrerequisitesChecklist';
import { P4DecisionPanel } from '@/components/gatep4/P4DecisionPanel';
import { getEngagement } from '@/lib/engagements.api';
import type { Engagement, GateDecision } from '@/lib/engagements.api';

interface P4Prerequisites {
  met: boolean;
  blockers: PrerequisiteItem[];
}

export default function GateP4ReviewPage() {
  const { id: engagementId } = useParams<{ id: string }>();
  const { user } = useAuthContext();

  const [engagement, setEngagement] = useState<Engagement | null>(null);
  const [gateDecisions, setGateDecisions] = useState<GateDecision[]>([]);
  const [prerequisites, setPrerequisites] = useState<P4Prerequisites | null>(null);
  const [prereqLoading, setPrereqLoading] = useState(true);
  const [engagementLoading, setEngagementLoading] = useState(true);

  const roles = user?.roles ?? [];
  // PC, EM, AD can make decision; others view only
  const canDecide = roles.some((r) => ['PC', 'EM', 'AD'].includes(r));
  // PC role only sees "Ready for Issuance" outcome
  const isPC = roles.includes('PC') && !roles.includes('EM') && !roles.includes('AD');

  const fetchPrerequisites = useCallback(async () => {
    if (!engagementId) return;
    setPrereqLoading(true);
    try {
      const result = await api.get<P4Prerequisites>(
        `/engagements/${engagementId}/gate/p4/prerequisites`
      );
      if (result.ok) {
        setPrerequisites(result.data);
      }
    } finally {
      setPrereqLoading(false);
    }
  }, [engagementId]);

  const fetchEngagement = useCallback(async () => {
    if (!engagementId) return;
    setEngagementLoading(true);
    try {
      const { engagement: eng, gate_decisions } = await getEngagement(engagementId);
      setEngagement(eng);
      setGateDecisions(gate_decisions);
    } catch {
      // ignore
    } finally {
      setEngagementLoading(false);
    }
  }, [engagementId]);

  useEffect(() => {
    fetchPrerequisites();
    fetchEngagement();
  }, [fetchPrerequisites, fetchEngagement]);

  const allPrereqsPass = prerequisites?.met ?? false;
  const blockers = prerequisites?.blockers ?? [];

  // Find gate decisions for history summary
  const a1Decision = gateDecisions.find((d) => d.gate_name === 'A1');
  const p2Decision = gateDecisions.find((d) => d.gate_name === 'P2');
  const p3Decision = gateDecisions.find((d) => d.gate_name === 'P3');

  const handleDecisionMade = useCallback(() => {
    fetchPrerequisites();
    fetchEngagement();
  }, [fetchPrerequisites, fetchEngagement]);

  return (
    <div style={{ maxWidth: 800 }}>
      {/* Breadcrumb */}
      <nav
        aria-label="Breadcrumb"
        style={{ fontSize: 12, color: 'hsl(215 16% 47%)', marginBottom: 16 }}
      >
        <Link to="/engagements" style={{ color: 'hsl(221 83% 53%)' }}>
          Engagements
        </Link>
        {' › '}
        {engagement ? (
          <Link
            to={`/engagements/${engagementId}`}
            style={{ color: 'hsl(221 83% 53%)' }}
          >
            {engagement.job_code}
          </Link>
        ) : (
          <span>Loading...</span>
        )}
        {' › '}
        <span>Final Readiness (P4)</span>
      </nav>

      {/* Page header */}
      <div style={{ marginBottom: 24 }}>
        <h2 style={{ fontSize: 20, fontWeight: 600, margin: '0 0 4px 0' }}>
          Gate P4 — Final Readiness
        </h2>
        {engagementLoading ? (
          <Skeleton style={{ height: 16, width: 200 }} />
        ) : engagement ? (
          <p style={{ fontSize: 14, color: 'hsl(215 16% 47%)', margin: 0 }}>
            Phase: {engagement.phase} · Risk: {engagement.risk_level ?? '—'} ·{' '}
            Owner: {engagement.owner_id ?? '—'}
          </p>
        ) : null}
      </div>

      {/* Section 1 — P4 Prerequisites Checklist */}
      <section
        style={{
          background: 'white',
          border: '1px solid hsl(214 32% 91%)',
          borderRadius: 8,
          padding: 16,
          marginBottom: 16,
        }}
      >
        {prereqLoading ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            <Skeleton style={{ height: 40 }} />
            <Skeleton style={{ height: 40 }} />
            <Skeleton style={{ height: 40 }} />
            <Skeleton style={{ height: 40 }} />
          </div>
        ) : prerequisites !== null ? (
          <P4PrerequisitesChecklist
            prerequisites={{ met: allPrereqsPass, blockers }}
            engagementId={engagementId ?? ''}
          />
        ) : null}
      </section>

      {/* Section 2 — Status banner */}
      {!prereqLoading && prerequisites !== null && (
        <div
          role="status"
          aria-live="polite"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 8,
            padding: '12px 16px',
            borderRadius: 6,
            marginBottom: 16,
            background: allPrereqsPass ? 'hsl(142 71% 88%)' : 'hsl(0 72% 93%)',
            color: allPrereqsPass ? 'hsl(142 70% 28%)' : 'hsl(0 72% 38%)',
            fontSize: 14,
            fontWeight: 500,
          }}
        >
          {!allPrereqsPass && <XOctagon size={16} style={{ flexShrink: 0 }} />}
          {allPrereqsPass
            ? 'All prerequisites met. You may approve Gate P4.'
            : `⛔ ${blockers.length} prerequisite(s) are not met. Resolve before approving.`}
        </div>
      )}

      {/* Section 3 — Reference Check Summary Panel */}
      <section
        style={{
          background: 'white',
          border: '1px solid hsl(214 32% 91%)',
          borderRadius: 8,
          padding: 16,
          marginBottom: 16,
        }}
      >
        <h3
          style={{
            fontSize: 12,
            fontWeight: 400,
            textTransform: 'uppercase',
            letterSpacing: '0.05em',
            color: 'hsl(215 16% 47%)',
            marginBottom: 8,
            marginTop: 0,
          }}
        >
          Reference Check Summary
        </h3>
        <p style={{ fontSize: 14, color: 'hsl(215 16% 47%)', margin: 0 }}>
          See{' '}
          <Link
            to={`/engagements/${engagementId}/draft/statements`}
            style={{ color: 'hsl(221 83% 53%)' }}
          >
            Statements / Reference Check →
          </Link>{' '}
          for detailed status.
        </p>
      </section>

      {/* Section 4 — Gate History Summary */}
      <section
        style={{
          background: 'white',
          border: '1px solid hsl(214 32% 91%)',
          borderRadius: 8,
          padding: 16,
          marginBottom: 16,
        }}
      >
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
          Gate History
        </h3>
        {engagementLoading ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            <Skeleton style={{ height: 20 }} />
            <Skeleton style={{ height: 20 }} />
            <Skeleton style={{ height: 20 }} />
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            {[
              { label: 'A1', decision: a1Decision },
              { label: 'P2', decision: p2Decision },
              { label: 'P3', decision: p3Decision },
            ].map(({ label, decision }) => (
              <div
                key={label}
                style={{ display: 'flex', alignItems: 'center', gap: 12, fontSize: 12 }}
              >
                <span style={{ fontWeight: 600, width: 24 }}>{label}</span>
                {decision ? (
                  <span style={{ color: 'hsl(215 16% 47%)' }}>
                    {decision.decision} ·{' '}
                    {new Date(decision.decided_at).toLocaleDateString()}
                  </span>
                ) : (
                  <span style={{ color: 'hsl(215 16% 47%)' }}>Pending</span>
                )}
              </div>
            ))}
          </div>
        )}
        <Link
          to={`/engagements/${engagementId}`}
          style={{ fontSize: 12, color: 'hsl(221 83% 53%)', display: 'block', marginTop: 12 }}
        >
          View Full History →
        </Link>
      </section>

      {/* Section 5 — P4 Decision Panel (PC/EM/AD only) */}
      {canDecide && (
        <section>
          <P4DecisionPanel
            engagementId={engagementId ?? ''}
            jobCode={engagement?.job_code ?? ''}
            allPrereqsPass={allPrereqsPass}
            isPC={isPC}
            onDecisionMade={handleDecisionMade}
          />
        </section>
      )}
    </div>
  );
}
