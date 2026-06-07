import * as React from 'react';
import { cn } from '@/lib/utils';

/**
 * Textarea — Design System
 *
 * IMPORTANT: must use React.forwardRef so react-hook-form's `register()` ref
 * callback reaches the underlying <textarea> DOM node. Without it, RHF sees
 * the input as uncontrolled and never reads the value → form state stays
 * undefined → validation reports "expected string, received undefined" even
 * while the user is typing visible characters into the textarea.
 */
const Textarea = React.forwardRef<
  HTMLTextAreaElement,
  React.TextareaHTMLAttributes<HTMLTextAreaElement>
>(({ className, ...props }, ref) => {
  return (
    <textarea
      ref={ref}
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
});
Textarea.displayName = 'Textarea';

export { Textarea };
