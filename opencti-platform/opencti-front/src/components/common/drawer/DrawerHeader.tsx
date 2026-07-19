import { Stack, Typography } from '@mui/material';
import IconButton from '../button/IconButton';
import { X as Close } from 'lucide-react';
import React from 'react';

interface DrawerHeaderProps {
  title: string;
  onClose?: () => void;
  endContent?: React.ReactNode;
}

const DrawerHeader = ({ title, onClose, endContent }: DrawerHeaderProps) => {
  return (
    <Stack
      direction="row"
      sx={{
        backgroundColor: 'transparent',
        paddingX: 3,
        paddingY: 2,
        alignItems: 'center',
        justifyContent: 'space-between',
      }}
    >
      <Typography
        variant="h5"
        style={{ textWrap: 'nowrap' }}
      >
        {title}
      </Typography>

      <Stack direction="row" alignItems="center" gap={1}>
        {endContent}
        <IconButton
          aria-label="Close"
          onClick={onClose}
          size="default"
        >
          <Close />
        </IconButton>
      </Stack>
    </Stack>
  );
};

export default DrawerHeader;
