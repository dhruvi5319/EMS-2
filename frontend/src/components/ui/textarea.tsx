import * as React from 'react';
import { cn } from '@/lib/utils';

/**
 * Textarea — Design System
 * Same visual treatment as Input:
 *   8px 12px padding, 1px border-strong, radius-md, white bg
 *   Focus: accent-600 border + 3px accent-100 halo
 */
function Textarea({ className, ...props }: React.TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return (
    <textarea
      className={cn(
        'flex min-h-[80px] w-full',
        'rounded-[var(--r-md)] border border-[var(--c-border-strong)]',
        'bg-white px-3 py-2',
        'text-[14px] text-[var(--c-text-1)] leading-[1.6]',
        'placeholder:text-[var(--c-text-3)]',
        'resize-y',
        'focus:outline-none focus:border-[var(--c-accent-600)]',
        'focus:shadow-[0_0_0_3px_var(--c-accent-100)]',
        'transition-[border-color,box-shadow] duration-150 ease-in-out',
        'disabled:cursor-not-allowed disabled:opacity-45',
        className
      )}
      {...props}
    />
  );
}

export { Textarea };
