import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

/**
 * Badge — Design System
 *
 * Thin wrapper kept for backward compat with shadcn/ui code that imports Badge.
 * Prefer StatusPill for all status / risk / phase display.
 *
 * Variants map to DS color families:
 *   default     → accent (federal blue)
 *   secondary   → neutral (sunken)
 *   destructive → bad (blocked/failed)
 *   outline     → border only, no fill
 */
const badgeVariants = cva(
  [
    'inline-flex items-center rounded-[var(--r-pill)]',
    'px-2.5 py-[3px] text-[12px] font-medium leading-none',
    'transition-colors duration-150',
    'focus:outline-none focus:shadow-[0_0_0_3px_var(--c-accent-100)]',
  ].join(' '),
  {
    variants: {
      variant: {
        default:
          'bg-[var(--c-accent-50)] text-[var(--c-accent-800)] border-transparent',
        secondary:
          'bg-[var(--c-sunken)] text-[var(--c-text-2)] border-transparent',
        destructive:
          'bg-[var(--c-bad-50)] text-[var(--c-bad-800)] border-transparent',
        outline:
          'bg-transparent text-[var(--c-text-1)] border border-[var(--c-border-strong)]',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  }
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props} />
  );
}

export { Badge, badgeVariants };
