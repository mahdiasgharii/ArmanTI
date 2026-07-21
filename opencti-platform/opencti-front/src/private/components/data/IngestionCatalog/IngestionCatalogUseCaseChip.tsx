import { Tooltip } from '@mui/material';
import Chip, { ChipProps } from '@mui/material/Chip';
import React from 'react';

interface IngestionCatalogChipProps {
  label: string;
  tooltipLabel?: string;
  variant?: 'outlined' | 'filled';
  color?: 'primary' | 'secondary' | 'error' | 'success' | 'warning' | string;
  withTooltip?: boolean;
  isInTooltip?: boolean;
  isInlist?: boolean;
  style?: React.CSSProperties;
}

interface CustomChipProps extends Omit<ChipProps, 'color'> {
  color?: 'primary' | 'secondary' | 'error' | 'warning' | 'success' | 'info' | 'default' | string;
}

const CustomChip = ({ color, ...props }: CustomChipProps) => {
  const validMuiColors = ['primary', 'secondary', 'error', 'warning', 'success', 'info', 'default'];
  const isMuiColor = color && validMuiColors.includes(color);

  return (
    <Chip
      {...props}
      color={isMuiColor ? (color as ChipProps['color']) : undefined}
      sx={{
        ...(color && !isMuiColor && {
          borderColor: color,
          color,
        }),
        ...props.sx,
      }}
    />
  );
};

const IngestionCatalogChip = ({
  label,
  tooltipLabel,
  variant,
  color,
  withTooltip = false,
  isInlist = false,
  style,
}: IngestionCatalogChipProps) => {
  const tooltipContent = withTooltip ? (tooltipLabel || label) : undefined;

  const isPrimary = color === 'primary';
  const chipColor = isPrimary ? 'var(--ravin-primary)' : (color && !['primary', 'secondary', 'error', 'warning', 'success', 'info', 'default'].includes(color) ? color : 'var(--ravin-text-muted)');

  return (
    <Tooltip title={tooltipContent}>
      <CustomChip
        variant={variant ?? 'outlined'}
        size="small"
        color={color ?? 'default'}
        sx={{
          fontSize: 11,
          lineHeight: '14px',
          borderRadius: '4px',
          marginRight: isInlist ? 0.5 : 0,
          border: `1px solid ${chipColor}`,
          backgroundColor: 'var(--ravin-surface-2)',
          color: chipColor,
        }}
        style={style}
        label={label}
      />
    </Tooltip>
  );
};

export default IngestionCatalogChip;
