import * as React from 'react';
import { Check } from 'lucide-react';
import { cn } from '../../lib/utils';

interface StepperProps {
  steps: string[];
  activeStep: number;
  className?: string;
}

function Stepper({ steps, activeStep, className }: StepperProps) {
  return (
    <div className={cn('flex items-center w-full', className)}>
      {steps.map((label, index) => {
        const isCompleted = index < activeStep;
        const isActive = index === activeStep;
        return (
          <React.Fragment key={label}>
            <div className="flex flex-col items-center gap-2">
              <div
                className={cn(
                  'flex h-8 w-8 items-center justify-center rounded-full border-2 text-sm font-medium transition-colors',
                  isCompleted && 'border-primary bg-primary text-white',
                  isActive && 'border-primary text-primary',
                  !isCompleted && !isActive && 'border-border-strong text-text-muted',
                )}
              >
                {isCompleted ? (
                  <Check className="h-4 w-4" />
                ) : (
                  index + 1
                )}
              </div>
              <span
                className={cn(
                  'text-xs font-medium lowercase first-letter:uppercase whitespace-nowrap',
                  isActive ? 'text-text-base' : 'text-text-muted',
                )}
              >
                {label}
              </span>
            </div>
            {index < steps.length - 1 && (
              <div
                className={cn(
                  'h-[2px] flex-1 mx-2 transition-colors',
                  index < activeStep ? 'bg-primary' : 'bg-border',
                )}
              />
            )}
          </React.Fragment>
        );
      })}
    </div>
  );
}

export { Stepper };
