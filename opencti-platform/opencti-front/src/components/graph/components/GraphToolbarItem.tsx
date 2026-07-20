import IconButton, { IconButtonProps } from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import React, { ReactNode } from 'react';

interface GraphToolbarItemProps {
  title: string;
  color: IconButtonProps['color'];
  Icon: ReactNode;
  onClick: IconButtonProps['onClick'];
  disabled?: boolean;
}

const GraphToolbarItem = ({
  title,
  color,
  Icon,
  onClick,
  disabled,
}: GraphToolbarItemProps) => {
  return (
    <Tooltip title={title}>
      <span>
        <IconButton
          color={color}
          onClick={onClick}
          disabled={disabled}
          size="small"
          sx={{
            color: disabled ? 'var(--ravin-text-muted)' : undefined,
            padding: '8px',
            '&:hover': {
              backgroundColor: 'var(--ravin-surface-2)',
            },
            '& .MuiSvgIcon-root, & svg': {
              fontSize: 20,
              width: 20,
              height: 20,
            },
          }}
        >
          {Icon}
        </IconButton>
      </span>
    </Tooltip>
  );
};

export default GraphToolbarItem;
