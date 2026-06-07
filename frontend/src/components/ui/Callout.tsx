import * as React from 'react';
import { AlertTriangle, XCircle, CheckCircle, Info, type LucideProps } from 'lucide-react';
import { cn } from '@/lib/utils';

/**
 * Callout — Design System
 *
 * Tinted background = family-50, text = family-800, leading icon.
 * Variants: bad (blockers), warn (at-risk), ok (success), info (accent/guidance).
 *
 * Use sparingly — a screen full of callouts means none register.
 */

type CalloutVariant = 'bad' | 'warn' | 'ok' | 'info';

type LucideIcon = React.ForwardRefExoticComponent<Omit<LucideProps, 'ref'> & React.RefAttributes<SVGSVGElement>>;

const variantConfig: Record<
  CalloutVariant,
  { bg: string; text: string; border: string; icon: LucideIcon }
> = {
  bad: {
    bg: 'bg-[var(--c-bad-50)]',
    text: 'text-[var(--c-bad-800)]',
    border: 'border-[var(--c-bad-600)]',
    icon: XCircle,
  },
  warn: {
    bg: 'bg-[var(--c-warn-50)]',
    text: 'text-[var(--c-warn-800)]',
    border: 'border-[var(--c-warn-600)]',
    icon: AlertTriangle,
  },
  ok: {
    bg: 'bg-[var(--c-ok-50)]',
    text: 'text-[var(--c-ok-800)]',
    border: 'border-[var(--c-ok-600)]',
    icon: CheckCircle,
  },
  info: {
    bg: 'bg-[var(--c-accent-50)]',
    text: 'text-[var(--c-accent-800)]',
    border: 'border-[var(--c-accent-600)]',
    icon: Info,
  },
};

export interface CalloutProps {
  variant: CalloutVariant;
  /** Short title displayed in bold */
  title?: string;
  className?: string;
  children: React.ReactNode;
}

export function Callout({ variant, title, className, children }: CalloutProps) {
  const { bg, text, border, icon: Icon } = variantConfig[variant];

  return (
    <div
      role="alert"
      className={cn(
        'flex gap-3 rounded-[var(--r-md)] p-4',
        'border-l-2',
        bg,
        text,
        border,
        className
      )}
    >
      <Icon size={16} className={cn('mt-0.5 shrink-0', text)} />
      <div className="flex-1 min-w-0">
        {title && (
          <div className="font-medium text-[14px] mb-1">{title}</div>
        )}
        <div className="text-[13px] leading-[1.6]">{children}</div>
      </div>
    </div>
  );
}
