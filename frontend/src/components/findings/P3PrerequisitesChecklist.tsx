import React from 'react';
import { CheckCircle, XCircle } from 'lucide-react';

interface Blocker {
  type: string;
  message: string;
}

// Positive prerequisite conditions that always display when allPass=false
const POSITIVE_CONDITIONS = [
  { key: 'p2_approved', label: 'P2 approved' },
];

interface P3PrerequisitesChecklistProps {
  blockers: Array<Blocker>;
  allPass: boolean;
}

export const P3PrerequisitesChecklist: React.FC<P3PrerequisitesChecklistProps> = ({
  blockers,
  allPass,
}) => {
  return (
    <div
      aria-label="P3 Gate Prerequisites"
      style={{
        background: 'white',
        border: '1px solid hsl(214 32% 91%)',
        borderRadius: 8,
        padding: 16,
        marginTop: 16,
      }}
    >
      <h3 style={{ fontSize: 12, fontWeight: 400, textTransform: 'uppercase', letterSpacing: '0.05em', color: 'hsl(215 16% 47%)', marginBottom: 12, marginTop: 0 }}>
        P3 Gate Prerequisites
      </h3>
      <ul role="list" style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: 8 }}>
        {/* Blocking items */}
        {blockers.map((blocker) => (
          <li
            key={blocker.type}
            role="listitem"
            aria-label={`Prerequisite: ${blocker.message} — fail`}
            style={{ display: 'flex', alignItems: 'center', gap: 8 }}
          >
            <XCircle size={16} style={{ color: 'hsl(0 72% 51%)', flexShrink: 0 }} />
            <span style={{ fontSize: 14, fontWeight: 400, color: 'hsl(0 72% 38%)' }}>
              {blocker.message}
            </span>
          </li>
        ))}

        {/* When all pass, show a general success */}
        {allPass && (
          <li
            role="listitem"
            aria-label="Prerequisite: All P3 prerequisites satisfied — pass"
            style={{ display: 'flex', alignItems: 'center', gap: 8 }}
          >
            <CheckCircle size={16} style={{ color: 'hsl(142 71% 45%)', flexShrink: 0 }} />
            <span style={{ fontSize: 14, fontWeight: 400 }}>
              All P3 prerequisites satisfied.
            </span>
          </li>
        )}

        {/* Show positive items when there are blockers (indicates what IS passing) */}
        {!allPass && blockers.length > 0 && POSITIVE_CONDITIONS.map((condition) => {
          // Check if this positive condition is NOT in blockers
          const isBlocked = blockers.some((b) => b.type === condition.key);
          if (!isBlocked) {
            return (
              <li
                key={condition.key}
                role="listitem"
                aria-label={`Prerequisite: ${condition.label} — pass`}
                style={{ display: 'flex', alignItems: 'center', gap: 8 }}
              >
                <CheckCircle size={16} style={{ color: 'hsl(142 71% 45%)', flexShrink: 0 }} />
                <span style={{ fontSize: 14, fontWeight: 400 }}>
                  {condition.label}
                </span>
              </li>
            );
          }
          return null;
        })}
      </ul>
    </div>
  );
};
