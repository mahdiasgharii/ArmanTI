import React, { FunctionComponent, ReactElement, useEffect, useLayoutEffect, useRef, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import Drawer from '@mui/material/Drawer';
import MenuList from '@mui/material/MenuList';
import MenuItem from '@mui/material/MenuItem';
import ListItemText from '@mui/material/ListItemText';
import ListItemIcon from '@mui/material/ListItemIcon';
import { styled } from '@mui/material/styles';
import Tooltip from '@mui/material/Tooltip';
import EEChip from '@components/common/entreprise_edition/EEChip';
import { Stack } from '@mui/material';
import Box from '@mui/material/Box';
import { useFormatter } from '../../../../components/i18n';
import useAuth from '../../../../utils/hooks/useAuth';
import { useSettingsMessagesBannerHeight } from '../../settings/settings_messages/SettingsMessagesBanner';
import useTopBanner from '../../../../utils/hooks/useTopBanner';
import { TOP_BAR_HEIGHT } from '../../nav/TopBar';

const StyledDrawer = styled(Drawer)(() => ({
  '& .MuiDrawer-paper': {
    minHeight: '100dvh',
    width: 200,
    position: 'fixed',
    overflow: 'hidden',
    padding: '8px 12px 8px 4px',
    zIndex: 998,
    right: 'var(--chatbot-sidebar-width, 0px)',
    transition: 'right 225ms cubic-bezier(0.4, 0, 0.2, 1)',
    background: 'transparent',
    border: 'none',
    boxShadow: 'none',
  },
}));

export interface MenuEntry {
  path: string;
  label: string;
  icon?: ReactElement;
  isEE?: boolean;
}

const TruncatedText: FunctionComponent<{ children: React.ReactNode }> = ({ children }) => {
  const textRef = useRef<HTMLDivElement>(null);
  const [isTruncated, setIsTruncated] = useState(false);

  useEffect(() => {
    const textElement = textRef.current;
    if (textElement) {
      setIsTruncated(textElement.scrollWidth > textElement.clientWidth);
    }
  }, [children]);

  const content = (
    <Box
      sx={{ overflow: 'hidden', textOverflow: 'ellipsis' }}
      ref={textRef}
    >
      {children}
    </Box>
  );

  if (isTruncated) {
    return (
      <Tooltip title={children} arrow placement="left-start">
        {content}
      </Tooltip>
    );
  }

  return content;
};

const RIGHT_MENU_WIDTH = 204;

const NavToolbarMenu: FunctionComponent<{ entries: MenuEntry[] }> = ({ entries }) => {
  const { t_i18n } = useFormatter();
  const location = useLocation();
  const { bannerSettings } = useAuth();
  const settingsMessagesBannerHeight = useSettingsMessagesBannerHeight();
  const { height: topBannerHeight } = useTopBanner();

  const bannerHeight = bannerSettings.bannerHeightNumber;

  useLayoutEffect(() => {
    document.documentElement.style.setProperty('--right-menu-width', `${RIGHT_MENU_WIDTH}px`);
  }, []);

  const renderLabel = (entry: MenuEntry) => {
    const translatedLabel = t_i18n(entry.label);

    if (entry.isEE) {
      return (
        <Stack direction="row">
          <TruncatedText>{translatedLabel}</TruncatedText>
          <EEChip />
        </Stack>
      );
    }

    return <TruncatedText>{translatedLabel}</TruncatedText>;
  };

  return (
    <StyledDrawer variant="permanent" anchor="right">
      <div style={{ minHeight: TOP_BAR_HEIGHT }} />
      <div
        data-right-menu="true"
        style={{
          display: 'flex',
          flexDirection: 'column',
          height: '100%',
          borderRadius: '0.625rem',
          backgroundColor: 'var(--ravin-bg)',
          border: 'none',
          overflow: 'hidden',
        }}
      >
        <div
          className="hide-scrollbar"
          style={{
            overflow: 'auto',
            overflowX: 'hidden',
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            minHeight: 0,
            marginTop: bannerHeight + settingsMessagesBannerHeight + topBannerHeight,
            marginBottom: bannerHeight,
          }}
        >
          <MenuList component="nav" disablePadding sx={{ px: 1.5, py: 1 }}>
            {entries.map((entry, idx) => {
              const isSelected = location.pathname.startsWith(entry.path);
              const iconColor = isSelected ? 'var(--ravin-primary)' : 'var(--ravin-text-muted)';
              const iconOpacity = isSelected ? 1 : 0.7;
              const textColor = isSelected ? 'var(--ravin-primary)' : 'var(--ravin-text)';
              return (
                <MenuItem
                  key={idx}
                  component={Link}
                  to={entry.path}
                  dense
                  sx={{
                    px: 1.5,
                    py: 0,
                    height: '40px',
                    borderRadius: '4px',
                    mx: 0,
                    mb: 0.5,
                    backgroundColor: isSelected ? 'var(--ravin-surface-2)' : 'transparent',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'flex-start',
                    transition: 'background-color 150ms cubic-bezier(0.25, 1, 0.5, 1), transform 150ms cubic-bezier(0.25, 1, 0.5, 1)',
                    position: 'relative',
                    '&:hover': {
                      backgroundColor: 'var(--ravin-surface-2)',
                      transform: 'scale(1.02)',
                    },
                    '&:active': {
                      transform: 'scale(0.98)',
                    },
                    '&::after': {
                      content: '""',
                      position: 'absolute',
                      right: 0,
                      top: '50%',
                      transform: isSelected ? 'translateY(-50%) scaleY(1)' : 'translateY(-50%) scaleY(0)',
                      width: '2px',
                      height: '20px',
                      backgroundColor: 'var(--ravin-primary)',
                      borderRadius: '1px',
                      transition: 'transform 200ms cubic-bezier(0.25, 1, 0.5, 1)',
                    },
                  }}
                >
                  {entry.icon && (
                    <ListItemIcon
                      sx={{
                        minWidth: '0px!important',
                        mr: 1,
                        opacity: iconOpacity,
                        color: iconColor,
                        transition: 'color 200ms cubic-bezier(0.25, 1, 0.5, 1), opacity 200ms cubic-bezier(0.25, 1, 0.5, 1)',
                        '& svg': {
                          fontSize: '18px',
                        },
                      }}
                    >{entry.icon}
                    </ListItemIcon>
                  )}
                  <ListItemText
                    primary={renderLabel(entry)}
                    slotProps={{
                      primary: {
                        sx: {
                          fontFamily: 'Peyda, sans-serif',
                          fontSize: '14px',
                          color: textColor,
                          textTransform: 'lowercase',
                          transition: 'color 200ms cubic-bezier(0.25, 1, 0.5, 1)',
                          '&::first-letter': {
                            textTransform: 'uppercase',
                          },
                        },
                      },
                    }}
                  />
                </MenuItem>
              );
            })}
          </MenuList>
        </div>
      </div>
    </StyledDrawer>
  );
};

export default NavToolbarMenu;
