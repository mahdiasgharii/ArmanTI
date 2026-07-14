import { Box } from '@mui/material';
import React from 'react';
import { Link } from 'react-router-dom';

interface LeftBarHeaderProps {
  logo: string;
  logoCollapsed?: string;
  navOpen: boolean;
  bannerHeightNumber: number;
  topBannerHeight: number;
  settingsMessagesBannerHeight: number;
}

export const LeftBarHeader: React.FC<LeftBarHeaderProps> = ({
  logo,
  logoCollapsed,
  navOpen,
  bannerHeightNumber,
  topBannerHeight,
  settingsMessagesBannerHeight,
}) => {
  const currentLogo = navOpen ? logo : (logoCollapsed || logo);

  return (
    <Box
      component={Link}
      to="/dashboard"
      style={{
        marginTop: `calc(${topBannerHeight}px + ${bannerHeightNumber}px + ${settingsMessagesBannerHeight}px)`,
      }}
      sx={{
        padding: navOpen ? '16px 16px 8px 16px' : '16px 0 8px 0',
        width: '100%',
        flexShrink: 0,
        display: 'flex',
        alignItems: 'center',
        gap: 1,
        justifyContent: navOpen ? 'flex-start' : 'center',
        transition: 'padding 250ms cubic-bezier(0.25, 1, 0.5, 1)',
        '&:hover': {
          cursor: 'pointer',
        },
      }}
    >
      <img
        src={currentLogo}
        alt="logo"
        style={{
          height: 60,
          maxWidth: navOpen ? '120px' : '60px',
          objectFit: 'contain',
          transition: 'max-width 250ms cubic-bezier(0.25, 1, 0.5, 1), opacity 200ms cubic-bezier(0.25, 1, 0.5, 1)',
        }}
      />
    </Box>
  );
};
