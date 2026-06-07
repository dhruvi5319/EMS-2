import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

/**
 * Alert — Design System
 *
 * Kept for shadcn compat. Prefer the Callout component for new usage —
 * it has a richer API and cleaner DS alignment.
 *
 * Variants:
 *   default     → info (accent)
 *   destructive → bad (blocked/failed)
 */
const alertVariants = cva(
  [
    'relative w-full rounded-[var(--r-md)] px-4 py-3 text-[13px]',
    'border-l-2',
    '[&>svg+div]:translate-y-[-3px]',
    '[&>svg]:absolute [&>svg]:left-4 [&>svg]:top-[14px]',
    '[&>svg~*]:pl-7',
  ].join(' '),
  {
    variants: {
      variant: {
        default: [
          'bg-[var(--c-accent-50)] text-[var(--c-accent-800)]',
          'border-[var(--c-accent-600)]',
          '[&>svg]:text-[var(--c-accent-600)]',
        ].join(' '),
        destructive: [
          'bg-[var(--c-bad-50)] text-[var(--c-bad-800)]',
          'border-[var(--c-bad-600)]',
          '[&>svg]:text-[var(--c-bad-600)]',
        ].join(' '),
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  }
);

function Alert({
  className,
  variant,
  ...props
}: React.HTMLAttributes<HTMLDivElement> & VariantProps<typeof alertVariants>) {
  return (
    <div
      role="alert"
      className={cn(alertVariants({ variant }), className)}
      {...props}
    />
  );
}

function AlertTitle({ className, ...props }: React.HTMLAttributes<HTMLParagraphElement>) {
  return (
    <h5
      className={cn('mb-1 text-[14px] font-medium leading-none', className)}
      {...props}
    />
  );
}

function AlertDescription({ className, ...props }: React.HTMLAttributes<HTMLParagraphElement>) {
  return (
    <div
      className={cn('text-[13px] leading-[1.6] [&_p]:leading-[1.6]', className)}
      {...props}
    />
  );
}

export { Alert, AlertTitle, AlertDescription };
