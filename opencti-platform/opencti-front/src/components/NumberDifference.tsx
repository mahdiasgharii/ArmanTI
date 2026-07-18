import { ArrowUp, ArrowDown, ArrowRight } from 'lucide-react';
import { useFormatter } from './i18n';
interface ItemNumberDifferenceProps {
  value: number;
  description: string;
}

const NumberDifference = ({ value, description }: ItemNumberDifferenceProps) => {
  const { t_i18n, n } = useFormatter();

  const colorClass = value > 0
    ? 'text-success-light'
    : value < 0
      ? 'text-danger-light'
      : 'text-text-muted';

  let Icon = ArrowUp;
  if (value < 0) Icon = ArrowDown;
  if (value === 0) Icon = ArrowRight;

  return (
    <div
      className={`flex items-center gap-0.5 whitespace-nowrap text-xs ${colorClass}`}
    >
      <Icon size={14} aria-hidden="true" />
      <span className="font-display tabular-nums">{n(value)}</span>
      {description && (
        <span className="ml-1 text-text-muted">
          ({t_i18n(description)})
        </span>
      )}
    </div>
  );
};

export default NumberDifference;
