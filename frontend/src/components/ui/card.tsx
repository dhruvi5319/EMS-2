import * as React from 'react';
import { cn } from '@/lib/utils';

/**
 * Card — Design System
 *
 * Raised card: white bg + 1px --c-border + radius-lg + padding 24px
 * Use MetricCard (separate component) for metric cards (--c-sunken bg, no border, radius-md, p-16px)
 */

function Card({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        'bg-white border border-[var(--c-border)] rounded-[var(--r-lg)] p-6',
        className
      )}
      {...props}
    />
  );
}

function CardHeader({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={cn('flex flex-col space-y-1.5 mb-4', className)} {...props} />
  );
}

function CardTitle({ className, ...props }: React.HTMLAttributes<HTMLHeadingElement>) {
  return (
    <h3
      className={cn(
        'text-[14px] font-semibold leading-[1.4] text-[var(--c-text-1)]',
        className
      )}
      {...props}
    />
  );
}

function CardDescription({ className, ...props }: React.HTMLAttributes<HTMLParagraphElement>) {
  return (
    <p
      className={cn('text-[13px] text-[var(--c-text-2)] leading-[1.6]', className)}
      {...props}
    />
  );
}

function CardContent({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={cn('', className)} {...props} />
  );
}

function CardFooter({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        'flex items-center pt-4 mt-4 border-t border-[var(--c-border)]',
        className
      )}
      {...props}
    />
  );
}

export { Card, CardHeader, CardFooter, CardTitle, CardDescription, CardContent };
