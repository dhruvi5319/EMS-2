import React from 'react';
import { GapObjectiveCard } from './GapObjectiveCard';
import type { CoverageObjective } from '@/hooks/useEvidence';

type Props = {
  engagementId: string;
  objectives: CoverageObjective[];
  onLinkClick: (objective: CoverageObjective) => void;
  milestones?: { evidence_readiness_target?: string };
};

export const GapViewPanel: React.FC<Props> = ({
  objectives,
  onLinkClick,
  milestones,
}) => {
  const gapObjectives = objectives.filter((o) => o.evidence_count === 0);
  const total = objectives.length;
  const gapCount = gapObjectives.length;

  // All covered: show green success banner
  if (total > 0 && gapCount === 0) {
    return (
      <div
        className="rounded-lg p-4"
        style={{
          background: 'hsl(142 71% 88%)',
          color: 'hsl(142 70% 28%)',
        }}
      >
        All objectives have linked evidence. No gaps.
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Header */}
      <div>
        <h2 className="text-[16px] font-semibold text-foreground">
          Evidence Gap View — Objectives with No Evidence
        </h2>
        {total > 0 && gapCount > 0 && (
          <p className="text-[14px] text-muted-foreground mt-1">
            {gapCount} of {total} objective{total !== 1 ? 's' : ''} have no linked evidence{' '}
            <span
              className="font-medium"
              style={{ color: 'hsl(0 72% 38%)' }}
            >
              (P3 blocker)
            </span>
          </p>
        )}
        {total === 0 && (
          <p className="text-[14px] text-muted-foreground mt-1">
            No objectives defined for this engagement.
          </p>
        )}
      </div>

      {/* Gap cards */}
      {gapObjectives.length > 0 && (
        <div className="space-y-3">
          {gapObjectives.map((obj) => (
            <GapObjectiveCard
              key={obj.id}
              objective={obj}
              milestoneDate={milestones?.evidence_readiness_target}
              onLinkClick={onLinkClick}
            />
          ))}
        </div>
      )}
    </div>
  );
};
