import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '../../lib/utils';

const badgeVariants = cva(
  'inline-flex items-center rounded-[4px] px-2 py-0.5 text-xs font-medium lowercase first-letter:uppercase transition-colors focus:outline-none',
  {
    variants: {
      variant: {
        default: 'border border-transparent bg-primary/15 text-primary',
        secondary: 'border border-transparent bg-elevated text-text-base',
        destructive: 'border border-transparent bg-danger/15 text-danger',
        success: 'border border-transparent bg-success/15 text-success',
        warning: 'border border-transparent bg-warning/15 text-warning',
        outline: 'border border-border text-text-base',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  },
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
