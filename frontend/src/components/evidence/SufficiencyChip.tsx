import React from 'react';
import { XCircle, Clock, CheckCircle } from 'lucide-react';

export type SufficiencyStatus = 'evidence_needed' | 'in_review' | 'sufficient';

export const SUFFICIENCY_LABELS: Record<SufficiencyStatus, string> = {
  evidence_needed: 'Evidence Needed',
  in_review: 'In Review',
  sufficient: 'Sufficient',
};

const STATUS_STYLES: Record<
  SufficiencyStatus,
  { bg: string; text: string; border: string; icon: React.ReactNode }
> = {
  evidence_needed: {
    bg: 'hsl(0 72% 93%)',
    text: 'hsl(0 72% 38%)',
    border: '1px solid hsl(0 72% 51%)',
    icon: <XCircle size={14} style={{ color: 'hsl(0 72% 51%)' }} />,
  },
  in_review: {
    bg: 'hsl(45 96% 88%)',
    text: 'hsl(45 90% 28%)',
    border: '1px solid hsl(45 90% 52%)',
    icon: <Clock size={14} style={{ color: 'hsl(45 90% 52%)' }} />,
  },
  sufficient: {
    bg: 'hsl(142 71% 88%)',
    text: 'hsl(142 70% 28%)',
    border: '1px solid hsl(142 71% 45%)',
    icon: <CheckCircle size={14} style={{ color: 'hsl(142 71% 45%)' }} />,
  },
};

export const SufficiencyChip: React.FC<{ status: SufficiencyStatus }> = ({ status }) => {
  const styles = STATUS_STYLES[status];
  return (
    <span
      role="img"
      aria-label={`Sufficiency: ${SUFFICIENCY_LABELS[status]}`}
      style={{
        background: styles.bg,
        color: styles.text,
        border: styles.border,
        display: 'inline-flex',
        alignItems: 'center',
        gap: 4,
        height: 24,
        borderRadius: 4,
        padding: '2px 8px',
        fontSize: 12,
        fontWeight: 400,
        lineHeight: 1.4,
        whiteSpace: 'nowrap',
      }}
    >
      {styles.icon}
      {SUFFICIENCY_LABELS[status]}
    </span>
  );
};
