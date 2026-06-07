import * as React from 'react';
import { Slot } from '@radix-ui/react-slot';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

/**
 * Button — Design System
 *
 * DS variants:
 *   primary   — accent-600 bg, white text; one per view
 *   secondary — white bg, border-strong, text-1
 *   ghost     — transparent, text-2
 *   danger    — bad-600 bg, white text (decline/delete/fail ONLY)
 *   link      — accent-600 text, underline on hover
 *
 * Shadcn compat aliases:
 *   default     → primary
 *   destructive → danger
 *   outline     → secondary
 *
 * Rules: weight max 500, disabled opacity-45, 150ms transitions, no shadows/gradients.
 */
const buttonVariants = cva(
  'inline-flex items-center justify-center whitespace-nowrap rounded-[var(--r-md)] text-sm font-medium transition-[color,background-color,border-color,box-shadow] duration-150 ease-in-out focus-visible:outline-none focus-visible:shadow-[0_0_0_3px_var(--c-accent-100),0_0_0_1px_var(--c-accent-600)] disabled:pointer-events-none disabled:opacity-45 select-none',
  {
    variants: {
      variant: {
        // ── Design system primaries ────────────────────────────────────────
        primary:
          'bg-[var(--c-accent-600)] text-white hover:bg-[var(--c-accent-700)]',
        secondary:
          'bg-white text-[var(--c-text-1)] border border-[var(--c-border-strong)] hover:bg-[var(--c-sunken)]',
        ghost:
          'text-[var(--c-text-2)] hover:bg-[var(--c-sunken)] hover:text-[var(--c-text-1)]',
        danger:
          'bg-[var(--c-bad-600)] text-white hover:bg-[var(--c-bad-800)]',
        link:
          'text-[var(--c-accent-600)] underline-offset-4 hover:underline hover:text-[var(--c-accent-700)]',
        // ── Shadcn compat aliases ──────────────────────────────────────────
        default:
          'bg-[var(--c-accent-600)] text-white hover:bg-[var(--c-accent-700)]',
        destructive:
          'bg-[var(--c-bad-600)] text-white hover:bg-[var(--c-bad-800)]',
        outline:
          'bg-white text-[var(--c-text-1)] border border-[var(--c-border-strong)] hover:bg-[var(--c-sunken)]',
      },
      size: {
        default: 'h-9 px-4 py-2',
        sm: 'h-8 px-3 py-1.5 text-xs',
        lg: 'h-10 px-6 py-2.5',
        icon: 'h-9 w-9 p-0',
      },
    },
    defaultVariants: {
      variant: 'primary',
      size: 'default',
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : 'button';
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    );
  }
);
Button.displayName = 'Button';

export { Button, buttonVariants };
