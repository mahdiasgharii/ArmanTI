import { ArrowUp, ArrowDown, ArrowRight } from 'lucide-react';
import { useFormatter } from './i18n';
interface ItemNumberDifferenceProps {
  value: number;
  description: string;
}

const NumberDifference = ({ value, description }: ItemNumberDifferenceProps) => {
  const { t_i18n, n } = useFormatter();

  const tone = value > 0 ? 'success' : value < 0 ? 'danger' : 'muted';

  const pillStyle = tone === 'muted'
    ? { backgroundColor: 'color-mix(in srgb, var(--ravin-text-muted) 14%, transparent)' }
    : tone === 'success'
      ? { backgroundColor: 'color-mix(in srgb, var(--ravin-primary) 14%, transparent)' }
      : { backgroundColor: `color-mix(in srgb, var(--ravin-${tone}) 14%, transparent)` };

  const textClass = tone === 'success'
    ? 'text-primary'
    : tone === 'danger'
      ? 'text-danger-light'
      : 'text-text-muted';

  let Icon = ArrowUp;
  if (value < 0) Icon = ArrowDown;
  if (value === 0) Icon = ArrowRight;

  return (
    <div className="flex items-center gap-1.5 whitespace-nowrap text-xs">
      <span
        className={`flex items-center gap-0.5 rounded-[4px] px-1.5 py-0.5 font-display tabular-nums ${textClass}`}
        style={pillStyle}
      >
        <Icon size={13} aria-hidden="true" />
        {n(value)}
      </span>
      {description && (
        <span className="text-text-muted">
          {t_i18n(description)}
        </span>
      )}
    </div>
  );
};

export default NumberDifference;
