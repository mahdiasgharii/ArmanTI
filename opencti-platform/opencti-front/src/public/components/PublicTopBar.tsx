import { useTheme } from '@mui/styles';
import AppBar from '@mui/material/AppBar';
import React from 'react';
import Toolbar from '@mui/material/Toolbar';
import type { Theme } from '../../components/Theme';

export const TOP_BAR_HEIGHT = 60;

const PublicTopBar = ({ title }: { title: string }) => {
  const theme = useTheme<Theme>();

  return (
    <AppBar
      position="fixed"
      elevation={0}
      sx={{
        zIndex: theme.zIndex.drawer + 1,
        borderRadius: '0.625rem',
        background: 'color-mix(in srgb, var(--ravin-bg) 72%, transparent)',
        backdropFilter: 'blur(16px) saturate(180%)',
        WebkitBackdropFilter: 'blur(16px) saturate(180%)',
        borderBottom: '1px solid var(--ravin-border)',
        boxShadow: 'none',
        '@supports not (backdrop-filter: blur(16px))': {
          background: 'var(--ravin-bg)',
        },
      }}
    >
      <Toolbar
        sx={{
          minHeight: `${TOP_BAR_HEIGHT}px !important`,
          display: 'flex',
          alignItems: 'center',
          gap: '16px',
          px: '16px',
        }}
      >
        <img
          src={theme.logo}
          alt="logo"
          height={32}
          style={{ display: 'block' }}
        />
        <span
          style={{
            fontFamily: '"Peyda", sans-serif',
            fontSize: '12px',
            fontWeight: 500,
            color: 'var(--ravin-primary)',
            backgroundColor: 'color-mix(in srgb, var(--ravin-primary) 12%, transparent)',
            padding: '4px 10px',
            borderRadius: '4px',
            textTransform: 'lowercase',
            lineHeight: '1.4',
            letterSpacing: 'normal',
            pointerEvents: 'none',
            whiteSpace: 'nowrap',
          }}
        >
          {title}
        </span>
      </Toolbar>
    </AppBar>
  );
};

export default PublicTopBar;
