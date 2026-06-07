import * as React from 'react';
import * as LabelPrimitive from '@radix-ui/react-label';
import { cn } from '@/lib/utils';

/**
 * Label — Design System
 * 13px / weight 500 / text-1
 * 6px gap below before its associated input (handled by form layout)
 */
function Label({
  className,
  ...props
}: React.ComponentPropsWithoutRef<typeof LabelPrimitive.Root>) {
  return (
    <LabelPrimitive.Root
      className={cn(
        'text-[13px] font-medium text-[var(--c-text-1)] leading-none',
        'peer-disabled:cursor-not-allowed peer-disabled:opacity-45',
        className
      )}
      {...props}
    />
  );
}

export { Label };
