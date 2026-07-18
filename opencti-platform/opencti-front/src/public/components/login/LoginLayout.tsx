import { Box, Stack, SxProps } from '@mui/material';
import { useTheme } from '@mui/styles';
import { PropsWithChildren } from 'react';
import { Theme } from '../../../components/Theme';
import logoTextDark from '../../../static/images/logo_text_dark.svg';
import logoTextLight from '../../../static/images/logo_text_light.svg';
import SystemBanners from '../SystemBanners';
import { LoginRootPublicQuery$data } from '../../__generated__/LoginRootPublicQuery.graphql';
import LoginLogo from './LoginLogo';
import { hasCustomColor } from '../../../utils/theme';
import { getLoginAsideType } from '../../../private/components/settings/themes/theme-utils';
import Cubes from './Cubes';

const ArmanCTIBaseline = () => {
  return (
    <Box
      sx={{
        position: 'absolute',
        bottom: 24,
        left: 24,
        zIndex: 2,
        pointerEvents: 'none',
      }}
    >
      <Box
        component="span"
        sx={{
          fontFamily: '"Peyda", sans-serif',
          fontSize: '13px',
          fontWeight: 500,
          color: 'var(--ravin-text)',
          textTransform: 'lowercase',
          opacity: 0.7,
          '&::first-letter': {
            textTransform: 'uppercase',
          },
        }}
      >
        ArmanCTI
      </Box>
    </Box>
  );
};

const ArmanCTIBrandAside = () => {
  const theme = useTheme<Theme>();
  const isDark = theme.palette.mode === 'dark';
  const logo = isDark ? logoTextDark : logoTextLight;
  const rippleColor = theme.palette.designSystem.primary.main;
  const faceColor = isDark ? '#171717' : '#F4F4F5';
  const borderColor = isDark ? '#3F3F46' : '#D4D4D8';

  return (
    <Box
      sx={{
        position: 'absolute',
        inset: 0,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '20px',
      }}
    >
      {/* Cubes animated background */}
      <Box
        sx={{
          position: 'absolute',
          inset: 0,
          zIndex: 0,
          opacity: 0.6,
          maskImage: 'radial-gradient(ellipse 80% 80% at center, black 30%, transparent 90%)',
          WebkitMaskImage: 'radial-gradient(ellipse 80% 80% at center, black 30%, transparent 90%)',
        }}
      >
        <Cubes
          gridSize={10}
          maxAngle={45}
          radius={4}
          borderStyle={`1px solid ${borderColor}`}
          faceColor={faceColor}
          rippleColor={rippleColor}
          rippleSpeed={1.5}
          autoAnimate={true}
          rippleOnClick={true}
        />
      </Box>
      {/* Ambient glow */}
      <Box
        sx={{
          position: 'absolute',
          width: '500px',
          height: '500px',
          borderRadius: '50%',
          background: 'radial-gradient(circle, color-mix(in srgb, var(--ravin-primary) 6%, transparent) 0%, transparent 70%)',
          pointerEvents: 'none',
          zIndex: 0,
        }}
      />
      {/* Wordmark */}
      <img
        src={logo}
        alt="ArmanCTI"
        style={{
          width: 220,
          height: 'auto',
          zIndex: 1,
          userSelect: 'none',
          pointerEvents: 'none',
        }}
      />
      {/* Tagline */}
      <Box
        component="span"
        sx={{
          fontFamily: '"Peyda", sans-serif',
          fontSize: '16px',
          fontWeight: 500,
          color: 'var(--ravin-text)',
          textTransform: 'lowercase',
          letterSpacing: '0.02em',
          zIndex: 1,
          textAlign: 'center',
          '&::first-letter': {
            textTransform: 'uppercase',
          },
        }}
      >
        Cyber threat intelligence platform
      </Box>
    </Box>
  );
};

interface LoginLayoutProps extends PropsWithChildren {
  settings: LoginRootPublicQuery$data['publicSettings'];
}

const LoginLayout = ({ settings, children }: LoginLayoutProps) => {
  const theme = useTheme<Theme>();

  const isEnterpriseEdition = settings.platform_enterprise_edition_license_validated;
  const isWhitemarkEnable = settings.platform_whitemark && isEnterpriseEdition;

  const loginAsideType = getLoginAsideType({
    theme_login_aside_color: settings.platform_theme?.theme_login_aside_color,
    theme_login_aside_gradient_start: settings.platform_theme?.theme_login_aside_gradient_start,
    theme_login_aside_gradient_end: settings.platform_theme?.theme_login_aside_gradient_end,
    theme_login_aside_image: settings.platform_theme?.theme_login_aside_image,
  });

  const getAsideBackground = () => {
    if (loginAsideType === 'color') {
      return settings.platform_theme?.theme_login_aside_color;
    }

    if (loginAsideType === 'gradient') {
      return `linear-gradient(100deg, ${settings.platform_theme?.theme_login_aside_gradient_start} 0%, ${settings.platform_theme?.theme_login_aside_gradient_end} 100%)`;
    }

    if (loginAsideType === 'image') {
      return `url(${settings.platform_theme?.theme_login_aside_image})`;
    }
    // fallback to default — ArmanCTI black canvas
    return 'var(--ravin-bg)';
  };

  const hasCustomBackground = hasCustomColor(theme, 'theme_background');
  const backgroundContent = hasCustomBackground
    ? theme.palette.background.default
    : 'var(--ravin-elevated)';

  const contentSx: SxProps = {
    minWidth: 500,
    overflow: 'hidden',
    background: backgroundContent,
    borderRight: '1px solid var(--ravin-border)',
    zIndex: 2,
  };

  const asideSx: SxProps = {
    background: getAsideBackground(),
    backgroundSize: loginAsideType === 'image' ? 'cover' : undefined,
    backgroundPosition: loginAsideType === 'image' ? 'center' : undefined,
    position: 'relative',
    overflow: 'hidden',
  };

  return (
    <>
      <SystemBanners settings={settings} />
      <Stack data-testid="login-page" direction="row" height="100%">
        <Stack
          flex={1}
          sx={contentSx}
          justifyContent="center"
          alignItems="center"
          gap={4}
        >
          <LoginLogo data={settings} />
          {children}
        </Stack>
        <Box flex={1} sx={asideSx}>
          {loginAsideType === '' && <ArmanCTIBrandAside />}
          {loginAsideType !== '' && !isWhitemarkEnable && <ArmanCTIBaseline />}
        </Box>
      </Stack>
    </>
  );
};

export default LoginLayout;
