import { X as CloseOutlined } from 'lucide-react';
import { Box, DialogActionsProps, DialogContent, DialogContentProps, DialogTitle } from '@mui/material';
import MUIDialog, { DialogProps as MUIDialogProps } from '@mui/material/Dialog';
import { ReactNode } from 'react';
import IconButton from '../button/IconButton';

type DialogProps = {
  title?: ReactNode;
  contentProps?: DialogContentProps;
  actionsProps?: DialogActionsProps;
  size?: DialogSize;
  showCloseButton?: boolean;
  glass?: boolean;
} & Omit<MUIDialogProps, 'title'>;

type DialogSize = 'small' | 'medium' | 'large';

const DIALOG_SIZES: Record<DialogSize, string> = {
  small: '420px',
  medium: '640px',
  large: '960px',
};

const GLASS_PAPER_SX = {
  backgroundColor: 'color-mix(in srgb, var(--ravin-elevated) 65%, transparent)',
  backdropFilter: 'blur(40px) saturate(200%)',
  WebkitBackdropFilter: 'blur(40px) saturate(200%)',
  border: '1px solid color-mix(in srgb, var(--ravin-border-strong) 50%, transparent)',
  borderRadius: '12px',
  boxShadow: '0 24px 48px rgba(0, 0, 0, 0.4), 0 0 0 1px rgba(255, 255, 255, 0.04) inset',
  '@supports not (backdrop-filter: blur(40px))': {
    backgroundColor: 'var(--ravin-elevated)',
  },
};

const GLASS_BACKDROP_SX = {
  backgroundColor: 'color-mix(in srgb, var(--ravin-bg) 60%, transparent)',
  backdropFilter: 'blur(8px)',
  WebkitBackdropFilter: 'blur(8px)',
  '@supports not (backdrop-filter: blur(8px))': {
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
  },
};

const Dialog = ({
  title,
  children,
  contentProps,
  size = 'medium',
  showCloseButton = false,
  glass = false,
  onClose,
  fullScreen = false,
  ...dialogProps
}: DialogProps) => {
  return (
    <MUIDialog
      {...dialogProps}
      fullScreen={fullScreen}
      onClose={onClose}
      slotProps={{
        paper: {
          sx: {
            paddingTop: 3,
          },
        },
        backdrop: {
          sx: {
            ...(glass ? GLASS_BACKDROP_SX : {}),
          },
        },
      }}
      sx={{
        '& .MuiDialog-paper': {
          ...(!fullScreen && {
            maxWidth: DIALOG_SIZES[size],
            width: '100%',
          }),
          ...(glass ? GLASS_PAPER_SX : {}),
        },

        ...dialogProps.sx,
      }}
    >
      {(title || showCloseButton) && (
        <DialogTitle sx={{
          paddingY: 0,
          paddingX: 3,
          mb: 2,
          display: 'flex',
          alignItems: 'center',
          justifyContent: showCloseButton && !title ? 'flex-end' : 'space-between',
        }}
        >
          {title && <Box component="span" sx={{ width: '100%' }}>{title}</Box>}
          {showCloseButton && onClose && (
            <IconButton
              aria-label="close"
              onClick={(event) => onClose?.(event, 'escapeKeyDown')}
              size="default"
            >
              <CloseOutlined size={24} />
            </IconButton>
          )}
        </DialogTitle>
      )}

      <DialogContent {...contentProps} sx={{ pY: 0, pX: 3 }}>
        {children}
      </DialogContent>
    </MUIDialog>
  );
};

export default Dialog;
