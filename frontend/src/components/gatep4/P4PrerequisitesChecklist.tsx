import React from 'react';
import { CheckCircle, XCircle } from 'lucide-react';
import { Link } from 'react-router-dom';

export interface PrerequisiteItem {
  type: 'p3_not_approved' | 'has_failed_checks' | 'has_in_review_checks' | 'has_not_started_checks';
  message: string;
  statement_ids?: string[];
}

interface P4PrerequisitesChecklistProps {
  prerequisites: { met: boolean; blockers: PrerequisiteItem[] };
  engagementId: string;
}

const PREREQUISITE_LABELS: Record<string, string> = {
  p3_not_approved: 'Gate P3 approved',
  has_failed_checks: 'No failed reference checks',
  has_in_review_checks: 'No in-review reference checks',
  has_not_started_checks: 'No not-started reference checks (all statements complete)',
};

// All 4 expected prerequisite types in display order
const PREREQUISITE_TYPES: Array<PrerequisiteItem['type']> = [
  'p3_not_approved',
  'has_failed_checks',
  'has_in_review_checks',
  'has_not_started_checks',
];

export const P4PrerequisitesChecklist: React.FC<P4PrerequisitesChecklistProps> = ({
  prerequisites,
  engagementId,
}) => {
  const failingTypes = new Set(prerequisites.blockers.map((b) => b.type));
  const blockerByType = Object.fromEntries(
    prerequisites.blockers.map((b) => [b.type, b])
  ) as Record<string, PrerequisiteItem>;

  return (
    <div>
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
        P4 Prerequisites
      </h3>

      <ul role="list" style={{ listStyle: 'none', padding: 0, margin: 0 }}>
        {PREREQUISITE_TYPES.map((type, index) => {
          const isFailing = failingTypes.has(type);
          const blocker = blockerByType[type];
          const label = PREREQUISITE_LABELS[type] ?? type;

          return (
            <li
              key={type}
              role="listitem"
              aria-label={`Prerequisite ${index + 1}: ${label} — ${isFailing ? 'fail' : 'pass'}`}
              style={{
                display: 'flex',
                alignItems: 'flex-start',
                gap: 8,
                minHeight: 40,
                padding: '8px 0',
                borderBottom:
                  index < PREREQUISITE_TYPES.length - 1
                    ? '1px solid hsl(214 32% 91%)'
                    : 'none',
              }}
            >
              {/* Icon */}
              <div style={{ flexShrink: 0, marginTop: 2 }}>
                {isFailing ? (
                  <XCircle size={16} style={{ color: 'hsl(0 72% 51%)' }} />
                ) : (
                  <CheckCircle size={16} style={{ color: 'hsl(142 70% 28%)' }} />
                )}
              </div>

              {/* Label + optional links */}
              <div style={{ flex: 1 }}>
                <span style={{ fontSize: 14, fontWeight: 400 }}>{label}</span>

                {isFailing && blocker && (
                  <div style={{ marginTop: 4 }}>
                    {/* Show message */}
                    <span
                      style={{ fontSize: 12, color: 'hsl(0 72% 38%)', display: 'block' }}
                    >
                      {blocker.message}
                    </span>

                    {/* Show statement links if applicable */}
                    {blocker.statement_ids && blocker.statement_ids.length > 0 && (
                      <div
                        style={{
                          display: 'flex',
                          gap: 8,
                          flexWrap: 'wrap',
                          marginTop: 4,
                        }}
                      >
                        {blocker.statement_ids.slice(0, 5).map((stmtId) => (
                          <Link
                            key={stmtId}
                            to={`/engagements/${engagementId}/draft/statements/${stmtId}`}
                            style={{ fontSize: 12, color: 'hsl(221 83% 53%)' }}
                          >
                            View Statement →
                          </Link>
                        ))}
                      </div>
                    )}

                    {/* P3 gate link */}
                    {type === 'p3_not_approved' && (
                      <Link
                        to={`/engagements/${engagementId}/evidence/p3-review`}
                        style={{ fontSize: 12, color: 'hsl(221 83% 53%)', display: 'block', marginTop: 4 }}
                      >
                        View P3 Review →
                      </Link>
                    )}
                  </div>
                )}
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
};
