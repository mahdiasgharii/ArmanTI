import DrawerHeader from '@common/drawer/DrawerHeader';
import { Plus as Add, Pencil as Edit } from 'lucide-react';
import Dialog from '@mui/material/Dialog';
import Fab from '@mui/material/Fab';
import { createStyles } from '@mui/styles';
import makeStyles from '@mui/styles/makeStyles';
import React, { CSSProperties, forwardRef, isValidElement, useEffect, useState } from 'react';
import { SubscriptionAvatars } from '../../../../components/Subscription';
import type { Theme } from '../../../../components/Theme';
import useAuth from '../../../../utils/hooks/useAuth';
import { useRavinTheme } from '../../../../lib/useRavinTheme';
import { GenericContext } from '../model/GenericContextModel';
import { SxProps, Stack } from '@mui/material';

export enum DrawerVariant {
  create = 'create',
  update = 'update',
  createWithPanel = 'createWithPanel',
  createWithLargePanel = 'createWithLargePanel',
  updateWithPanel = 'updateWithPanel',
}

export type DrawerSize = 'small' | 'medium' | 'large' | 'extraLarge';

// Deprecated - https://mui.com/system/styles/basics/
// Do not use it for new code.
const useStyles = makeStyles<Theme, { bannerHeightNumber: number }>((theme) => createStyles({
  container: {
    padding: theme.spacing(3),
    height: '100%',
    overflowY: 'auto',
    display: 'flex',
    flexDirection: 'column',
    gap: theme.spacing(2),
  },
  mainButton: ({ bannerHeightNumber }) => ({
    position: 'fixed',
    bottom: `${bannerHeightNumber + 30}px`,
    right: 30,
  }),
}));

export interface DrawerControlledDialProps {
  onOpen: () => void;
  onClose?: () => void;
}
export type DrawerControlledDialType = ({ onOpen, onClose }: DrawerControlledDialProps) => React.ReactElement;

interface DrawerProps {
  title: string;
  children?:
  | ((props: { onClose: () => void }) => React.ReactElement)
  | React.ReactElement
  | null;
  open?: boolean;
  onClose?: () => void;
  variant?: DrawerVariant;
  context?: readonly (GenericContext | null)[] | null;
  header?: React.ReactElement;
  subHeader?: {
    right?: React.ReactElement[];
    left?: React.ReactElement[];
  };
  controlledDial?: DrawerControlledDialType;
  containerStyle?: CSSProperties;
  disabled?: boolean;
  size?: DrawerSize;
  sx?: SxProps;
  disableBackdropClose?: boolean;
}

const getDrawerWidth = (size: DrawerSize) => {
  switch (size) {
    case 'small': return '420px';
    case 'medium': return '640px';
    case 'large': return '960px';
    case 'extraLarge': return '90vw';
  }
};

// eslint-disable-next-line react/display-name
const Drawer = forwardRef<HTMLDivElement, DrawerProps>(({
  title,
  children,
  open: defaultOpen = false,
  onClose,
  variant,
  context,
  header,
  subHeader,
  controlledDial,
  containerStyle,
  disabled = false,
  size = 'large',
  disableBackdropClose = false,
}: DrawerProps, ref) => {
  const {
    bannerSettings: { bannerHeightNumber },
  } = useAuth();
  const { mode } = useRavinTheme();
  const isDark = mode === 'dark';

  const classes = useStyles({ bannerHeightNumber });
  const [open, setOpen] = useState(defaultOpen);
  useEffect(() => {
    if (open !== defaultOpen) {
      setOpen(defaultOpen);
    }
  }, [defaultOpen]);

  const handleClose = () => {
    onClose?.();
    setOpen(false);
  };

  const update = variant
    ? [DrawerVariant.update, DrawerVariant.updateWithPanel].includes(variant)
    : undefined;
  let component;
  if (children) {
    if (typeof children === 'function') {
      component = children({ onClose: handleClose });
    } else if (isValidElement(children) && children.type === React.Fragment) {
      // Fragments don't accept props, so we can't pass onClose to them
      component = children;
    } else {
      component = React.cloneElement(children as React.ReactElement, {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        onClose: handleClose,
      });
    }
  }

  const renderSubHeader = () => {
    if (!subHeader) return null;

    if (subHeader.left && subHeader.right) {
      return (
        <Stack direction="row" justifyContent="space-between">
          <Stack direction="row" gap={1}>
            {subHeader.left}
          </Stack>
          <Stack direction="row" gap={1}>
            {subHeader.right}
          </Stack>
        </Stack>
      );
    }

    if (subHeader.left && !subHeader.right) {
      return (
        <Stack direction="row" gap={1}>
          {subHeader.left}
        </Stack>
      );
    }

    if (!subHeader.left && subHeader.right) {
      return (
        <Stack direction="row" gap={1} justifyContent="flex-end">
          {subHeader.right}
        </Stack>
      );
    }
  };

  return (
    <>
      {controlledDial && (
        // issue with calling controlledDial as function, so all hooks inside controlledDial func are counted
        // as Drawer hook list, when undefined, the hooks disapear, breaks the rules of hooks
        // -> creating new element will separate component with isolated hooks tree
        React.createElement(controlledDial, { onOpen: () => setOpen(true), onClose: handleClose })
      )}

      {variant && (
        <Fab
          onClick={() => setOpen(true)}
          style={{ color: 'var(--mui-palette-primary-main)' }}
          aria-label={update ? 'Edit' : 'Add'}
          disabled={disabled}
          className={classes.mainButton}
        >
          {update ? <Edit /> : <Add />}
        </Fab>
      )}
      <Dialog
        open={open}
        maxWidth={false}
        onClose={disableBackdropClose
          ? (_, reason) => {
              if (reason !== 'backdropClick') {
                handleClose();
              }
            }
          : handleClose}
        onClick={(e) => e.stopPropagation()}
        sx={{
          zIndex: 1202,
        }}
        slotProps={{
          paper: {
            ref,
            sx: {
              maxWidth: getDrawerWidth(size),
              width: '100%',
              maxHeight: '85vh',
              overflow: 'hidden',
              borderRadius: '8px',
              border: '1px solid var(--ravin-border)',
              ...(isDark
                ? {
                    backgroundColor: 'color-mix(in srgb, var(--ravin-elevated) 72%, transparent)',
                    backdropFilter: 'blur(16px) saturate(180%)',
                    WebkitBackdropFilter: 'blur(16px) saturate(180%)',
                    '@supports not (backdrop-filter: blur(16px))': {
                      backgroundColor: 'var(--ravin-elevated)',
                    },
                  }
                : {
                    backgroundColor: 'var(--ravin-elevated)',
                    boxShadow: '0 8px 32px 0 rgba(0, 0, 0, 0.12)',
                  }),
            },
          },
        }}
      >
        <DrawerHeader
          title={title}
          endContent={(
            <>
              {context && <SubscriptionAvatars context={context} />}
              {header}
            </>
          )}
          onClose={handleClose}
        />

        <div
          className={`${classes.container} ravin-drawer-fields`}
          style={{
            ...containerStyle,
          }}
        >
          {renderSubHeader()}
          {component}
        </div>
      </Dialog>
    </>
  );
});

export default Drawer;
