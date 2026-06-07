import * as React from 'react';
import { cn } from '@/lib/utils';

/**
 * MetricCard — Design System
 *
 * Sunken bg (--c-sunken), no border, radius-md, padding 16px.
 * 13px text-2 label above a 26px/500 mono value.
 * Value gets warn-800 or bad-800 color only when the number itself demands attention.
 *
 * attention variants:
 *   'none'   — neutral (default)
 *   'warn'   — warn-800 value (e.g. approaching threshold)
 *   'bad'    — bad-800 value (e.g. open blockers > 0)
 */

export type MetricAttention = 'none' | 'warn' | 'bad';

const valueColorMap: Record<MetricAttention, string> = {
  none: 'text-[var(--c-text-1)]',
  warn: 'text-[var(--c-warn-800)]',
  bad:  'text-[var(--c-bad-800)]',
};

export interface MetricCardProps {
  /** Short label shown above the value */
  label: string;
  /** The metric value — displayed in monospace */
  value: string | number;
  /** Optional sub-label shown below the value */
  subLabel?: string;
  /** Color the value when it demands attention */
  attention?: MetricAttention;
  className?: string;
}

export function MetricCard({
  label,
  value,
  subLabel,
  attention = 'none',
  className,
}: MetricCardProps) {
  return (
    <div
      className={cn(
        'bg-[var(--c-sunken)] rounded-[var(--r-md)] p-4',
        className
      )}
    >
      {/* Label */}
      <div className="text-[13px] text-[var(--c-text-2)] leading-[1.6] mb-1">
        {label}
      </div>

      {/* Value — mono, 26px/500 */}
      <div
        className={cn(
          'font-mono font-medium leading-none',
          'text-[26px]',
          valueColorMap[attention]
        )}
      >
        {value}
      </div>

      {/* Sub-label */}
      {subLabel && (
        <div className="mt-1 text-[12px] text-[var(--c-text-3)] leading-[1.6]">
          {subLabel}
        </div>
      )}
    </div>
  );
}

/**
 * MetricCardRow — convenience wrapper for a row of MetricCards
 */
export function MetricCardRow({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={cn('grid grid-cols-2 sm:grid-cols-4 gap-3', className)}>
      {children}
    </div>
  );
}
