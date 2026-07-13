import React from 'react';
import { ArrowUp, ArrowDown, ArrowRight } from 'lucide-react';
import { useFormatter } from './i18n';
interface ItemNumberDifferenceProps {
  value: number;
  description: string;
}

const NumberDifference = ({ value, description }: ItemNumberDifferenceProps) => {
  const { t_i18n } = useFormatter();

  const color = value > 0
    ? { color: 'var(--ravin-success)' }
    : value < 0
      ? { color: 'var(--ravin-danger)' }
      : { color: 'var(--ravin-text-muted)' };

  let Icon = ArrowUp;
  if (value < 0) Icon = ArrowDown;
  if (value === 0) Icon = ArrowRight;

  return (
    <div style={{
      ...color,
      fontSize: 12,
      display: 'flex',
      alignItems: 'center',
      gap: 2,
      whiteSpace: 'nowrap',
    }}
    >
      <Icon size={13} />
      <span>{value}</span>
      {description && (
        <span>
          ({t_i18n(description)})
        </span>
      )}
    </div>
  );
};

export default NumberDifference;
