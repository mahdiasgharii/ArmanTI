import { ReactNode } from 'react';
import { useFormatter } from '../i18n';
import NumberDifference from '../NumberDifference';
import { Bug, FileText, Flag, Radar, ShieldAlert, Target } from 'lucide-react';
import { Skeleton } from '../ui/skeleton';

const entityTypeIconMap: Record<string, ReactNode> = {
  'Intrusion-Set': <Radar size={18} />,
  'Malware': <Bug size={18} />,
  'Report': <FileText size={18} />,
  'Indicator': <Flag size={18} />,
  'Threat-Actor': <ShieldAlert size={18} />,
  'Campaign': <Target size={18} />,
};

export interface WidgetNumberProps {
  label: string;
  value: number;
  diffLabel?: string;
  diffValue?: number;
  entityType?: string;
  icon?: ReactNode;
  action?: ReactNode;
}

const WidgetNumber = ({
  label,
  value,
  diffLabel,
  diffValue,
  entityType,
  icon,
  action,
}: WidgetNumberProps) => {
  const { n } = useFormatter();

  const entityIcon = entityType ? (entityTypeIconMap[entityType] ?? null) : null;
  const chipIcon = entityIcon ?? icon;

  return (
    <div className="flex h-full flex-col justify-between gap-3">
      <div className="flex flex-row items-center justify-between gap-2">
        <span className="min-w-0 truncate font-body text-[13px] font-medium text-text-muted lowercase first-letter:uppercase">
          {label}
        </span>
        <div className="flex shrink-0 items-center gap-1">
          {chipIcon && (
            <span
              className="flex size-9 items-center justify-center rounded-[4px] text-primary transition-colors duration-200"
              style={{
                backgroundColor: 'color-mix(in srgb, var(--ravin-primary) 12%, transparent)',
                border: '1px solid color-mix(in srgb, var(--ravin-primary) 22%, transparent)',
              }}
              aria-hidden="true"
            >
              {chipIcon}
            </span>
          )}
          {action}
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <div
          data-testid={`card-number-${label}`}
          className="font-display text-[2.25rem] font-semibold leading-none tracking-tight tabular-nums text-text-base"
        >
          {n(value)}
        </div>
        {diffValue !== undefined && diffLabel && (
          <NumberDifference
            value={diffValue}
            description={diffLabel}
          />
        )}
      </div>
    </div>
  );
};

export default WidgetNumber;

export const WidgetNumberSkeleton = () => (
  <div className="flex h-full flex-col justify-between gap-3">
    <div className="flex flex-row items-center justify-between">
      <Skeleton className="h-3 w-20" />
      <Skeleton className="size-9" />
    </div>
    <div className="flex flex-col gap-2">
      <Skeleton className="h-9 w-24" />
      <Skeleton className="h-4 w-28" />
    </div>
  </div>
);
