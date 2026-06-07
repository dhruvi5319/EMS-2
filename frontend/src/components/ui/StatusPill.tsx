import * as React from 'react';
import { cn } from '@/lib/utils';

/**
 * StatusPill — Design System
 *
 * Single component for:
 *   • Status pills   (passed/in-review/at-risk/blocked/failed/locked/not-started)
 *   • Risk pills     (Low / Medium / High)
 *   • Phase chips    (neutral sunken bg — no status color)
 *
 * Rules:
 *   - bg = family-50, text = family-800, dot = family-600
 *   - Locked/not-started: sunken bg + text-2 (no color family)
 *   - Phase chips: sunken bg + text-2 (neutral — no status meaning)
 *   - font-size 12px / weight 500 / radius pill / padding 3px 10px
 *   - Optional 6px leading dot
 */

// ─── Color family mapping ────────────────────────────────────────────────────

type ColorFamily = 'ok' | 'warn' | 'bad' | 'accent' | 'neutral';

const familyStyles: Record<ColorFamily, { bg: string; text: string; dot: string }> = {
  ok: {
    bg: 'bg-[var(--c-ok-50)]',
    text: 'text-[var(--c-ok-800)]',
    dot: 'bg-[var(--c-ok-600)]',
  },
  warn: {
    bg: 'bg-[var(--c-warn-50)]',
    text: 'text-[var(--c-warn-800)]',
    dot: 'bg-[var(--c-warn-600)]',
  },
  bad: {
    bg: 'bg-[var(--c-bad-50)]',
    text: 'text-[var(--c-bad-800)]',
    dot: 'bg-[var(--c-bad-600)]',
  },
  accent: {
    bg: 'bg-[var(--c-accent-50)]',
    text: 'text-[var(--c-accent-800)]',
    dot: 'bg-[var(--c-accent-600)]',
  },
  neutral: {
    bg: 'bg-[var(--c-sunken)]',
    text: 'text-[var(--c-text-2)]',
    dot: 'bg-[var(--c-text-3)]',
  },
};

// ─── Status → family ────────────────────────────────────────────────────────

export type EngagementStatus =
  | 'passed'
  | 'complete'
  | 'in-review'
  | 'current'
  | 'active'
  | 'at-risk'
  | 'blocked'
  | 'failed'
  | 'declined'
  | 'locked'
  | 'not-started'
  | 'pending'
  | 'returned';

export type RiskLevel = 'Low' | 'Medium' | 'High';

function statusToFamily(status: EngagementStatus): ColorFamily {
  switch (status) {
    case 'passed':
    case 'complete':
      return 'ok';
    case 'in-review':
    case 'current':
    case 'active':
      return 'accent';
    case 'at-risk':
    case 'returned':
      return 'warn';
    case 'blocked':
    case 'failed':
    case 'declined':
      return 'bad';
    case 'locked':
    case 'not-started':
    case 'pending':
    default:
      return 'neutral';
  }
}

function riskToFamily(risk: RiskLevel): ColorFamily {
  switch (risk) {
    case 'Low':    return 'ok';
    case 'Medium': return 'warn';
    case 'High':   return 'bad';
  }
}

// ─── Status label normalization ──────────────────────────────────────────────

function statusLabel(status: EngagementStatus): string {
  const map: Partial<Record<EngagementStatus, string>> = {
    'passed':      'Passed',
    'complete':    'Complete',
    'in-review':   'In Review',
    'current':     'In Review',
    'active':      'Active',
    'at-risk':     'At Risk',
    'blocked':     'Blocked',
    'failed':      'Failed',
    'declined':    'Declined',
    'locked':      'Locked',
    'not-started': 'Not Started',
    'pending':     'Pending',
    'returned':    'Returned',
  };
  return map[status] ?? status;
}

// ─── Component props ─────────────────────────────────────────────────────────

interface StatusPillBaseProps {
  /** Show a 6px leading dot */
  showDot?: boolean;
  className?: string;
  children?: React.ReactNode;
}

interface StatusPillStatusProps extends StatusPillBaseProps {
  /** Engagement / gate status */
  status: EngagementStatus;
  risk?: never;
  phase?: never;
  label?: string;
}

interface StatusPillRiskProps extends StatusPillBaseProps {
  /** Risk level pill */
  risk: RiskLevel;
  status?: never;
  phase?: never;
  label?: string;
}

interface StatusPillPhaseProps extends StatusPillBaseProps {
  /** Phase chip — always neutral (sunken), no status meaning */
  phase: string;
  status?: never;
  risk?: never;
  label?: never;
}

export type StatusPillProps =
  | StatusPillStatusProps
  | StatusPillRiskProps
  | StatusPillPhaseProps;

// ─── Component ───────────────────────────────────────────────────────────────

export function StatusPill({
  showDot = true,
  className,
  children,
  ...rest
}: StatusPillProps) {
  let family: ColorFamily;
  let displayLabel: string;

  if ('phase' in rest && rest.phase !== undefined) {
    family = 'neutral';
    displayLabel = rest.phase;
    showDot = false; // Phase chips don't show dot by convention
  } else if ('risk' in rest && rest.risk !== undefined) {
    family = riskToFamily(rest.risk);
    displayLabel = rest.risk;
  } else {
    const s = (rest as StatusPillStatusProps).status;
    family = statusToFamily(s);
    displayLabel = (rest as StatusPillStatusProps).label ?? statusLabel(s);
  }

  const styles = familyStyles[family];

  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5',
        'rounded-[var(--r-pill)]',
        'px-2.5 py-[3px]',
        'text-[12px] font-medium leading-none',
        styles.bg,
        styles.text,
        className
      )}
    >
      {showDot && (
        <span
          className={cn('inline-block w-1.5 h-1.5 rounded-full shrink-0', styles.dot)}
          aria-hidden="true"
        />
      )}
      {children ?? displayLabel}
    </span>
  );
}

/**
 * Convenience exports for explicit use
 */
export function RiskPill({
  risk,
  showDot,
  className,
}: {
  risk: RiskLevel;
  showDot?: boolean;
  className?: string;
}) {
  return <StatusPill risk={risk} showDot={showDot} className={className} />;
}

export function PhasePill({
  phase,
  className,
}: {
  phase: string;
  className?: string;
}) {
  return <StatusPill phase={phase} showDot={false} className={className} />;
}
