import { ReactNode } from 'react';
import { useFormatter } from '../i18n';
import NumberDifference from '../NumberDifference';
import { Bug, FileText, Flag, Radar, ShieldAlert } from 'lucide-react';

const entityTypeIconMap: Record<string, ReactNode> = {
  'Intrusion-Set': <Radar size={20} />,
  'Malware': <Bug size={20} />,
  'Report': <FileText size={20} />,
  'Indicator': <Flag size={20} />,
  'Threat-Actor': <ShieldAlert size={20} />,
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
    <div className="flex h-full flex-col justify-between gap-4">
      <div className="flex flex-row items-center justify-between">
        <div className="flex items-center gap-2">
          {entityType && (entityTypeIconMap[entityType] ?? null) && (
            <span className="flex items-center justify-center w-8 h-8 rounded-[4px] bg-surface-2 text-text-light">
              {entityTypeIconMap[entityType]}
            </span>
          )}
          <span className="font-body text-sm text-text-muted lowercase first-letter:uppercase">{label}</span>
        </div>
        {action}
      </div>

      <div className="flex flex-row items-end justify-between">
        <div className="flex flex-col gap-1">
          <div
            data-testid={`card-number-${label}`}
            className="font-display text-[32px] font-semibold leading-none text-text-base"
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
