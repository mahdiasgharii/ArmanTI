import { ReactNode } from 'react';
import { useFormatter } from '../i18n';
import NumberDifference from '../NumberDifference';
import { Bug, FileText, Flag, Radar, ShieldAlert, Target } from 'lucide-react';

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

  return (
    <div className="flex h-full flex-col justify-between gap-2">
      <div className="flex flex-row items-center justify-between">
        <div className="flex items-center gap-1.5">
          {entityType && (entityTypeIconMap[entityType] ?? null) && (
            <span className="text-primary" aria-hidden="true">
              {entityTypeIconMap[entityType]}
            </span>
          )}
          <span className="font-body text-xs text-text-muted lowercase first-letter:uppercase">{label}</span>
        </div>
        {action}
      </div>

      <div className="flex flex-row items-end justify-between">
        <div className="flex flex-col gap-0.5">
          <div
            data-testid={`card-number-${label}`}
            className="font-display text-metric tabular-nums text-text-base"
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
        {icon}
      </div>
    </div>
  );
};

export default WidgetNumber;
