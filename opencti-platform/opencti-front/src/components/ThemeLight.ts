import { buttonClasses } from '@mui/material/Button';
import type { ExtendedThemeOptions } from './Theme';
import { fileUri } from '../relay/environment';
import LogoText from '../static/images/logo_text_light.svg';
import LogoCollapsed from '../static/images/logo_light.svg';
import { hexToRGB } from '../utils/Colors';
import { alpha, darken, lighten } from '@mui/material';

const EE_COLOR = '#019BE5';

export const THEME_LIGHT_DEFAULT_BACKGROUND = '#F5F5F5';
export const THEME_LIGHT_DEFAULT_BODY_END_GRADIENT = '#FFFFFF';
export const THEME_LIGHT_DEFAULT_PRIMARY = '#019BE5';
const THEME_LIGHT_DEFAULT_SECONDARY = '#860EFE';
const THEME_LIGHT_DEFAULT_ACCENT = '#E5E5E5';
const THEME_LIGHT_DEFAULT_TEXT = '#0A0A0A';
export const THEME_LIGHT_DEFAULT_PAPER = '#ffffff';
const THEME_LIGHT_DEFAULT_NAV = '#ffffff';
export const THEME_LIGHT_DIALOG_BACKGROUND = '#FFFFFF';

const getAppBodyGradientEndColor = (background: string | null): string => {
  if (background && background !== THEME_LIGHT_DEFAULT_BACKGROUND) {
    return lighten(background, 0.05);
  }
  return THEME_LIGHT_DEFAULT_BODY_END_GRADIENT;
};

const ThemeLight = (
  logo: string | null = null,
  logo_collapsed: string | null = null,
  background: string | null = null,
  paper: string | null = null,
  nav: string | null = null,
  primary: string | null = null,
  secondary: string | null = null,
  accent: string | null = null,
  text_color = THEME_LIGHT_DEFAULT_TEXT,
): ExtendedThemeOptions => ({
  logo: logo || fileUri(LogoText),
  logo_collapsed: logo_collapsed || fileUri(LogoCollapsed),
  borderRadius: 4,
  palette: {
    mode: 'light',
    common: { white: '#ffffff', grey: '#666666', lightGrey: '#999999' },
    error: {
      main: '#F20F0F',
      dark: '#881106',
    },
    warn: {
      main: '#E6700F',
    },
    dangerZone: {
      main: '#F20F0F',
      light: '#FF6B6B',
      dark: '#881106',
      contrastText: '#000000',
      text: { primary: '#881106' },
    },
    success: { main: '#17AB1F', dark: '#094E0B' },
    primary: { main: primary || THEME_LIGHT_DEFAULT_PRIMARY, light: primary ? alpha(primary, 0.08) : '#66C4F5' },
    secondary: { main: secondary || THEME_LIGHT_DEFAULT_SECONDARY },
    gradient: { main: '#860EFE' },
    border: {
      lightBackground: hexToRGB('#000000', 0.12),
      primary: hexToRGB((primary || THEME_LIGHT_DEFAULT_PRIMARY), 0.3),
      secondary: '#CCCCCC',
      pagination: hexToRGB('#000000', 0.5),
      paper: hexToRGB('#000000', 0.12),
      main: '#E0E0E0',
    },
    pagination: {
      main: '#000000',
    },
    chip: { main: '#000000' },
    ai: {
      main: '#860EFE',
      light: '#B88DFF',
      dark: '#4A08A0',
      contrastText: '#000000',
      background: 'rgba(134, 14, 254, 0.08)',
    },
    ee: {
      main: EE_COLOR,
      background: hexToRGB(EE_COLOR, 0.2),
      lightBackground: hexToRGB(EE_COLOR, 0.08),
      contrastText: '#F2F2F3',
    },
    background: {
      default: background || THEME_LIGHT_DEFAULT_BACKGROUND,
      paper: paper || THEME_LIGHT_DEFAULT_PAPER,
      nav: nav || THEME_LIGHT_DEFAULT_NAV,
      accent: accent || THEME_LIGHT_DEFAULT_ACCENT,
      shadow: alpha('#000000', 0.08),
      // the only way for now to know if we should apply the paper color or not
      secondary: paper === THEME_LIGHT_DEFAULT_PAPER
        ? '#FAFAFA'
        : (paper ?? '#FAFAFA'),
      drawer: nav === THEME_LIGHT_DEFAULT_PAPER
        ? '#FAFAFA'
        : (darken(nav ?? '#FAFAFA', 0.5)),
      disabled: '#EBEBEB',
      gradient: {
        start: background || THEME_LIGHT_DEFAULT_BACKGROUND,
        end: getAppBodyGradientEndColor(background),
      },
    },
    text: {
      secondary: THEME_LIGHT_DEFAULT_TEXT,
      tertiary: '#666666',
      light: '#999999',
      disabled: '#B3B3B3',
    },
    leftBar: {
      header: {
        itemBackground: '#F5F5F5',
      },
      popoverItem: '#F5F5F5',
      hover: 'rgba(1, 155, 229, 0.08)',
      text: '#0A0A0A',
    },
    severity: {
      critical: '#EE3838',
      high: '#E6700F',
      medium: '#E1B823',
      low: '#16AD34',
      info: '#1565c0',
      none: '#424242',
      default: '#EBEBEB',
    },
    designSystem: {
      primary: {
        main: '#019BE5',
        light: '#66C4F5',
        dark: '#0073A8',
      },
      secondary: {
        main: '#860EFE',
        light: '#B88DFF',
        dark: '#4A08A0',
      },
      destructive: {
        main: '#F20F0F',
        light: '#FF6B6B',
        dark: '#881106',
      },
      ia: {
        main: '#860EFE',
        light: '#B88DFF',
        dark: '#4A08A0',
      },
      background: {
        main: '#F5F5F5',
        bg1: '#FFFFFF',
        bg2: '#FAFAFA',
        bg3: '#EBEBEB',
        bg4: '#E0E0E0',
        disabled: '#EBEBEB',
      },
      border: {
        main: '#E0E0E0',
        border1: '#CCCCCC',
        border2: '#E5E5E5',
      },
      gradient: {
        background: 'linear-gradient(180deg, #F5F5F5 0%, #FFFFFF 100%)',
        ia: 'linear-gradient(90deg, #B88DFF 0%, #860EFE 100%)',
        focus: 'linear-gradient(90deg, #019BE5 0%, #860EFE 100%)',
      },
      alert: {
        info: {
          primary: '#019BE5',
          secondary: '#66C4F5',
        },
        success: {
          primary: '#17AB1F',
          secondary: '#41E149',
          tertiary: '#094E0B',
        },
        alert: {
          primary: '#F2BE3A',
          secondary: '#F6CE6A',
        },
        warning: {
          primary: '#E6700F',
          secondary: '#F8C08C',
        },
        error: {
          primary: '#F20F0F',
          secondary: '#FF6B6B',
        },
      },
      tertiary: {
        grey: {
          400: '#666666',
          700: '#999999',
          800: '#B3B3B3',
        },
        blue: {
          500: '#019BE5',
          900: '#003A5C',
        },
        darkBlue: {
          300: '#66C4F5',
          500: '#019BE5',
        },
        turquoise: {
          600: '#860EFE',
          800: '#4A08A0',
        },
        green: {
          400: '#41E149',
          600: '#17AB1F',
          800: '#094E0B',
        },
        red: {
          100: '#FBCBC5',
          200: '#FF6B6B',
          400: '#F20F0F',
          500: '#D00D0D',
          600: '#A00A0A',
          700: '#881106',
        },
        orange: {
          400: '#F2933A',
          500: '#E6700F',
        },
        yellow: {
          400: '#F2BE3A',
        },
      },
    },
  },
  tag: {
    overflowColor: primary || THEME_LIGHT_DEFAULT_PRIMARY,
  },
  typography: {
    fontFamily: '"Peyda", sans-serif',
    body2: {
      fontSize: '0.8rem',
      lineHeight: '1.2rem',
      color: text_color,
    },
    body1: {
      fontSize: '0.9rem',
      color: text_color,
    },
    overline: {
      fontWeight: 500,
      color: text_color,
    },
    h1: {
      margin: '0 0 10px 0',
      padding: 0,
      fontWeight: 400,
      fontSize: 22,
      fontFamily: '"Peyda", sans-serif',
      color: text_color,
      textTransform: 'lowercase',
      '&::first-letter': {
        textTransform: 'uppercase',
      },
    },
    h2: {
      margin: '0 0 10px 0',
      padding: 0,
      fontWeight: 500,
      fontSize: 16,
      fontFamily: '"Peyda", sans-serif',
      color: text_color,
      textTransform: 'lowercase',
      '&::first-letter': {
        textTransform: 'uppercase',
      },
    },
    h3: {
      margin: '0 0 10px 0',
      padding: 0,
      color: text_color,
      fontWeight: 400,
      fontSize: 13,
      fontFamily: '"Peyda", sans-serif',
      textTransform: 'lowercase',
      '&::first-letter': {
        textTransform: 'uppercase',
      },
    },
    h4: {
      height: 15,
      margin: '0 0 10px 0',
      padding: 0,
      fontSize: 12,
      fontWeight: 500,
      color: text_color,
      textTransform: 'lowercase',
      '&::first-letter': {
        textTransform: 'uppercase',
      },
    },
    h5: {
      fontWeight: 700,
      fontSize: 16,
      color: text_color,
      fontFamily: '"Peyda", sans-serif',
      textTransform: 'lowercase',
      '&::first-letter': {
        textTransform: 'uppercase',
      },
    },
    h6: {
      fontWeight: 600,
      fontSize: 14,
      color: text_color,
      fontFamily: '"Peyda", sans-serif',
      textTransform: 'lowercase',
      '&::first-letter': {
        textTransform: 'uppercase',
      },
    },
    subtitle2: {
      fontWeight: 400,
      fontSize: 18,
      color: text_color,
      textTransform: 'lowercase',
      '&::first-letter': {
        textTransform: 'uppercase',
      },
    },
  },
  button: {
    sizes: {
      default: {
        height: '36px',
        padding: '8px 16px',
        minWidth: '36px',
        width: '36px',
        fontSize: '14px',
        fontWeight: 600,
        lineHeight: '21px',
        iconSize: '16px',
      },
      small: {
        height: '26px',
        padding: '4px 12px',
        minWidth: '26px',
        width: '26px',
        fontSize: '13px',
        fontWeight: 600,
        lineHeight: '21px',
        iconSize: '14px',
      },
    },
  },
  components: {
    MuiAccordion: {
      defaultProps: {
        slotProps: {
          transition: {
            unmountOnExit: true,
          },
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          [`&.${buttonClasses.outlined}.${buttonClasses.sizeSmall}`]: {
            padding: '4px 9px',
          },
          '&.icon-outlined': {
            borderColor: hexToRGB('#000000', 0.15),
            padding: 7,
            minWidth: 0,
            '&:hover': {
              borderColor: hexToRGB('#000000', 0.15),
              backgroundColor: hexToRGB('#000000', 0.05),
            },
          },
        },
      },
    },
    MuiDialog: {
      styleOverrides: {
        paper: {
          backgroundImage: 'none',
          backgroundColor: paper === THEME_LIGHT_DEFAULT_PAPER
            ? '#FFFFFF'
            : (paper ?? '#FFFFFF'),
          borderRadius: 4,
        },
      },
    },
    MuiDialogTitle: {
      defaultProps: {
        variant: 'h5',
      },
    },
    MuiDialogActions: {
      styleOverrides: {
        root: ({ theme }) => ({
          gap: theme.spacing(1),
          padding: 0,
          marginTop: theme.spacing(4),
          marginLeft: 0,
          '& .MuiButton-root': {
            textTransform: 'none',
          },
          '& > :not(style) ~ :not(style)': {
            marginLeft: 0,
          },
        }),
      },
    },
    MuiToggleButtonGroup: {
      defaultProps: {
        size: 'small',
      },
      styleOverrides: {
        root: {
          height: 36,
          '& .MuiTouchRipple-root': {
            display: 'none',
          },
          '& .MuiToggleButton-root': {
            border: '1px solid #E0E0E0',
            color: primary,

            '&:focus-visible': {
              outline: 'none',
              boxShadow: '0 0 0 2px #66C4F5',
            },

            '&.Mui-selected': {
              backgroundColor: hexToRGB(primary || THEME_LIGHT_DEFAULT_PRIMARY, 0.25),
            },

            '&:hover:not(.Mui-selected)': {
              backgroundColor: hexToRGB(primary || THEME_LIGHT_DEFAULT_PRIMARY, 0.15),
            },
          },
        },
      },
    },
    MuiTooltip: {
      styleOverrides: {
        tooltip: {
          backgroundColor: 'rgba(0,0,0,0.7)',
        },
        arrow: {
          color: 'rgba(0,0,0,0.7)',
        },
        popper: {
          textTransform: 'lowercase',
          '&::first-letter': {
            textTransform: 'uppercase',
          },
        },
      },
    },
    MuiFormControl: {
      defaultProps: {
        variant: 'standard',
      },
      styleOverrides: {
        root: {
          color: text_color,
        },
      },
    },
    MuiTextField: {
      defaultProps: {
        variant: 'standard',
      },
      styleOverrides: {
        root: {
          color: text_color,
          // Shrink = when at the top of the input in small size.
          '& .MuiFormLabel-root:not(.MuiInputLabel-shrink):not(.Mui-error)': {
            color: '#999999',
          },
        },
      },
    },
    MuiSelect: {
      defaultProps: {
        variant: 'standard',
      },
      styleOverrides: {
        root: {
          color: text_color,
          '& fieldset': {
            border: 'none',
          },
        },
        outlined: {
          backgroundColor: paper === THEME_LIGHT_DEFAULT_PAPER
            ? '#FFFFFF'
            : (paper ?? '#FFFFFF'),
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          color: text_color,
        },
      },
    },
    MuiCssBaseline: {
      styleOverrides: {
        html: {
          scrollbarColor: `${accent || THEME_LIGHT_DEFAULT_ACCENT} ${paper || THEME_LIGHT_DEFAULT_PAPER}`,
          scrollbarWidth: 'thin',
          background: `linear-gradient(100deg, ${background || THEME_LIGHT_DEFAULT_BACKGROUND} 0%, ${getAppBodyGradientEndColor(background)} 100%)`,
          backgroundAttachment: 'fixed',
          backgroundColor: background || THEME_LIGHT_DEFAULT_BACKGROUND,
        },
        body: {
          background: `linear-gradient(100deg, ${background || THEME_LIGHT_DEFAULT_BACKGROUND} 0%, ${getAppBodyGradientEndColor(background)} 100%)`,
          backgroundAttachment: 'fixed',
          scrollbarColor: `${accent || THEME_LIGHT_DEFAULT_ACCENT} ${paper || THEME_LIGHT_DEFAULT_PAPER}`,
          scrollbarWidth: 'thin',
          html: {
            WebkitFontSmoothing: 'auto',
          },
          a: {
            color: primary || THEME_LIGHT_DEFAULT_PRIMARY,
          },
          'input:-webkit-autofill': {
            WebkitAnimation: 'autofill 0s forwards',
            animation: 'autofill 0s forwards',
            WebkitTextFillColor: '#000000 !important',
            caretColor: 'transparent !important',
            WebkitBoxShadow:
                '0 0 0 1000px rgba(245, 245, 245, 0.92) inset !important',
            borderTopLeftRadius: 'inherit',
            borderTopRightRadius: 'inherit',
          },
          pre: {
            fontFamily: 'Consolas, monaco, monospace',
            color: `${text_color} !important`,
            background: `${accent || THEME_LIGHT_DEFAULT_ACCENT} !important`,
            borderRadius: 4,
          },
          'pre.light': {
            fontFamily: 'Consolas, monaco, monospace',
            background: `${nav || THEME_LIGHT_DEFAULT_NAV} !important`,
            borderRadius: 4,
          },
          code: {
            fontFamily: 'Consolas, monaco, monospace',
            color: `${text_color} !important`,
            background: `${accent || THEME_LIGHT_DEFAULT_ACCENT} !important`,
            padding: 3,
            fontSize: 12,
            fontWeight: 400,
            borderRadius: 4,
          },
          '.react-mde': {
            border: '0 !important',
          },
          '.error .react-mde textarea': {
            border: '0 !important',
            borderBottom: '2px solid #F20F0F !important',
            '&:hover': {
              border: '0 !important',
              borderBottom: '2px solid #F20F0F !important',
            },
            '&:focus': {
              border: '0 !important',
              borderBottom: '2px solid #F20F0F !important',
            },
          },
          '.mde-header': {
            border: '0 !important',
            backgroundColor: 'transparent !important',
            color: `${text_color} !important`,
          },
          '.mde-header-item button': {
            fontFamily: '"Peyda", sans-serif',
            color: `${text_color} !important`,
          },
          '.mde-tabs button': {
            fontFamily: '"Peyda", sans-serif',
            color: `${text_color} !important`,
          },
          '.mde-textarea-wrapper textarea': {
            fontFamily: '"Peyda", sans-serif',
            fontSize: 13,
            color: `${text_color} !important`,
            background: 'transparent',
            borderBottom: '1px solid rgba(0, 0, 0, 0.87) !important',
            transition: 'borderBottom .3s',
            '&:hover': {
              borderBottom: '2px solid #000000 !important',
            },
            '&:focus': {
              borderBottom: `2px solid ${primary || THEME_LIGHT_DEFAULT_PRIMARY} !important`,
            },
          },
          '.mde-preview .mde-preview-content a': {
            color: `${text_color} !important`,
          },
          '.react-grid-placeholder': {
            backgroundColor: `${accent || THEME_LIGHT_DEFAULT_ACCENT} !important`,
          },
          '.react_time_range__track': {
            backgroundColor: 'rgba(1, 155, 229, 0.1) !important',
            borderLeft: '1px solid #019BE5 !important',
            borderRight: '1px solid #019BE5 !important',
          },
          '.react_time_range__handle_marker': {
            backgroundColor: '#019BE5 !important',
          },
          '.leaflet-container': {
            backgroundColor: `${paper || '#ffffff'} !important`,
          },
          '.react-grid-item .react-resizable-handle::after': {
            borderRight: '2px solid #999999 !important',
            borderBottom: '2px solid #999999 !important',
          },
        },
      },
    },
    MuiTableCell: {
      styleOverrides: {
        head: {
          borderBottom: '1px solid rgba(0, 0, 0, 0.12)',
        },
        body: {
          borderTop: '1px solid rgba(0, 0, 0, 0.12)',
          borderBottom: '1px solid rgba(0, 0, 0, 0.12)',
        },
      },
    },
    MuiMenuItem: {
      styleOverrides: {
        root: {
          ':hover': {
            backgroundColor: 'rgba(0,0,0,0.04)',
          },
          '&.Mui-selected': {
            boxShadow: `2px 0 ${primary || THEME_LIGHT_DEFAULT_PRIMARY} inset`,
            backgroundColor: hexToRGB(primary || THEME_LIGHT_DEFAULT_PRIMARY, 0.12),
          },
          '&.Mui-selected:hover': {
            boxShadow: `2px 0 ${primary || THEME_LIGHT_DEFAULT_PRIMARY} inset`,
            backgroundColor: hexToRGB(primary || THEME_LIGHT_DEFAULT_PRIMARY, 0.16),
          },
        },
      },
    },
    MuiTypography: {
      styleOverrides: {
        root: {
          color: text_color,
          textTransform: 'none',
        },
      },
    },
    MuiInputBase: {
      styleOverrides: {
        root: {
          color: text_color,
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          color: text_color,
          textTransform: 'lowercase',
          '&::first-letter': {
            textTransform: 'uppercase',
          },
        },
        label: {
          textTransform: 'lowercase',
          '&::first-letter': {
            textTransform: 'uppercase',
          },
        },
      },
    },
    MuiTab: {
      styleOverrides: {
        root: {
          textTransform: 'lowercase',
          display: 'inline-block',
          '&::first-letter': {
            textTransform: 'uppercase',
          },
        },
      },
    },
    MuiFab: {
      styleOverrides: {
        root: {
          textTransform: 'none',
        },
      },
    },
    MuiAutocomplete: {
      styleOverrides: {
        root: {
          // Shrink = when at the top of the input in small size.
          '& .MuiFormLabel-root:not(.MuiInputLabel-shrink):not(.Mui-error)': {
            color: '#999999',
          },
          '& .MuiOutlinedInput-root': {
            // the only way for now to know if we should apply the paper color or not
            backgroundColor: paper === THEME_LIGHT_DEFAULT_PAPER
              ? '#FFFFFF'
              : (paper ?? '#FFFFFF'),
            '& fieldset': {
              borderColor: 'transparent',
            },
          },
        },
      },
    },
  },
});

export default ThemeLight;
