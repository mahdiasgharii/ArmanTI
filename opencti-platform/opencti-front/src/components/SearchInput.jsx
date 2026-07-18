import React, { useEffect, useState, useCallback } from 'react';
import TextField from '@mui/material/TextField';
import InputAdornment from '@mui/material/InputAdornment';
import { SearchCheck as ManageSearchOutlined, Search, SlidersHorizontal as TuneOutlined, ChevronDown as KeyboardArrowDownOutlined } from 'lucide-react';
import { LogoXtmOneIcon } from 'filigran-icon';
import { useNavigate } from 'react-router-dom';
import makeStyles from '@mui/styles/makeStyles';
import Tooltip from '@mui/material/Tooltip';
import { useTheme } from '@mui/styles';
import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import ListItemText from '@mui/material/ListItemText';
import ListItemIcon from '@mui/material/ListItemIcon';
import CircularProgress from '@mui/material/CircularProgress';
import Stack from '@mui/material/Stack';
import Box from '@mui/material/Box';
import useEnterpriseEdition from '../utils/hooks/useEnterpriseEdition';
import { useFormatter } from './i18n';
import useGranted, { SETTINGS_SETPARAMETERS } from '../utils/hooks/useGranted';
import useAuth from '../utils/hooks/useAuth';
import FiligranIcon from '../private/components/common/FiligranIcon';
import EnterpriseEditionAgreement from '../private/components/common/entreprise_edition/EnterpriseEditionAgreement';
import ValidateTermsOfUseDialog from '../private/components/settings/ValidateTermsOfUseDialog';
import FeedbackCreation from '../private/components/cases/feedbacks/FeedbackCreation';
import Loader from './Loader';
import useAI from '../utils/hooks/useAI';
import { fetchAgentsForIntent } from '../utils/ai/agentApi';
import { NLQ_INTENT } from '../private/components/common/ai/AINLQ';
import { useChatbot } from '../private/components/chatbox/ChatbotContext';

// Deprecated - https://mui.com/system/styles/basics/
// Do not use it for new code.
const useStyles = makeStyles((theme) => ({
  searchRoot: {
    borderRadius: 4,
    padding: '0 10px 0 10px',
  },
  searchRootTopBar: {
    borderRadius: '4px',
    padding: '0 12px 0 12px',
    marginRight: 0,
    width: '100%',
    backgroundColor: 'var(--ravin-elevated)',
    '& .MuiInputBase-input': {
      fontSize: '0.875rem',
    },
  },
  searchRootInDrawer: {
    borderRadius: 4,
    width: '100%',
    minWidth: 100,
    maxWidth: '255px',
  },
  searchRootThin: {
    borderRadius: 4,
    padding: '0 10px 0 10px',
    height: 30,
  },
  searchRootNoAnimation: {
    borderRadius: 4,
    padding: '0 10px 0 10px',
    backgroundColor: theme.palette.background.default,
  },
  searchInputTopBar: {
    width: '100%',
  },
  searchInputInDrawer: {
    width: '100%',
  },
  searchInput: {
    transition: theme.transitions.create('width'),
    width: 200,
    '&:focus': {
      width: 350,
    },
  },
  searchInputSmall: {
    transition: theme.transitions.create('width'),
    width: 150,
    '&:focus': {
      width: 250,
    },
  },
}));

export function GradientBorderTextField({
  isActive,
  ...props
}) {
  const theme = useTheme();

  return (
    <TextField
      {...props}
      variant="outlined"
      sx={{
        '& .MuiInputBase-input::placeholder': {
          opacity: 1,
          color: 'var(--ravin-text-muted)',
        },
        '& .MuiOutlinedInput-root': {
          position: 'relative',
          borderRadius: '4px',
          borderWidth: '1px',
          backgroundColor: 'var(--ravin-elevated)',
          '& input': {
            height: '19px',
            boxSizing: 'content-box',
          },

          '& fieldset': {
            borderColor: 'var(--ravin-border)',
          },

          '&.Mui-focused fieldset': {
            borderColor: 'var(--ravin-primary)',
            borderWidth: '1px',
          },

          '&:hover fieldset': {
            borderColor: 'var(--ravin-border-strong)',
          },

          '&.Mui-focused:not(:hover) fieldset': {
            borderWidth: '1px',
          },

          ...(isActive && {
            '&.Mui-focused:not(:hover) fieldset': {
              // prevent showing the default border when ai mode on and mouse out
              border: `1px solid ${theme.palette.ai.dark}`,
            },

            '&::before': {
              content: '""',
              position: 'absolute',
              inset: 0,
              borderRadius: 'inherit',
              padding: '1px',
              background: `linear-gradient(
                90deg,
                ${theme.palette.ai?.light},
                ${theme.palette.ai?.dark}
              )`,
              WebkitMask:
                'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
              maskComposite: 'exclude',
              pointerEvents: 'none',
              opacity: 0.8,
            },

            '&:hover fieldset': {
              border: `1px solid ${theme.palette.ai.dark}`,
            },
          }),
        },
      }}
    />
  );
}

// ── Mode constants ─────────────────────────────────────────────────────────
const MODE_SEARCH = 'search';
const MODE_BULK = 'bulk';
// NLQ modes are dynamic: `nlq:<agentSlug>`
const isNlqMode = (mode) => typeof mode === 'string' && mode.startsWith('nlq:');
const nlqSlugFromMode = (mode) => (isNlqMode(mode) ? mode.slice(4) : null);

const SearchInput = (props) => {
  const classes = useStyles();
  const navigate = useNavigate();
  const isEnterpriseEdition = useEnterpriseEdition();
  const { enabled, configured, fullyActive } = useAI();
  const { xtmOneConfigured } = useChatbot();
  const useXtmOne = xtmOneConfigured === true;
  const theme = useTheme();
  const { t_i18n } = useFormatter();
  const {
    onSubmit,
    variant,
    keyword,
    placeholder = `${t_i18n('Search these results')}...`,
    isNLQLoading,
    ...otherProps
  } = props;
  const [displayEEDialog, setDisplayEEDialog] = useState(false);
  const [displayCGUDialog, setDisplayCGUDialog] = useState(false);
  const [searchValue, setSearchValue] = useState(keyword);

  // Current mode: 'search', 'bulk', or 'nlq:<slug>'
  const [mode, setMode] = useState(MODE_SEARCH);

  // NLQ agent menu state (for the dropdown arrow on the NLQ toggle)
  const [nlqMenuAnchor, setNlqMenuAnchor] = useState(null);
  const [nlqAgents, setNlqAgents] = useState([]);
  const [nlqAgentsLoading, setNlqAgentsLoading] = useState(false);
  const [nlqAgentsFetched, setNlqAgentsFetched] = useState(false);
  // Track the default agent slug so clicking NLQ toggle auto-selects it
  const [defaultNlqSlug, setDefaultNlqSlug] = useState(null);

  useEffect(() => {
    // Don't sync when in bulk mode: navigating to /search_bulk clears the URL
    // keyword, but we want to keep the user's typed value in the input.
    if (mode !== MODE_BULK && keyword !== searchValue) {
      setSearchValue(keyword);
    }
  }, [keyword]);

  const isAIEnabled = variant === 'topBar' && isEnterpriseEdition && enabled && configured;
  const isNLQActivated = isAIEnabled && isNlqMode(mode);
  const isAdmin = useGranted([SETTINGS_SETPARAMETERS]);
  const { settings: { id: settingsId } } = useAuth();

  // Derive selected agent from mode
  const selectedAgentSlug = nlqSlugFromMode(mode);
  const selectedAgent = nlqAgents.find((a) => a.slug === selectedAgentSlug) ?? null;

  let classRoot = classes.searchRoot;
  if (variant === 'inDrawer') {
    classRoot = classes.searchRootInDrawer;
  } else if (variant === 'noAnimation') {
    classRoot = classes.searchRootNoAnimation;
  } else if (variant === 'topBar') {
    classRoot = classes.searchRootTopBar;
  } else if (variant === 'thin') {
    classRoot = classes.searchRootThin;
  }
  let classInput = classes.searchInput;
  if (variant === 'small' || variant === 'thin') {
    classInput = classes.searchInputSmall;
  } else if (variant === 'topBar') {
    classInput = classes.searchInputTopBar;
  } else if (variant === 'noAnimation') {
    classInput = classes.searchInputNoAnimation;
  } else if (variant === 'inDrawer') {
    classInput = classes.searchInputInDrawer;
  }

  // ── Fetch NLQ agents eagerly on mount when AI is available ──────────────
  const fetchNlqAgentsIfNeeded = useCallback(() => {
    if (!nlqAgentsFetched && !nlqAgentsLoading) {
      setNlqAgentsLoading(true);
      fetchAgentsForIntent(NLQ_INTENT).then((agents) => {
        setNlqAgents(agents);
        setNlqAgentsFetched(true);
        setNlqAgentsLoading(false);
        if (agents.length > 0) {
          setDefaultNlqSlug(agents[0].slug);
        }
      });
    }
  }, [nlqAgentsFetched, nlqAgentsLoading]);

  // Eagerly fetch NLQ agents so the default is ready when the user clicks the toggle
  // Only fetch when XTM One is configured — legacy mode doesn't use agents
  useEffect(() => {
    if (isAIEnabled && fullyActive && useXtmOne) {
      fetchNlqAgentsIfNeeded();
    }
  }, [isAIEnabled, fullyActive, useXtmOne]);

  const handleOpenNlqMenu = useCallback((event) => {
    setNlqMenuAnchor(event.currentTarget);
    fetchNlqAgentsIfNeeded();
  }, [fetchNlqAgentsIfNeeded]);

  const handleCloseNlqMenu = () => {
    setNlqMenuAnchor(null);
  };

  const handleSelectAgent = (agent) => {
    setMode(`nlq:${agent.slug}`);
    handleCloseNlqMenu();
    // Execute NLQ search immediately with the selected agent
    if (searchValue && typeof onSubmit === 'function') {
      onSubmit(searchValue, true, agent.slug);
    }
  };

  // Click on the NLQ toggle: activate NLQ and execute search if there's a value
  const handleNlqToggleClick = useCallback((event) => {
    if (!isAIEnabled) return;
    const isCGUStatusPending = useXtmOne && !fullyActive;
    if (isCGUStatusPending) {
      setDisplayCGUDialog(true);
      return;
    }
    if (isNlqMode(mode)) {
      // Already in NLQ mode — do nothing (user switches away via Search/Bulk toggles)
      return;
    }
    let agentSlug;
    if (useXtmOne && defaultNlqSlug) {
      // XTM One mode — activate with the default agent
      setMode(`nlq:${defaultNlqSlug}`);
      agentSlug = defaultNlqSlug;
    } else if (useXtmOne) {
      // XTM One but agents not loaded yet — open the menu as fallback
      handleOpenNlqMenu(event);
      return;
    } else {
      // Legacy mode — activate NLQ without an agent
      setMode('nlq:');
    }
    // Execute NLQ search immediately if there's a value
    if (searchValue && typeof onSubmit === 'function') {
      onSubmit(searchValue, true, agentSlug || undefined);
    }
  }, [isAIEnabled, mode, useXtmOne, defaultNlqSlug, handleOpenNlqMenu, searchValue, onSubmit]);

  // ── Mode change handler ────────────────────────────────────────────────
  const handleModeChange = (_event, newMode) => {
    if (newMode === null) return; // MUI sends null when clicking the already-selected button
    if (newMode === MODE_SEARCH) {
      setMode(newMode);
      // Execute search immediately with current value
      if (searchValue && typeof onSubmit === 'function') {
        onSubmit(searchValue, false, undefined);
      }
    } else if (newMode === MODE_BULK) {
      setMode(newMode);
      // Navigate to bulk with current value
      const encoded = encodeURIComponent(searchValue || '');
      navigate(`/dashboard/search_bulk${searchValue ? `?q=${encoded}` : ''}`);
    }
    // NLQ is handled via handleNlqToggleClick, not the toggle group
  };

  // ── Compute placeholder ────────────────────────────────────────────────
  const getPlaceholder = () => {
    if (isNLQActivated) {
      return selectedAgent
        ? `${t_i18n('Ask your question')} - ${selectedAgent.name}`
        : `${t_i18n('Ask your question')}...`;
    }
    if (mode === MODE_BULK) {
      return `${t_i18n('One keyword by line or separated by commas')}...`;
    }
    return placeholder;
  };

  // ── Submit handler ─────────────────────────────────────────────────────
  const handleKeyDown = (event) => {
    const { value } = event.target;
    if (typeof onSubmit === 'function' && event.key === 'Enter') {
      if (mode === MODE_BULK) {
        // Navigate to bulk search page with the keyword as a query param
        const encoded = encodeURIComponent(value);
        navigate(`/dashboard/search_bulk${value ? `?q=${encoded}` : ''}`);
      } else {
        // Pass agentSlug only if it's a non-empty string (XTM One mode),
        // otherwise pass undefined so AINLQ falls back to legacy
        onSubmit(value, isNLQActivated, selectedAgentSlug || undefined);
      }
    }
  };

  // ── Non-topBar variant: keep the simple input ──────────────────────────
  if (variant !== 'topBar') {
    return (
      <>
        <GradientBorderTextField
          name="keyword"
          value={searchValue}
          variant="outlined"
          size="small"
          placeholder={placeholder}
          onChange={(event) => {
            const { value } = event.target;
            setSearchValue(value);
          }}
          onKeyDown={(event) => {
            const { value } = event.target;
            if (typeof onSubmit === 'function' && event.key === 'Enter') {
              onSubmit(value);
            }
          }}
          isActive={false}
          sx={{
            '& .MuiInputBase-input::placeholder': {
              opacity: 1,
              color: 'var(--ravin-text-muted)',
              fontSize: '13px',
            },
            '& .MuiInputBase-input': {
              fontFamily: '"Peyda", sans-serif',
              fontSize: '13px',
              color: 'var(--ravin-text)',
            },
          }}
          slotProps={{
            input: {
              startAdornment: (
                <Search size={16} style={{ marginRight: 2, color: 'var(--ravin-text-muted)' }} />
              ),
              classes: {
                root: classRoot,
                input: classInput,
              },
            },
          }}
          {...otherProps}
          autoComplete="off"
        />
      </>
    );
  }

  // ── TopBar variant: unified command-palette search bar ────────────────

  const isCGUStatusPending = useXtmOne && !fullyActive;
  const nlqNoAgentAvailable = useXtmOne && nlqAgentsFetched && nlqAgents.length === 0;
  const aiColor = theme.palette.ai?.main;

  // Internal toggle button styles — no individual borders, rely on container
  const toggleBtnSx = {
    height: 30,
    minWidth: 30,
    width: 30,
    px: 0,
    py: 0,
    borderRadius: '4px',
    border: 'none',
    color: 'var(--ravin-text-muted)',
    transition: 'background-color 150ms ease, color 150ms ease',
    '&:hover': {
      color: 'var(--ravin-text)',
      backgroundColor: 'var(--ravin-surface-2)',
    },
    '&.Mui-selected': {
      color: 'var(--ravin-text)',
      backgroundColor: 'var(--ravin-surface-2)',
      '&:hover': {
        backgroundColor: 'var(--ravin-surface-2)',
      },
    },
  };

  const nlqToggleSx = {
    ...toggleBtnSx,
    width: 'auto',
    minWidth: 30,
    px: 0.75,
    color: `${aiColor} !important`,
    '&.Mui-selected': {
      backgroundColor: aiColor ? `${aiColor}1A` : undefined,
      color: `${aiColor} !important`,
      '&:hover': {
        backgroundColor: aiColor ? `${aiColor}26` : undefined,
      },
    },
    '&:hover': {
      backgroundColor: aiColor ? `${aiColor}12` : undefined,
    },
    ...(isNLQActivated && {
      backgroundColor: aiColor ? `${aiColor}14` : undefined,
    }),
    '&.Mui-disabled': {
      color: `${aiColor} !important`,
      opacity: 0.5,
    },
  };

  // Container styles: unified pill with shared border and focus state
  const containerSx = {
    display: 'flex',
    alignItems: 'center',
    width: '50%',
    minWidth: 480,
    maxWidth: 640,
    height: 38,
    borderRadius: '6px',
    backgroundColor: 'var(--ravin-elevated)',
    border: '1px solid var(--ravin-border)',
    transition: 'border-color 200ms ease, box-shadow 200ms ease',
    '&:hover': {
      borderColor: 'var(--ravin-border-strong)',
    },
    '&:focus-within': {
      borderColor: 'var(--ravin-primary)',
      boxShadow: '0 0 0 1px var(--ravin-primary)',
    },
    ...(isNLQActivated && aiColor && {
      borderColor: aiColor,
      '&:focus-within': {
        borderColor: aiColor,
        boxShadow: `0 0 0 1px ${aiColor}`,
      },
      '&::before': {
        content: '""',
        position: 'absolute',
        inset: -1,
        borderRadius: 'inherit',
        padding: 1,
        background: `linear-gradient(90deg, ${theme.palette.ai?.light}, ${theme.palette.ai?.dark})`,
        WebkitMask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
        maskComposite: 'exclude',
        pointerEvents: 'none',
        opacity: 0.7,
      },
    }),
    position: 'relative',
  };

  return (
    <>
      <Box sx={containerSx}>
        {/* ── Search Input (fills remaining space) ─────────────────── */}
        <TextField
          name="keyword"
          value={searchValue}
          variant="outlined"
          size="small"
          fullWidth
          placeholder={getPlaceholder()}
          onChange={(event) => {
            const { value } = event.target;
            setSearchValue(value);
          }}
          onKeyDown={handleKeyDown}
          {...otherProps}
          autoComplete="off"
          sx={{
            flex: 1,
            '& .MuiOutlinedInput-root': {
              borderRadius: '6px 0 0 6px',
              backgroundColor: 'transparent',
              height: 36,
              '& fieldset': { border: 'none' },
              '&:hover fieldset': { border: 'none' },
              '&.Mui-focused fieldset': { border: 'none' },
              '& input': {
                padding: '0 8px 0 0',
                height: 36,
                boxSizing: 'border-box',
                fontSize: '0.875rem',
                fontFamily: '"Peyda", sans-serif',
                color: 'var(--ravin-text)',
              },
              '& .MuiInputBase-input::placeholder': {
                opacity: 1,
                color: 'var(--ravin-text-muted)',
                fontSize: '0.875rem',
              },
            },
          }}
          slotProps={{
            input: {
              startAdornment: (
                <Search
                  size={16}
                  style={{
                    color: isNLQActivated ? theme.palette.ai.main : 'var(--ravin-text-muted)',
                    margin: '0 6px 0 10px',
                    flexShrink: 0,
                  }}
                />
              ),
              endAdornment: isNLQActivated && isNLQLoading ? (
                <InputAdornment position="end" sx={{ mr: 0.5 }}>
                  <Loader variant="inline" />
                </InputAdornment>
              ) : null,
            },
          }}
        />

        {/* ── Divider between input and toggles ────────────────────── */}
        <Box
          sx={{
            width: '1px',
            height: 22,
            backgroundColor: 'var(--ravin-border)',
            flexShrink: 0,
            mx: 0.5,
          }}
        />

        {/* ── Mode Toggles (right side, no individual borders) ─────── */}
        <ToggleButtonGroup
          value={mode}
          exclusive
          onChange={handleModeChange}
          size="small"
          sx={{
            display: 'flex',
            alignItems: 'center',
            gap: 0.5,
            pr: 0.5,
            flexShrink: 0,
            '& .MuiToggleButtonGroup-grouped': {
              border: 'none',
              borderRadius: '4px !important',
              '&:not(:first-of-type)': {
                marginLeft: 0,
              },
            },
          }}
        >
          <Tooltip title={t_i18n('Advanced search')}>
            <ToggleButton value={MODE_SEARCH} sx={toggleBtnSx}>
              <TuneOutlined size={16} />
            </ToggleButton>
          </Tooltip>

          <Tooltip title={t_i18n('Bulk search')}>
            <ToggleButton value={MODE_BULK} sx={toggleBtnSx}>
              <ManageSearchOutlined size={16} />
            </ToggleButton>
          </Tooltip>

          {isAIEnabled && (
            <Tooltip
              title={(isCGUStatusPending && !isAdmin)
                ? t_i18n('Ask Ariane isn\'t activated yet. Please reach out to your administrator to enable this feature.')
                : nlqNoAgentAvailable
                  ? t_i18n('No agent available for this action. Ask your administrator to configure XTM One.')
                  : isNLQActivated && selectedAgent
                    ? `${t_i18n('Ask AI')}: ${selectedAgent.name}${selectedAgent.description ? ` — ${selectedAgent.description}` : ''}`
                    : t_i18n('Ask AI')}
            >
              <span>
                <ToggleButton
                  value={mode}
                  selected={isNLQActivated}
                  sx={nlqToggleSx}
                  onClick={handleNlqToggleClick}
                  disabled={nlqNoAgentAvailable || (isCGUStatusPending && !isAdmin)}
                >
                  <Stack direction="row" alignItems="center" spacing={0}>
                    <FiligranIcon
                      icon={LogoXtmOneIcon}
                      size="small"
                      color="ai"
                    />
                    {useXtmOne && nlqAgents.length > 0 && (
                      <Box
                        component="span"
                        sx={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          ml: 0.25,
                          pl: 0.25,
                          borderLeft: `1px solid ${isNLQActivated ? theme.palette.ai?.main + '40' : 'var(--ravin-border)'}`,
                          cursor: 'pointer',
                        }}
                        onClick={(e) => {
                          e.stopPropagation();
                          handleOpenNlqMenu(e);
                        }}
                      >
                        <KeyboardArrowDownOutlined size={14} style={{ color: 'inherit' }} />
                      </Box>
                    )}
                  </Stack>
                </ToggleButton>
              </span>
            </Tooltip>
          )}
        </ToggleButtonGroup>

        {/* ── NLQ Agent dropdown menu ─────────────────────────────── */}
        <Menu
          anchorEl={nlqMenuAnchor}
          open={Boolean(nlqMenuAnchor)}
          onClose={handleCloseNlqMenu}
          slotProps={{
            paper: {
              sx: {
                minWidth: 240,
                maxWidth: 360,
              },
            },
          }}
        >
          {nlqAgentsLoading && (
            <MenuItem disabled>
              <ListItemIcon>
                <CircularProgress size={18} />
              </ListItemIcon>
            </MenuItem>
          )}
          {!nlqAgentsLoading && nlqAgents.length === 0 && nlqAgentsFetched && (
            <MenuItem disabled>
              <ListItemText
                primary={t_i18n('No agent available')}
                secondary={t_i18n('No agent available for this action. Ask your administrator to configure XTM One.')}
                slotProps={{ secondary: { sx: { whiteSpace: 'normal' } } }}
              />
            </MenuItem>
          )}
          {!nlqAgentsLoading && nlqAgents.map((agent) => (
            <MenuItem
              key={agent.id}
              onClick={() => handleSelectAgent(agent)}
              selected={selectedAgentSlug === agent.slug}
            >
              <ListItemIcon>
                <FiligranIcon
                  icon={LogoXtmOneIcon}
                  size="small"
                  color="ai"
                />
              </ListItemIcon>
              <ListItemText
                primary={agent.name}
                secondary={agent.description}
                slotProps={{
                  secondary: {
                    sx: {
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap',
                    },
                  },
                }}
              />
            </MenuItem>
          ))}
        </Menu>
      </Box>

      {isAdmin ? (
        <EnterpriseEditionAgreement
          open={displayEEDialog}
          onClose={() => setDisplayEEDialog(false)}
          settingsId={settingsId}
        />
      ) : (
        <FeedbackCreation
          openDrawer={displayEEDialog}
          handleCloseDrawer={() => setDisplayEEDialog(false)}
          initialValue={{
            description: t_i18n('To use this AI feature in the enterprise edition, please add a token.'),
          }}
        />
      )}

      {displayCGUDialog && (
        <ValidateTermsOfUseDialog open={displayCGUDialog} onClose={() => setDisplayCGUDialog(false)} />
      )}
    </>
  );
};

export default SearchInput;
