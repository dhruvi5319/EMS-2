import * as React from 'react';
import { cn } from '@/lib/utils';

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {}

/**
 * Input — Design System
 *
 * - padding 8px 12px, 1px --c-border-strong border, radius-md, white bg
 * - Focus: border --c-accent-600 + 3px --c-accent-100 halo
 * - Date/number: font-mono
 * - Disabled: opacity-45
 */
const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, ...props }, ref) => {
    const isMonoType = type === 'date' || type === 'number' || type === 'time' || type === 'datetime-local';

    return (
      <input
        type={type}
        className={cn(
          // Base
          'flex w-full rounded-[var(--r-md)] border border-[var(--c-border-strong)]',
          'bg-white px-3 py-2 text-[14px] text-[var(--c-text-1)]',
          'leading-[1.6]',
          // Placeholder
          'placeholder:text-[var(--c-text-3)]',
          // Focus
          'focus:outline-none focus:border-[var(--c-accent-600)]',
          'focus:shadow-[0_0_0_3px_var(--c-accent-100)]',
          // Transition
          'transition-[border-color,box-shadow] duration-150 ease-in-out',
          // File input reset
          'file:border-0 file:bg-transparent file:text-sm file:font-medium',
          // Disabled
          'disabled:cursor-not-allowed disabled:opacity-45',
          // Mono for date/number types
          isMonoType && 'font-mono',
          className
        )}
        ref={ref}
        {...props}
      />
    );
  }
);
Input.displayName = 'Input';

export { Input };
