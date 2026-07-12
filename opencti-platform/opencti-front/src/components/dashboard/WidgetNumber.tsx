import { ReactNode } from 'react';
import { useFormatter } from '../i18n';
import NumberDifference from '../NumberDifference';
import { Bug, FileText, Flag, Radar, ShieldAlert } from 'lucide-react';

const entityTypeIconMap: Record<string, ReactNode> = {
  'Intrusion-Set': <Radar size={28} className="text-white/35" />,
  'Malware': <Bug size={28} className="text-white/35" />,
  'Report': <FileText size={28} className="text-white/35" />,
  'Indicator': <Flag size={28} className="text-white/35" />,
  'Threat-Actor': <ShieldAlert size={28} className="text-white/35" />,
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
    <div className="flex h-full flex-col justify-between">
      <div className="flex flex-row items-start">
        <div className="flex flex-1 flex-row items-start gap-1">
          <span className="font-body text-sm text-white/70">{label}</span>
          {diffValue !== undefined && diffLabel && (
            <NumberDifference
              value={diffValue}
              description={diffLabel}
            />
          )}
        </div>
        {action}
      </div>

      <div className="flex flex-row items-center justify-between">
        <div
          data-testid={`card-number-${label}`}
          className="font-display text-[32px] font-semibold leading-none text-primary"
        >
          {n(value)}
        </div>
        {entityType && (entityTypeIconMap[entityType] ?? null)}
        {icon}
      </div>
    </div>
  );
};

export default WidgetNumber;
