import React from 'react';

export type FindingStatus = 'draft' | 'under_review' | 'accepted' | 'rejected';

interface StatusStyle {
  bg: string;
  text: string;
  label: string;
}

const STATUS_STYLES: Record<FindingStatus, StatusStyle> = {
  draft: {
    bg: 'hsl(0 0% 93%)',
    text: 'hsl(0 0% 35%)',
    label: 'Draft',
  },
  under_review: {
    bg: 'hsl(0 0% 93%)',
    text: 'hsl(0 0% 35%)',
    label: 'Under Review',
  },
  // 'accepted' maps to "Final" label (green)
  accepted: {
    bg: 'hsl(142 71% 88%)',
    text: 'hsl(142 70% 28%)',
    label: 'Final',
  },
  rejected: {
    bg: 'hsl(0 72% 93%)',
    text: 'hsl(0 72% 38%)',
    label: 'Rejected',
  },
};

export const FindingStatusBadge: React.FC<{ status: FindingStatus }> = ({ status }) => {
  const style = STATUS_STYLES[status] ?? STATUS_STYLES.draft;
  return (
    <span
      role="img"
      aria-label={`Finding status: ${style.label}`}
      style={{
        background: style.bg,
        color: style.text,
        display: 'inline-flex',
        alignItems: 'center',
        height: 20,
        borderRadius: 4,
        padding: '0 8px',
        fontSize: 12,
        fontWeight: 400,
        lineHeight: 1.4,
        whiteSpace: 'nowrap',
      }}
    >
      {style.label}
    </span>
  );
};
