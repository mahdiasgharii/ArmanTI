import React from 'react';
import { ArrowUp, ArrowDown, ArrowRight } from 'lucide-react';
import { useTheme } from '@mui/material/styles';
import type { Theme } from './Theme';
import { useFormatter } from './i18n';
interface ItemNumberDifferenceProps {
  value: number;
  description: string;
}

const NumberDifference = ({ value, description }: ItemNumberDifferenceProps) => {
  const theme = useTheme<Theme>();
  const { t_i18n } = useFormatter();

  const inlineStyles = {
    green: {
      color: theme.palette.success.main,
    },
    red: {
      color: theme.palette.error.main,
    },
    blueGrey: {
      color: theme.palette.common.grey,
    },
  };

  let color = inlineStyles.green;
  if (value < 0) color = inlineStyles.red;
  if (value === 0) color = inlineStyles.blueGrey;

  let Icon = ArrowUp;
  if (value < 0) Icon = ArrowDown;
  if (value === 0) Icon = ArrowRight;

  return (
    <div style={{
      ...color,
      fontSize: 12,
      display: 'flex',
      alignItems: 'center',
      gap: theme.spacing(0.25),
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
