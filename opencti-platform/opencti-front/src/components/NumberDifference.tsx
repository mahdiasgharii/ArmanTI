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
    <div
      className="text-xs"
      style={{
      ...color,
      display: 'flex',
      alignItems: 'center',
      gap: 3,
      whiteSpace: 'nowrap',
    }}
    >
      <Icon size={13} />
      <span style={{ fontVariantNumeric: 'tabular-nums' }}>{value}</span>
      {description && (
        <span style={{ color: 'var(--ravin-text-muted)' }}>
          ({t_i18n(description)})
        </span>
      )}
    </div>
  );
};

export default NumberDifference;
