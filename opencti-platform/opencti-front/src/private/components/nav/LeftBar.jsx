import {
  Landmark as AccountBalanceOutlined,
  Compass as ArchitectureOutlined,
  ClipboardList as AssignmentOutlined,
  Microscope as BiotechOutlined,
  Bug as BugReportOutlined,
  Briefcase as CasesOutlined,
  ChevronLeft,
  HardHat as ConstructionOutlined,
  Trash2 as DeleteOutlined,
  FileText as DescriptionOutlined,
  Diamond as DiamondOutlined,
  Building2 as DomainOutlined,
  Calendar as EventOutlined,
  Compass as ExploreOutlined,
  Flag as FlagOutlined,
  House as Home,
  BarChart3 as InsertChartOutlinedOutlined,
  Layers as LayersOutlined,
  Tag as LocalOfferOutlined,
  Map as MapOutlined,
  User as PersonOutlined,
  MapPin as PlaceOutlined,
  Globe as PublicOutlined,
  Shield as SecurityOutlined,
  SquareMousePointer as SourceOutlined,
  MessageSquare as SpeakerNotesOutlined,
  Database as StorageOutlined,
  Waves as StreamOutlined,
  FileText as SubjectOutlined,
  Speaker as SurroundSoundOutlined,
  CircleCheck as TaskAltOutlined,
  Target as TrackChanges,
  Eye as VisibilityOutlined,
  AppWindow as WebAssetOutlined,
  Wifi as WifiTetheringOutlined,
  Workflow as WorkspacesOutlined,
} from 'lucide-react';
import Divider from '@mui/material/Divider';
import Drawer from '@mui/material/Drawer';
import MenuList from '@mui/material/MenuList';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { createStyles, makeStyles, useTheme } from '@mui/styles';
import {
  AccountMultipleOutline,
  ArchiveOutline,
  Binoculars,
  Biohazard,
  BriefcaseEditOutline,
  BriefcaseEyeOutline,
  BriefcaseRemoveOutline,
  BriefcaseSearchOutline,
  ChessKnight,
  ChevronRight,
  CityVariantOutline,
  CogOutline,
  Database,
  Fire,
  FlaskOutline,
  FolderTableOutline,
  GlobeModel,
  HexagonOutline,
  LaptopAccount,
  LockPattern,
  ProgressWrench,
  ServerNetwork,
  ShieldSearch,
  Timetable,
} from 'mdi-material-ui';
import React, { useRef, useState } from 'react';
import { graphql, usePreloadedQuery } from 'react-relay';
import { useNavigate } from 'react-router-dom';
import { useFormatter } from '../../../components/i18n';
import { MESSAGING$ } from '../../../relay/environment';
import logoFiligranDark from '../../../static/images/logo_filigran_full.svg';
import logoFiligranLight from '../../../static/images/logo_filigran_full_light.svg';
import Security from '../../../utils/Security';
import useAuth from '../../../utils/hooks/useAuth';
import useDimensions from '../../../utils/hooks/useDimensions';
import { useHiddenEntities, useIsHiddenEntities } from '../../../utils/hooks/useEntitySettings';
import useGranted, {
  AUTOMATION_AUTMANAGE,
  BYPASS,
  CSVMAPPERS,
  EXPLORE,
  INGESTION,
  INGESTION_SETINGESTIONS,
  INVESTIGATION,
  KNOWLEDGE,
  KNOWLEDGE_KNASKIMPORT,
  KNOWLEDGE_KNUPDATE,
  KNOWLEDGE_KNUPDATE_KNDELETE,
  MODULES,
  PIRAPI,
  SETTINGS_FILEINDEXING,
  SETTINGS_SECURITYACTIVITY,
  SETTINGS_SETACCESSES,
  SETTINGS_SETAUTH,
  SETTINGS_SETCASETEMPLATES,
  SETTINGS_SETCUSTOMIZATION,
  SETTINGS_SETDISSEMINATION,
  SETTINGS_SETKILLCHAINPHASES,
  SETTINGS_SETLABELS,
  SETTINGS_SETMANAGEXTMHUB,
  SETTINGS_SETMARKINGS,
  SETTINGS_SETPARAMETERS,
  SETTINGS_SETSTATUSTEMPLATES,
  SETTINGS_SETVOCABULARIES,
  SETTINGS_SUPPORT,
  TAXIIAPI,
  VIRTUAL_ORGANIZATION_ADMIN,
} from '../../../utils/hooks/useGranted';
import useHelper from '../../../utils/hooks/useHelper';
import useImportAccess from '../../../utils/hooks/useImportAccess';
import useQueryLoading from '../../../utils/hooks/useQueryLoading';
import { useSettingsMessagesBannerHeight } from '../settings/settings_messages/SettingsMessagesBanner';
import useTopBanner from '../../../utils/hooks/useTopBanner';
import { LeftBarHeader } from './LeftBarHeader';
import LeftBarItem from './LeftBarItem';
import LogoTextOrange from '../../../static/images/logo_text_orange.svg';
import LogoCollapsedOrange from '../../../static/images/logo_orange.svg';
import { shouldOpenInNewTabMouseEvent } from 'src/utils/domEvent';

export const SMALL_BAR_WIDTH = 56;
export const OPEN_BAR_WIDTH = 256;

// Deprecated - https://mui.com/system/styles/basics/
// Do not use it for new code.
const useStyles = makeStyles((theme) => createStyles({
  drawerPaper: {
    width: SMALL_BAR_WIDTH + 16,
    minHeight: '100vh',
    overflowX: 'hidden',
  },
  drawerPaperOpen: {
    width: OPEN_BAR_WIDTH + 16,
    minHeight: '100vh',
    overflowX: 'hidden',
  },
  menuItemIcon: {
    color: 'var(--ravin-text)',
  },
  menuItem: {
    paddingRight: 2,
    height: 35,
    fontWeight: 500,
    fontSize: 14,
  },
  menuHoverItem: {
    height: 35,
    fontWeight: 500,
    fontSize: 14,
  },
  menuSubItem: {
    height: 25,
    fontWeight: 500,
    fontSize: 12,
  },
  menuItemText: {
    padding: '1px 0 0 8px',
    fontWeight: 500,
    fontSize: 14,
  },
  menuSubItemText: {
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    padding: '1px 0 0 8px',
    fontWeight: 500,
    fontSize: 12,
  },
  menuSubItemTextWithoutIcon: {
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    padding: '1px 0 0 0px',
    fontWeight: 500,
    fontSize: 12,
  },
  menuCollapseOpen: {
    width: OPEN_BAR_WIDTH,
    height: 35,
    fontWeight: 500,
    fontSize: 14,
  },
  menuCollapse: {
    width: SMALL_BAR_WIDTH,
    height: 35,
    fontWeight: 500,
    fontSize: 14,
  },
  menuLogoOpen: {
    width: OPEN_BAR_WIDTH,
    height: 35,
    fontWeight: 500,
    fontSize: 14,
  },
  menuLogo: {
    width: SMALL_BAR_WIDTH,
    height: 35,
    fontWeight: 500,
    fontSize: 14,
  },
  menuItemSmallText: {
    padding: '1px 0 0 20px',
  },
}));

const leftBarQuery = graphql`
  query LeftBarQuery {
    settings {
      platform_whitemark
    }
  }
`;

const Separator = () => {
  return (
    <Divider sx={{ border: 'none', borderTop: '1px solid var(--ravin-border)', mx: 2, my: 1 }} />
  );
};

const GroupLabel = ({ navOpen, children }) => {
  if (!navOpen) return null;
  return (
    <Typography
      sx={{
        px: 3,
        pt: 2,
        pb: 0.5,
        fontSize: '11px',
        fontWeight: 600,
        fontFamily: 'Peyda, sans-serif',
        color: 'var(--ravin-text-muted)',
        textTransform: 'lowercase',
        '&::first-letter': { textTransform: 'uppercase' },
        letterSpacing: '0.02em',
      }}
    >
      {children}
    </Typography>
  );
};

const LeftBarComponent = ({ queryRef }) => {
  const theme = useTheme();
  const ref = useRef();
  const { t_i18n } = useFormatter();
  const {
    me: { submenu_auto_collapse, submenu_show_icons, draftContext },
  } = useAuth();
  const navigate = useNavigate();
  const { hasOnlyAccessToImportDraftTab } = useImportAccess();
  const isGrantedToKnowledge = useGranted([KNOWLEDGE]);
  const isGrantedToImport = useGranted([KNOWLEDGE_KNASKIMPORT]) || hasOnlyAccessToImportDraftTab;
  const isGrantedToProcessing = useGranted([KNOWLEDGE_KNUPDATE, AUTOMATION_AUTMANAGE, CSVMAPPERS]);
  const isGrantedToSharing = useGranted([TAXIIAPI]);
  const isGrantedToManage = useGranted([BYPASS]);
  const isGrantedToParameters = useGranted([SETTINGS_SETPARAMETERS]);
  const isGrantedToLabels = useGranted([SETTINGS_SETLABELS]);
  const isGrantedToVocabularies = useGranted([SETTINGS_SETVOCABULARIES]);
  const isGrantedToKillChainPhases = useGranted([SETTINGS_SETKILLCHAINPHASES]);
  const isGrantedToCaseTemplates = useGranted([SETTINGS_SETCASETEMPLATES]);
  const isGrantedToStatusTemplates = useGranted([SETTINGS_SETSTATUSTEMPLATES]);
  const isGrantedToTaxonomies = isGrantedToLabels || isGrantedToVocabularies || isGrantedToKillChainPhases || isGrantedToCaseTemplates || isGrantedToStatusTemplates;
  const isGrantedToFileIndexing = useGranted([SETTINGS_FILEINDEXING]);
  const isGrantedToExperience = useGranted([SETTINGS_SETPARAMETERS, SETTINGS_SUPPORT, SETTINGS_SETMANAGEXTMHUB]);
  const isGrantedToIngestion = useGranted([MODULES, INGESTION, INGESTION_SETINGESTIONS]);
  const isOrganizationAdmin = useGranted([VIRTUAL_ORGANIZATION_ADMIN]);
  const isGrantedToCustomization = useGranted([SETTINGS_SETCUSTOMIZATION]);
  const isGrantedToSecurity = useGranted([SETTINGS_SETMARKINGS, SETTINGS_SETACCESSES, SETTINGS_SETDISSEMINATION, SETTINGS_SETAUTH]);
  const isGrantedToAudit = useGranted([SETTINGS_SECURITYACTIVITY]);
  const isGrantedToExplore = useGranted([EXPLORE]);
  const hasXtmHubAccess = useGranted([SETTINGS_SETMANAGEXTMHUB]);

  const [selectedMenu, setSelectedMenu] = useState(
    JSON.parse(localStorage.getItem('selectedMenu') ?? '[]'),
  );
  const [navOpen, setNavOpen] = useState(
    localStorage.getItem('navOpen') === 'true',
  );
  const classes = useStyles({ navOpen });

  const data = usePreloadedQuery(leftBarQuery, queryRef);

  const navOpenLogo = draftContext ? LogoTextOrange : theme.logo;
  const navCloseLogo = draftContext ? LogoCollapsedOrange : theme.logo_collapsed;
  let logo = navOpen ? navOpenLogo : navCloseLogo;

  const addMenuUnique = (menu) => {
    const joined = selectedMenu.concat(menu);
    return joined.filter((value, index, array) => array.indexOf(value) === index);
  };
  const removeMenuUnique = (menu) => {
    return selectedMenu.filter((value) => value !== menu);
  };
  const handleToggle = () => {
    setSelectedMenu([]);
    localStorage.setItem('navOpen', String(!navOpen));
    window.dispatchEvent(new StorageEvent('storage', { key: 'navOpen' }));
    localStorage.setItem('selectedMenu', JSON.stringify([]));
    setNavOpen(!navOpen);
    MESSAGING$.toggleNav.next('toggle');
  };
  const handleSelectedMenuOpen = (menu) => {
    const updatedMenu = (navOpen && submenu_auto_collapse) ? addMenuUnique(menu) : [menu];
    setSelectedMenu(updatedMenu);
  };
  const handleSelectedMenuClose = () => {
    setSelectedMenu([]);
  };
  const handleSelectedMenuToggle = (menu) => {
    let updatedMenu;
    if (submenu_auto_collapse) {
      updatedMenu = selectedMenu.includes(menu) ? [] : [menu];
      setSelectedMenu(updatedMenu);
    } else {
      updatedMenu = selectedMenu.includes(menu)
        ? removeMenuUnique(menu)
        : addMenuUnique(menu);
      setSelectedMenu(updatedMenu);
    }
    localStorage.setItem('selectedMenu', JSON.stringify(updatedMenu));
  };
  const handleGoToPage = (event, link) => {
    if (shouldOpenInNewTabMouseEvent(event)) {
      window.open(link, '_blank');
    } else {
      navigate(link);
    }
  };
  const hiddenEntities = useHiddenEntities();
  const hideAnalyses = useIsHiddenEntities(
    'Report',
    'Grouping',
    'Note',
    'Malware-Analysis',
    'Security-Coverage',
  );
  const hideEvents = useIsHiddenEntities(
    'stix-sighting-relationship',
    'Incident',
    'Observed-Data',
  );
  const hideObservations = useIsHiddenEntities(
    'Stix-Cyber-Observable',
    'Artifact',
    'Indicator',
    'Infrastructure',
  );
  const hideThreats = useIsHiddenEntities(
    'Threat-Actor-Group',
    'Threat-Actor-Individual',
    'Intrusion-Set',
    'Campaign',
  );
  const hideEntities = useIsHiddenEntities(
    'Sector',
    'Event',
    'Organization',
    'Security-platforms',
    'System',
    'Individual',
  );
  const hideCases = useIsHiddenEntities(
    'Case-Incident',
    'Feedback',
    'Case-Rfi',
    'Case-Rft',
    'Task',
  );
  const hideArsenal = useIsHiddenEntities(
    'Malware',
    'Channel',
    'Tool',
    'Vulnerability',
  );
  const hideTechniques = useIsHiddenEntities(
    'Attack-Pattern',
    'Narrative',
    'Course-Of-Action',
    'Data-Component',
    'Data-Source',
  );
  const hideLocations = useIsHiddenEntities(
    'Region',
    'Administrative-Area',
    'Country',
    'City',
    'Position',
  );

  const { isTrashEnable } = useHelper();

  const {
    bannerSettings: { bannerHeightNumber },
    settings: {
      platform_openaev_url: openAEVUrl,
      // platform_enterprise_edition: ee,
      platform_xtmhub_url: xtmhubUrl,
      xtm_hub_registration_status: xtmhubStatus,
    },
  } = useAuth();
  const settingsMessagesBannerHeight = useSettingsMessagesBannerHeight();
  const { height: topBannerHeight } = useTopBanner();
  const { dimension } = useDimensions();

  const isMobile = dimension.width < 768;

  const itemProps = {
    navOpen,
    selectedMenu,
    isMobile,
    classes,
    hiddenEntities,
    onMenuToggle: handleSelectedMenuToggle,
    onMenuOpen: handleSelectedMenuOpen,
    onMenuClose: handleSelectedMenuClose,
    onGoToPage: handleGoToPage,
    submenuShowIcons: submenu_show_icons,
  };

  const isLightTheme = theme.palette.mode === 'light';

  return (
    <Drawer
      variant="permanent"
      classes={{
        paper: navOpen ? classes.drawerPaperOpen : classes.drawerPaper,
      }}
      slotProps={{
        paper: {
          sx: {
            display: 'flex',
            flexDirection: 'column',
            overflow: 'hidden',
            background: 'transparent',
            border: 'none',
            boxShadow: 'none',
            padding: '8px',
          },
        },
      }}
      sx={{
        width: navOpen ? OPEN_BAR_WIDTH + 16 : SMALL_BAR_WIDTH + 16,
        zIndex: 999,
        top: 0,
        height: '100vh',
        overflow: 'hidden',
        transition: theme.transitions.create('width', {
          easing: theme.transitions.easing.easeInOut,
          duration: theme.transitions.duration.enteringScreen,
        }),
      }}
    >
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          height: '100%',
          borderRadius: '12px',
          backgroundColor: 'var(--ravin-bg)',
          border: theme.palette.mode === 'light' ? '1px solid var(--ravin-border)' : 'none',
          boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
          overflow: 'hidden',
        }}
      >
      <LeftBarHeader
        logo={logo}
        logoCollapsed={navCloseLogo}
        navOpen={navOpen}
        bannerHeightNumber={bannerHeightNumber}
        topBannerHeight={topBannerHeight}
        settingsMessagesBannerHeight={settingsMessagesBannerHeight}
        openAEVUrl={openAEVUrl}
        xtmhubUrl={xtmhubUrl}
        xtmhubStatus={xtmhubStatus}
        hasXtmHubAccess={hasXtmHubAccess}
      />

      <div
        ref={ref}
        aria-label="Main navigation"
        style={{
          overflow: 'auto',
          overflowX: 'hidden',
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          minHeight: 0,
          backgroundColor: 'transparent',
        }}
      >
        <GroupLabel navOpen={navOpen}>{t_i18n('Overview')}</GroupLabel>
        <MenuList disablePadding component="nav" sx={{ px: 1.5 }}>
          {!draftContext && (
            <LeftBarItem
              {...itemProps}
              label={t_i18n('Home')}
              icon={<Home size={18} />}
              link="/dashboard"
              exact
            />
          )}

          <Security needs={[EXPLORE]}>
            {!draftContext && (
              <LeftBarItem
                {...itemProps}
                id="dashboards"
                icon={<InsertChartOutlinedOutlined size={18} />}
                label={t_i18n('Dashboards')}
                link="/dashboard/workspaces/dashboards"
                subItems={[
                  {
                    granted: isGrantedToExplore,
                    type: 'Dashboard',
                    link: '/dashboard/workspaces/dashboards',
                    label: t_i18n('Custom dashboards'),
                    exact: true,
                  },
                  {
                    granted: isGrantedToExplore,
                    type: 'Dashboard',
                    link: '/dashboard/workspaces/dashboards_public',
                    label: t_i18n('Public dashboards'),
                    exact: true,
                  },
                ]}
              />
            )}
          </Security>

          <Security needs={[INVESTIGATION]}>
            {!draftContext && (
              <LeftBarItem
                {...itemProps}
                label={t_i18n('Investigations')}
                icon={<ExploreOutlined size={18} />}
                link="/dashboard/workspaces/investigations"
              />
            )}
          </Security>

          {draftContext && (
            <LeftBarItem
              {...itemProps}
              label={t_i18n('Draft overview')}
              icon={<ArchitectureOutlined size={18} />}
              link={`/dashboard/data/import/draft/${draftContext.id}`}
            />
          )}

          <Security needs={[PIRAPI]}>
            {!draftContext && (
              <LeftBarItem
                {...itemProps}
                label={t_i18n('PIR')}
                icon={<TrackChanges size={18} />}
                link="/dashboard/pirs"
              />
            )}
          </Security>
        </MenuList>

        <Separator />

        <Security needs={[KNOWLEDGE]}>
          <GroupLabel navOpen={navOpen}>{t_i18n('Knowledge')}</GroupLabel>
          <MenuList component="nav" sx={{ px: 1.5 }}>
            {!hideAnalyses && (
              <LeftBarItem
                {...itemProps}
                id="analyses"
                icon={<AssignmentOutlined size={18} />}
                label={t_i18n('Analyses')}
                link="/dashboard/analyses"
                subItems={[
                  { type: 'Report', link: '/dashboard/analyses/reports', label: t_i18n('Reports'), icon: <DescriptionOutlined size={16} /> },
                  { type: 'Grouping', link: '/dashboard/analyses/groupings', label: t_i18n('Groupings'), icon: <WorkspacesOutlined size={16} /> },
                  { type: 'Malware-Analysis', link: '/dashboard/analyses/malware_analyses', label: t_i18n('Malware analyses'), icon: <BiotechOutlined size={16} /> },
                  { type: 'Security-Coverage', link: '/dashboard/analyses/security_coverages', label: t_i18n('Security coverages'), icon: <SecurityOutlined size={16} /> },
                  { type: 'Note', link: '/dashboard/analyses/notes', label: t_i18n('Notes'), icon: <SubjectOutlined size={16} /> },
                  { type: 'External-Reference', link: '/dashboard/analyses/external_references', label: t_i18n('External references'), icon: <LocalOfferOutlined size={16} /> },
                ]}
              />
            )}

            {!hideCases && (
              <LeftBarItem
                {...itemProps}
                id="cases"
                icon={<CasesOutlined size={18} />}
                label={t_i18n('Cases')}
                link="/dashboard/cases"
                subItems={[
                  { type: 'Case-Incident', link: '/dashboard/cases/incidents', label: t_i18n('Incident responses'), icon: <BriefcaseEyeOutline size={16} /> },
                  { type: 'Case-Rfi', link: '/dashboard/cases/rfis', label: t_i18n('Requests for information'), icon: <BriefcaseSearchOutline size={16} /> },
                  { type: 'Case-Rft', link: '/dashboard/cases/rfts', label: t_i18n('Requests for takedown'), icon: <BriefcaseRemoveOutline size={16} /> },
                  { type: 'Task', link: '/dashboard/cases/tasks', label: t_i18n('Tasks'), icon: <TaskAltOutlined size={16} /> },
                  { type: 'Feedback', link: '/dashboard/cases/feedbacks', label: t_i18n('Feedbacks'), icon: <BriefcaseEditOutline size={16} /> },
                ]}
              />
            )}

            {!hideEvents && (
              <LeftBarItem
                {...itemProps}
                id="events"
                icon={<Timetable size={18} />}
                label={t_i18n('Events')}
                link="/dashboard/events"
                subItems={[
                  { type: 'Incident', link: '/dashboard/events/incidents', label: t_i18n('Incidents'), icon: <Fire size={16} /> },
                  { type: 'stix-sighting-relationship', link: '/dashboard/events/sightings', label: t_i18n('Sightings'), icon: <VisibilityOutlined size={16} /> },
                  { type: 'Observed-Data', link: '/dashboard/events/observed_data', label: t_i18n('Observed datas'), icon: <WifiTetheringOutlined size={16} /> },
                ]}
              />
            )}

            {!hideObservations && (
              <LeftBarItem
                {...itemProps}
                id="observations"
                icon={<Binoculars size={18} />}
                label={t_i18n('Observations')}
                link="/dashboard/observations"
                subItems={[
                  { type: 'Stix-Cyber-Observable', link: '/dashboard/observations/observables', label: t_i18n('Observables'), icon: <HexagonOutline size={16} /> },
                  { type: 'Artifact', link: '/dashboard/observations/artifacts', label: t_i18n('Artifacts'), icon: <ArchiveOutline size={16} /> },
                  { type: 'Indicator', link: '/dashboard/observations/indicators', label: t_i18n('Indicators'), icon: <ShieldSearch size={16} /> },
                  { type: 'Infrastructure', link: '/dashboard/observations/infrastructures', label: t_i18n('Infrastructures'), icon: <ServerNetwork size={16} /> },
                ]}
              />
            )}
          </MenuList>

          <Separator />

          <MenuList component="nav" sx={{ px: 1.5 }}>
            {!hideThreats && (
              <LeftBarItem
                {...itemProps}
                id="threats"
                icon={<FlaskOutline size={18} />}
                label={t_i18n('Threats')}
                link="/dashboard/threats"
                subItems={[
                  { type: 'Threat-Actor-Group', link: '/dashboard/threats/threat_actors_group', label: t_i18n('Threat actors (group)'), icon: <AccountMultipleOutline size={16} /> },
                  {
                    type: 'Threat-Actor-Individual',
                    link: '/dashboard/threats/threat_actors_individual',
                    label: t_i18n('Threat actors (individual)'),
                    icon: <LaptopAccount size={16} />,
                  },
                  { type: 'Intrusion-Set', link: '/dashboard/threats/intrusion_sets', label: t_i18n('Intrusion sets'), icon: <DiamondOutlined size={16} /> },
                  { type: 'Campaign', link: '/dashboard/threats/campaigns', label: t_i18n('Campaigns'), icon: <ChessKnight size={16} /> },
                ]}
              />
            )}

            {!hideArsenal && (
              <LeftBarItem
                {...itemProps}
                id="arsenal"
                icon={<LayersOutlined size={18} />}
                label={t_i18n('Arsenal')}
                link="/dashboard/arsenal"
                subItems={[
                  { type: 'Malware', link: '/dashboard/arsenal/malwares', label: t_i18n('Malwares'), icon: <Biohazard size={16} /> },
                  { type: 'Channel', link: '/dashboard/arsenal/channels', label: t_i18n('Channels'), icon: <SurroundSoundOutlined size={16} /> },
                  { type: 'Tool', link: '/dashboard/arsenal/tools', label: t_i18n('Tools'), icon: <WebAssetOutlined size={16} /> },
                  { type: 'Vulnerability', link: '/dashboard/arsenal/vulnerabilities', label: t_i18n('Vulnerabilities'), icon: <BugReportOutlined size={16} /> },
                ]}
              />
            )}

            {!hideTechniques && (
              <LeftBarItem
                {...itemProps}
                id="techniques"
                icon={<ConstructionOutlined size={18} />}
                label={t_i18n('Techniques')}
                link="/dashboard/techniques"
                subItems={[
                  { type: 'Attack-Pattern', link: '/dashboard/techniques/attack_patterns', label: t_i18n('Attack patterns'), icon: <LockPattern size={16} /> },
                  { type: 'Narrative', link: '/dashboard/techniques/narratives', label: t_i18n('Narratives'), icon: <SpeakerNotesOutlined size={16} /> },
                  { type: 'Course-Of-Action', link: '/dashboard/techniques/courses_of_action', label: t_i18n('Courses of action'), icon: <ProgressWrench size={16} /> },
                  { type: 'Data-Component', link: '/dashboard/techniques/data_components', label: t_i18n('Data components'), icon: <SourceOutlined size={16} /> },
                  { type: 'Data-Source', link: '/dashboard/techniques/data_sources', label: t_i18n('Data sources'), icon: <StreamOutlined size={16} /> },
                ]}
              />
            )}

            {!hideEntities && (
              <LeftBarItem
                {...itemProps}
                id="entities"
                icon={<FolderTableOutline size={18} />}
                label={t_i18n('Entities')}
                link="/dashboard/entities"
                subItems={
                  [
                    { type: 'Sector', link: '/dashboard/entities/sectors', label: t_i18n('Sectors'), icon: <DomainOutlined size={16} /> },
                    { type: 'Event', link: '/dashboard/entities/events', label: t_i18n('Events'), icon: <EventOutlined size={16} /> },
                    { type: 'Organization', link: '/dashboard/entities/organizations', label: t_i18n('Organizations'), icon: <AccountBalanceOutlined size={16} /> },
                    { type: 'SecurityPlatform', link: '/dashboard/entities/security_platforms', label: t_i18n('Security platforms'), icon: <SecurityOutlined size={16} /> },
                    { type: 'System', link: '/dashboard/entities/systems', label: t_i18n('Systems'), icon: <StorageOutlined size={16} /> },
                    { type: 'Individual', link: '/dashboard/entities/individuals', label: t_i18n('Individuals'), icon: <PersonOutlined size={16} /> },
                  ]
                }
              />
            )}

            {!hideLocations && (
              <LeftBarItem
                {...itemProps}
                id="locations"
                icon={<GlobeModel size={18} />}
                label={t_i18n('Locations')}
                link="/dashboard/locations"
                subItems={[
                  { type: 'Region', link: '/dashboard/locations/regions', label: t_i18n('Regions'), icon: <PublicOutlined size={16} /> },
                  { type: 'Country', link: '/dashboard/locations/countries', label: t_i18n('Countries'), icon: <FlagOutlined size={16} /> },
                  { type: 'Administrative-Area', link: '/dashboard/locations/administrative_areas', label: t_i18n('Administrative areas'), icon: <MapOutlined size={16} /> },
                  { type: 'City', link: '/dashboard/locations/cities', label: t_i18n('Cities'), icon: <CityVariantOutline size={16} /> },
                  { type: 'Position', link: '/dashboard/locations/positions', label: t_i18n('Positions'), icon: <PlaceOutlined size={16} /> },
                ]}
              />
            )}
          </MenuList>
        </Security>

        <Security needs={[MODULES, KNOWLEDGE, TAXIIAPI, CSVMAPPERS, INGESTION]}>
          <Separator />

          <GroupLabel navOpen={navOpen}>{t_i18n('Data')}</GroupLabel>
          <MenuList component="nav" sx={{ px: 1.5 }}>
            <Security needs={[MODULES, KNOWLEDGE, TAXIIAPI, CSVMAPPERS, INGESTION]}>
              <LeftBarItem
                {...itemProps}
                id="data"
                icon={<Database size={18} />}
                label={t_i18n('Data')}
                link="/dashboard/data"
                subItems={[
                  { granted: isGrantedToKnowledge, link: '/dashboard/data/entities', label: t_i18n('Entities') },
                  { granted: isGrantedToKnowledge, link: '/dashboard/data/relationships', label: t_i18n('Relationships') },
                  { granted: isGrantedToIngestion && !draftContext, link: '/dashboard/data/ingestion', label: t_i18n('Ingestion') },
                  { granted: isGrantedToImport && !draftContext, link: '/dashboard/data/import', label: t_i18n('Import') },
                  { granted: isGrantedToProcessing && !draftContext, link: '/dashboard/data/processing', label: t_i18n('Processing') },
                  { granted: isGrantedToSharing && !draftContext, link: '/dashboard/data/sharing', label: t_i18n('Data sharing') },
                  { granted: isGrantedToManage && !draftContext, link: '/dashboard/data/restriction', label: t_i18n('Restriction') },
                ]}
              />
            </Security>

            {
              isTrashEnable() && (
                <Security needs={[KNOWLEDGE_KNUPDATE_KNDELETE]}>
                  {!draftContext && (
                    <LeftBarItem
                      {...itemProps}
                      id="trash"
                      icon={<DeleteOutlined size={18} />}
                      label={t_i18n('Trash')}
                      link="/dashboard/trash"
                    />
                  )}
                </Security>
              )
            }
          </MenuList>
        </Security>

        <Security needs={[
          VIRTUAL_ORGANIZATION_ADMIN,
          SETTINGS_SETPARAMETERS,
          SETTINGS_SETACCESSES,
          SETTINGS_SETAUTH,
          SETTINGS_SETMARKINGS,
          SETTINGS_SETDISSEMINATION,
          SETTINGS_SETCUSTOMIZATION,
          SETTINGS_SETLABELS,
          SETTINGS_SETVOCABULARIES,
          SETTINGS_SETCASETEMPLATES,
          SETTINGS_SETSTATUSTEMPLATES,
          SETTINGS_SETKILLCHAINPHASES,
          SETTINGS_SECURITYACTIVITY,
          SETTINGS_FILEINDEXING,
          SETTINGS_SUPPORT,
          SETTINGS_SETMANAGEXTMHUB,
        ]}
        >
          <Separator />
          <GroupLabel navOpen={navOpen}>{t_i18n('Settings')}</GroupLabel>
          {!draftContext && (
            <MenuList component="nav" sx={{ px: 1.5, marginBottom: 6 }}>
              <LeftBarItem
                {...itemProps}
                id="settings"
                icon={<CogOutline size={18} />}
                label={t_i18n('Settings')}
                link="/dashboard/settings"
                subItems={[
                  { granted: isGrantedToParameters, link: '/dashboard/settings', label: t_i18n('Parameters'), exact: true },
                  { granted: isGrantedToSecurity || isOrganizationAdmin, link: '/dashboard/settings/accesses', label: t_i18n('Security') },
                  { granted: isGrantedToCustomization, link: '/dashboard/settings/customization', label: t_i18n('Customization') },
                  { granted: isGrantedToTaxonomies, link: '/dashboard/settings/vocabularies', label: t_i18n('Taxonomies') },
                  { granted: isGrantedToAudit, link: '/dashboard/settings/activity', label: t_i18n('Activity') },
                  { granted: isGrantedToFileIndexing, link: '/dashboard/settings/file_indexing', label: t_i18n('File indexing') },
                  { granted: isGrantedToExperience, link: '/dashboard/settings/experience', label: t_i18n('Filigran Experience') },
                ]}
              />
            </MenuList>
          )}
        </Security>
      </div>

      {/** Bottom **/}
      <div
        style={{
          flexShrink: 0,
          borderTop: '1px solid var(--ravin-border)',
          width: '100%',
          padding: '8px 0',
        }}
      >
        <MenuList
          sx={{
            display: 'flex',
            flexDirection: 'column',
            gap: 1,
            px: 1.5,
          }}>
          <LeftBarItem
            {...itemProps}
            icon={navOpen ? <ChevronLeft /> : <ChevronRight />}
            label={t_i18n('Collapse')}
            onClick={handleToggle}
          />
          {!data?.settings?.platform_whitemark && (
            <Stack
              direction="row"
              alignItems="center"
              gap={0.5}
              paddingLeft={2}
              marginBottom={1}
              minHeight={16}
            >
              {
                navOpen && (
                  <Typography
                    component="span"
                    sx={{
                      fontFamily: 'Peyda',
                      fontSize: '10px',
                      lineHeight: '16px',
                      opacity: 0.8,
                      color: 'var(--ravin-text-muted)',
                    }}
                  >
                    {t_i18n('ArmanCTI')}
                  </Typography>
                )
              }
              <img
                alt="logo"
                src={isLightTheme ? logoFiligranLight : logoFiligranDark}
                width={navOpen ? 48 : 12}
                height="12"
                style={{
                  opacity: 0.8,
                  objectFit: 'cover',
                  objectPosition: 'left center',
                }}
              />
            </Stack>
          )}
        </MenuList>
      </div>
      </div>
    </Drawer>
  );
};

const LeftBar = () => {
  const queryRef = useQueryLoading(leftBarQuery, {});
  return (
    <>
      {queryRef && (
        <React.Suspense>
          <LeftBarComponent queryRef={queryRef} />
        </React.Suspense>
      )}
    </>
  );
};

export default LeftBar;
