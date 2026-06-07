import * as React from 'react';
import { Check, AlertTriangle, Lock, Loader } from 'lucide-react';
import { cn } from '@/lib/utils';
import { format, parseISO } from 'date-fns';

/**
 * GateRail — Design System Signature Component
 *
 * A horizontal rail of 4 equal cells in a 1px-border, radius-lg container.
 * 1px dividers between cells. Represents the A1 → P2 → P3 → P4 pipeline.
 *
 * Cell states:
 *   passed   — check icon on ok-50/ok-600, ok-800 text
 *   current  — whole cell bg accent-50, spinner on solid accent-600, accent-700/800 text
 *   blocked  — alert icon on bad-50/bad-600, bad-800 text
 *   locked   — lock icon on sunken/text-3, all text text-3, date "—"
 *
 * Only ONE cell is ever "current."
 */

export type GateState = 'passed' | 'current' | 'blocked' | 'locked';

export interface GateCellData {
  /** Gate identifier shown in the cell (A1, P2, P3, P4) */
  id: 'A1' | 'P2' | 'P3' | 'P4';
  /** Sub-label below the gate id */
  subLabel: 'Acceptance' | 'Planning' | 'Evidence' | 'Final';
  /** Lifecycle state of this gate */
  state: GateState;
  /** Status text shown in the cell (e.g. "Passed", "In Review", "Blocked", "Locked") */
  statusText?: string;
  /** ISO date string; displayed as formatted date or "—" for locked */
  date?: string | null;
}

// ─── Icon for each state ─────────────────────────────────────────────────────

function GateIcon({ state }: { state: GateState }) {
  const base = 'w-[22px] h-[22px] rounded-full flex items-center justify-center shrink-0';

  switch (state) {
    case 'passed':
      return (
        <span
          className={cn(base, 'bg-[var(--c-ok-50)]')}
          aria-label="Passed"
        >
          <Check size={13} strokeWidth={2.5} className="text-[var(--c-ok-600)]" />
        </span>
      );
    case 'current':
      return (
        <span
          className={cn(base, 'bg-[var(--c-accent-600)]')}
          aria-label="In progress"
        >
          <Loader
            size={13}
            strokeWidth={2.5}
            className="text-white animate-spin"
            style={{ animationDuration: '1.2s' }}
          />
        </span>
      );
    case 'blocked':
      return (
        <span
          className={cn(base, 'bg-[var(--c-bad-50)]')}
          aria-label="Blocked"
        >
          <AlertTriangle size={13} strokeWidth={2.5} className="text-[var(--c-bad-600)]" />
        </span>
      );
    case 'locked':
    default:
      return (
        <span
          className={cn(base, 'bg-[var(--c-sunken)]')}
          aria-label="Locked"
        >
          <Lock size={12} strokeWidth={2} className="text-[var(--c-text-3)]" />
        </span>
      );
  }
}

// ─── Text color per state ────────────────────────────────────────────────────

function gateIdColor(state: GateState): string {
  switch (state) {
    case 'passed':  return 'text-[var(--c-ok-800)]';
    case 'current': return 'text-[var(--c-accent-700)]';
    case 'blocked': return 'text-[var(--c-bad-800)]';
    case 'locked':  return 'text-[var(--c-text-3)]';
  }
}

function statusTextColor(state: GateState): string {
  switch (state) {
    case 'passed':  return 'text-[var(--c-ok-800)]';
    case 'current': return 'text-[var(--c-accent-800)]';
    case 'blocked': return 'text-[var(--c-bad-800)]';
    case 'locked':  return 'text-[var(--c-text-3)]';
  }
}

function defaultStatusText(state: GateState): string {
  switch (state) {
    case 'passed':  return 'Passed';
    case 'current': return 'In Review';
    case 'blocked': return 'Blocked';
    case 'locked':  return 'Locked';
  }
}

// ─── Format date ─────────────────────────────────────────────────────────────

function formatGateDate(date: string | null | undefined, state: GateState): string {
  if (state === 'locked' || !date) return '—';
  try {
    return format(parseISO(date), 'MMM d, yyyy');
  } catch {
    return '—';
  }
}

// ─── Single gate cell ────────────────────────────────────────────────────────

function GateCell({ gate }: { gate: GateCellData }) {
  const isCurrent = gate.state === 'current';

  return (
    <div
      className={cn(
        'flex flex-col items-start gap-2 px-5 py-4 flex-1 min-w-0',
        isCurrent && 'bg-[var(--c-accent-50)]'
      )}
      aria-current={isCurrent ? 'step' : undefined}
    >
      {/* Icon row */}
      <div className="flex items-center gap-2">
        <GateIcon state={gate.state} />
        <span
          className={cn(
            'font-mono text-[13px] font-medium tracking-tight',
            gateIdColor(gate.state)
          )}
        >
          {gate.id}
        </span>
      </div>

      {/* Sub-label */}
      <div className={cn('text-[13px] font-medium text-[var(--c-text-2)]')}>
        {gate.subLabel}
      </div>

      {/* Status text */}
      <div className={cn('text-[12px] font-medium', statusTextColor(gate.state))}>
        {gate.statusText ?? defaultStatusText(gate.state)}
      </div>

      {/* Date — mono */}
      <div
        className={cn(
          'font-mono text-[12px]',
          gate.state === 'locked' ? 'text-[var(--c-text-3)]' : 'text-[var(--c-text-2)]'
        )}
      >
        {formatGateDate(gate.date, gate.state)}
      </div>
    </div>
  );
}

// ─── GateRail ────────────────────────────────────────────────────────────────

export interface GateRailProps {
  /** Ordered A1 → P2 → P3 → P4 gate data. Exactly 4 entries expected. */
  gates: GateCellData[];
  className?: string;
}

export function GateRail({ gates, className }: GateRailProps) {
  // Validate only one "current" gate
  const currentCount = gates.filter((g) => g.state === 'current').length;
  if (currentCount > 1 && process.env.NODE_ENV !== 'production') {
    console.warn('[GateRail] Only one gate should be in "current" state at a time.');
  }

  return (
    <div
      className={cn(
        'flex rounded-[var(--r-lg)] border border-[var(--c-border)] overflow-hidden',
        className
      )}
      role="list"
      aria-label="Gate pipeline"
    >
      {gates.map((gate, i) => (
        <React.Fragment key={gate.id}>
          {i > 0 && (
            <div
              className="w-px bg-[var(--c-border)] self-stretch shrink-0"
              aria-hidden="true"
            />
          )}
          <div role="listitem" className="flex-1 min-w-0">
            <GateCell gate={gate} />
          </div>
        </React.Fragment>
      ))}
    </div>
  );
}

/**
 * Helper: build GateCellData array from a simple gate-status record.
 *
 * Usage:
 *   const gates = buildGates({ A1: 'passed', P2: 'current', P3: 'locked', P4: 'locked' });
 */
export function buildGates(
  stateMap: Record<'A1' | 'P2' | 'P3' | 'P4', GateState>,
  dates?: Partial<Record<'A1' | 'P2' | 'P3' | 'P4', string | null>>,
  statusTexts?: Partial<Record<'A1' | 'P2' | 'P3' | 'P4', string>>
): GateCellData[] {
  const ids: Array<'A1' | 'P2' | 'P3' | 'P4'> = ['A1', 'P2', 'P3', 'P4'];
  const subLabels: GateCellData['subLabel'][] = ['Acceptance', 'Planning', 'Evidence', 'Final'];

  return ids.map((id, i) => ({
    id,
    subLabel: subLabels[i],
    state: stateMap[id],
    date: dates?.[id],
    statusText: statusTexts?.[id],
  }));
}
