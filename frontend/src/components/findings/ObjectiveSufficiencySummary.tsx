import React from 'react';
import { XCircle, CheckCircle } from 'lucide-react';
import { SufficiencyChip } from '@/components/evidence/SufficiencyChip';
import type { SufficiencyStatus } from '@/components/evidence/SufficiencyChip';
import type { CoverageObjective } from '@/hooks/useEvidence';

interface ObjectiveSufficiencySummaryProps {
  objectives: CoverageObjective[];
  allPass: boolean;
  blockerMessage?: string;
}

export const ObjectiveSufficiencySummary: React.FC<ObjectiveSufficiencySummaryProps> = ({
  objectives,
  allPass,
  blockerMessage,
}) => {
  const blockerCount = objectives.filter((o) => o.sufficiency_status === 'evidence_needed').length;

  return (
    <div
      aria-label="Objective Sufficiency Summary"
      style={{
        background: 'white',
        border: '1px solid hsl(214 32% 91%)',
        borderRadius: 8,
        padding: 16,
        marginBottom: 16,
      }}
    >
      {/* Objectives with SufficiencyChips */}
      <div
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: 12,
          marginBottom: 12,
          alignItems: 'center',
        }}
      >
        {objectives.map((obj, idx) => (
          <div key={obj.id} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <span
              style={{
                fontSize: 12,
                fontWeight: 400,
                color: 'hsl(215 16% 47%)',
                whiteSpace: 'nowrap',
              }}
            >
              Obj {idx + 1}
            </span>
            <SufficiencyChip status={obj.sufficiency_status as SufficiencyStatus} />
          </div>
        ))}
        {objectives.length === 0 && (
          <span style={{ fontSize: 12, color: 'hsl(215 16% 47%)' }}>No objectives defined.</span>
        )}
      </div>

      {/* Gate status line */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 6,
          fontSize: 14,
          fontWeight: 600,
        }}
      >
        {allPass ? (
          <>
            <CheckCircle size={16} style={{ color: 'hsl(142 71% 45%)' }} />
            <span style={{ color: 'hsl(142 70% 28%)' }}>
              P3 gate conditions met — ready to submit for review.
            </span>
          </>
        ) : (
          <>
            <XCircle size={16} style={{ color: 'hsl(0 72% 51%)' }} />
            <span style={{ color: 'hsl(0 72% 38%)' }}>
              P3 Gate Status: BLOCKED —{' '}
              {blockerMessage ?? `${blockerCount} objective(s) need evidence`}
            </span>
          </>
        )}
      </div>
    </div>
  );
};
