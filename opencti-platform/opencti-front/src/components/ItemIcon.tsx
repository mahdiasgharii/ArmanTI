import { CSSProperties } from 'react';
import {
  Landmark as AccountBalanceOutlined,
  AtSign as AlternateEmailOutlined,
  Compass as ArchitectureOutlined,
  ClipboardList as AssignmentOutlined,
  LayoutGrid as AutoAwesomeMotion,
  Sparkles as AutoAwesomeOutlined,
  Table as BackupTableOutlined,
  Microscope as BiotechOutlined,
  Bug as BugReportOutlined,
  Megaphone as CampaignOutlined,
  Cast as CastConnectedOutlined,
  Crosshair as CenterFocusStrongOutlined,
  Circle as CircleOutlined,
  LayoutPanelTop as DashboardCustomizeOutlined,
  FileText as DescriptionOutlined,
  Diamond as DiamondOutlined,
  Building2 as DomainOutlined,
  Pencil as DrawOutlined,
  HardDriveUpload as DriveFolderUploadOutlined,
  Pencil as EditOutlined,
  Mail as EmailOutlined,
  Calendar as EventOutlined,
  Puzzle as ExtensionOutlined,
  CheckSquare as FactCheckOutlined,
  Filter as FilterAltOutlined,
  Flag as FlagOutlined,
  HelpCircle as HelpOutlined,
  TrendingUp as Insights,
  Layers as LayersClearOutlined,
  Link as LinkOutlined,
  Tag as LocalOfferOutlined,
  Shield as LocalPoliceOutlined,
  LogIn as LoginOutlined,
  LogOut as LogoutOutlined,
  UserCog as ManageAccountsOutlined,
  MapPin as MapOutlined,
  MemoryStick as MemoryOutlined,
  Bell as NotificationsOutlined,
  User as PersonOutlined,
  MapPin as PlaceOutlined,
  PlayCircle as PlayCircleOutlined,
  ListMinus as PlaylistRemoveOutlined,
  Bot as PrecisionManufacturingOutlined,
  Globe as PublicOutlined,
  Receipt as ReceiptOutlined,
  AlertTriangle as ReportProblemOutlined,
  MessageSquare as ReviewsOutlined,
  Route as RouteOutlined,
  Router as RouterOutlined,
  ShieldCheck as SafetyCheckOutlined,
  Shield as SecurityOutlined,
  Settings2 as SettingsApplicationsOutlined,
  Settings as SettingsOutlined,
  Type as ShortTextOutlined,
  FileCode as SourceOutlined,
  MessageSquare as SpeakerNotesOutlined,
  Server as StorageOutlined,
  Radio as StreamOutlined,
  FileText as SubjectOutlined,
  RadioTower as SurroundSoundOutlined,
  ListChecks as TaskAlt,
  CheckSquare as TaskAltOutlined,
  Terminal as TerminalOutlined,
  Target as TrackChanges,
  Languages as TranslateOutlined,
  Globe as TravelExploreOutlined,
  Stethoscope as TroubleshootOutlined,
  CalendarClock as UpcomingOutlined,
  Columns as ViewStreamTwoTone,
  Eye as VisibilityOutlined,
  Monitor as WebAssetOutlined,
  Wifi as WifiTetheringOutlined,
  Briefcase as WorkOutline,
  Workflow as WorkspacesOutlined,
  Users as AccountGroupOutline,
  UsersRound as AccountMultipleOutline,
  Archive as ArchiveOutline,
  Wand2 as AutoFix,
  Building2 as BankMinus,
  Building2 as BankPlus,
  Biohazard as Biohazard,
  Briefcase as BriefcaseCheckOutline,
  Briefcase as BriefcaseEditOutline,
  Briefcase as BriefcaseEyeOutline,
  Briefcase as BriefcaseRemoveOutline,
  Briefcase as BriefcaseSearchOutline,
  Crown as ChessKnight,
  Building2 as CityVariantOutline,
  ClipboardList as ClipboardTextClockOutline,
  Database as DatabaseExportOutline,
  FileText as FileDelimitedOutline,
  File as FileOutline,
  Filter as FilterOutline,
  Filter as FilterVariant,
  Flame as Fire,
  FlaskConical as FlaskOutline,
  Gauge as Gauge,
  Users as Group,
  Hexagon as HexagonOutline,
  Tag as LabelOutline,
  Laptop as LaptopAccount,
  Lock as LockMinusOutline,
  Lock as LockOutline,
  Lock as LockPattern,
  Wrench as ProgressWrench,
  ShieldCheck as ShieldCheckOutline,
  ShieldCheck as ShieldSearch,
  GitFork as SourceFork,
  GitPullRequest as SourcePull,
  Target as Target,
  CircleDashed as VectorRadius,
  Table2 as TableViewIcon,
} from 'lucide-react';
import { itemColor } from '../utils/Colors';

const fontSizeToPx = (fontSize: 'inherit' | 'large' | 'medium' | 'small'): number | undefined => {
  switch (fontSize) {
    case 'small':
      return 16;
    case 'large':
      return 32;
    case 'medium':
      return 24;
    default:
      return undefined;
  }
};

const iconSelector = (
  type: string | null | undefined,
  variant: string | undefined,
  fontSize: 'inherit' | 'large' | 'medium' | 'small',
  color?: string | null,
  isReversed?: boolean,
  overrideStyle: CSSProperties = {},
) => {
  let style: CSSProperties;
  switch (variant) {
    case 'inline':
      style = {
        color: color ?? itemColor(type),
        width: 15,
        height: 15,
        margin: '0 7px 0 0',
        float: 'left',
        paddingTop: 2,
        transform: isReversed ? 'rotate(-90deg)' : 'none',
        ...overrideStyle,
      };
      break;
    default:
      style = {
        color: color ?? itemColor(type),
        transform: isReversed ? 'rotate(-90deg)' : 'none',
        ...overrideStyle,
      };
  }

  switch (type?.toLowerCase()) {
    case 'restricted':
      return <HelpOutlined style={style} size={fontSizeToPx(fontSize)} role="img" />;
    case 'unauthorized':
      return <ReportProblemOutlined style={style} size={fontSizeToPx(fontSize)} role="img" />;
    case 'global':
      return <PublicOutlined style={style} size={fontSizeToPx(fontSize)} role="img" />;
    case 'trigger':
      return <CampaignOutlined style={style} size={fontSizeToPx(fontSize)} role="img" />;
    case 'admin':
      return <ManageAccountsOutlined style={style} size={fontSizeToPx(fontSize)} role="img" />;
    case 'search':
      return <BiotechOutlined style={style} size={fontSizeToPx(fontSize)} role="img" />;
    case 'login':
      return <LoginOutlined style={style} size={fontSizeToPx(fontSize)} role="img" />;
    case 'logout':
      return <LogoutOutlined style={style} size={fontSizeToPx(fontSize)} role="img" />;
    case 'vocabulary':
      return <ShortTextOutlined style={style} size={fontSizeToPx(fontSize)} role="img" />;
    case 'retentionrule':
      return (
        <LayersClearOutlined style={style} size={fontSizeToPx(fontSize)} role="img" />
      );
    case 'streamcollection':
      return <StreamOutlined style={style} size={fontSizeToPx(fontSize)} role="img" />;
    case 'settings':
      return <SettingsOutlined style={style} size={fontSizeToPx(fontSize)} role="img" />;
    case 'draft':
      return <ArchitectureOutlined style={style} size={fontSizeToPx(fontSize)} role="img" />;
    case 'taxiicollection':
      return (
        <DatabaseExportOutline style={style} size={fontSizeToPx(fontSize)} role="img" />
      );
    case 'feed':
      return (
        <FileDelimitedOutline style={style} size={fontSizeToPx(fontSize)} role="img" />
      );
    case 'backgroundtask':
      return (
        <AssignmentOutlined style={style} size={fontSizeToPx(fontSize)} role="img" />
      );
    case 'work':
    case 'csvmapper':
      return <TableViewIcon style={style} size={fontSizeToPx(fontSize)} role="img" />;
    case 'connector':
      return <ExtensionOutlined style={style} size={fontSizeToPx(fontSize)} role="img" />;
    case 'marking-definition':
      return (
        <CenterFocusStrongOutlined
          style={style}
          size={fontSizeToPx(fontSize)}
          role="img"
        />
      );
    case 'external-reference':
      return (
        <LocalOfferOutlined style={style} size={fontSizeToPx(fontSize)} role="img" />
      );
    case 'label':
      return <LabelOutline style={style} size={fontSizeToPx(fontSize)} role="img" />;
    case 'file':
      return <FileOutline style={style} size={fontSizeToPx(fontSize)} role="img" />;
    case 'attack-pattern':
      return <LockPattern style={style} size={fontSizeToPx(fontSize)} role="img" />;
    case 'campaign':
      return <ChessKnight style={style} size={fontSizeToPx(fontSize)} role="img" />;
    case 'note':
      return <SubjectOutlined style={style} size={fontSizeToPx(fontSize)} role="img" />;
    case 'observed-data':
      return (
        <WifiTetheringOutlined style={style} size={fontSizeToPx(fontSize)} role="img" />
      );
    case 'opinion':
      return <ReviewsOutlined style={style} size={fontSizeToPx(fontSize)} role="img" />;
    case 'report':
      return (
        <DescriptionOutlined style={style} size={fontSizeToPx(fontSize)} role="img" />
      );
    case 'grouping':
      return (
        <WorkspacesOutlined style={style} size={fontSizeToPx(fontSize)} role="img" />
      );
    case 'course-of-action':
      return <ProgressWrench style={style} size={fontSizeToPx(fontSize)} role="img" />;
    case 'role':
      return <SecurityOutlined style={style} size={fontSizeToPx(fontSize)} role="img" />;
    case 'capability':
      return (
        <LocalPoliceOutlined style={style} size={fontSizeToPx(fontSize)} role="img" />
      );
    case 'individual':
    case 'user':
      return <PersonOutlined style={style} size={fontSizeToPx(fontSize)} role="img" />;
    case 'group':
      return (
        <AccountGroupOutline style={style} size={fontSizeToPx(fontSize)} role="img" />
      );
    case 'all-users':
    case 'dynamic options':
    case 'dynamic from context':
    case 'dynamic from draft':
      return (
        <AccountGroupOutline style={style} size={fontSizeToPx(fontSize)} role="img" />
      );
    case 'organization':
    case 'identity':
      return (
        <AccountBalanceOutlined style={style} size={fontSizeToPx(fontSize)} role="img" />
      );
    case 'organization-add':
      return (
        <BankPlus style={style} size={fontSizeToPx(fontSize)} role="img" />
      );
    case 'organization-remove':
      return (
        <BankMinus style={style} size={fontSizeToPx(fontSize)} role="img" />
      );
    case 'sector':
      return <DomainOutlined style={style} size={fontSizeToPx(fontSize)} role="img" />;
    case 'system':
      return <StorageOutlined style={style} size={fontSizeToPx(fontSize)} role="img" />;
    case 'indicator':
      return <ShieldSearch style={style} size={fontSizeToPx(fontSize)} role="img" />;
    case 'infrastructure':
      return <RouterOutlined style={style} size={fontSizeToPx(fontSize)} role="img" />;
    case 'intrusion-set':
      return <DiamondOutlined style={style} size={fontSizeToPx(fontSize)} role="img" />;
    case 'city':
      return (
        <CityVariantOutline style={style} size={fontSizeToPx(fontSize)} role="img" />
      );
    case 'position':
    case 'location':
      return <PlaceOutlined style={style} size={fontSizeToPx(fontSize)} role="img" />;
    case 'administrative-area':
      return <MapOutlined style={style} size={fontSizeToPx(fontSize)} role="img" />;
    case 'country':
      return <FlagOutlined style={style} size={fontSizeToPx(fontSize)} role="img" />;
    case 'region':
      return <PublicOutlined style={style} size={fontSizeToPx(fontSize)} role="img" />;
    case 'malware':
      return <Biohazard style={style} size={fontSizeToPx(fontSize)} role="img" />;
    case 'pir':
      return <TrackChanges style={style} size={fontSizeToPx(fontSize)} role="img" />;
    case 'in-pir':
      return <TrackChanges style={style} size={fontSizeToPx(fontSize)} role="img" />;
    case 'malware-analysis':
      return <BiotechOutlined style={style} size={fontSizeToPx(fontSize)} role="img" />;
    case 'threat-actor':
    case 'threat-actor-group':
      return (
        <AccountMultipleOutline style={style} size={fontSizeToPx(fontSize)} role="img" />
      );
    case 'threat-actor-individual':
      return <LaptopAccount style={style} size={fontSizeToPx(fontSize)} role="img" />;
    case 'tool':
      return <WebAssetOutlined style={style} size={fontSizeToPx(fontSize)} role="img" />;
    case 'vulnerability':
      return <BugReportOutlined style={style} size={fontSizeToPx(fontSize)} role="img" />;
    case 'incident':
      return <Fire style={style} size={fontSizeToPx(fontSize)} role="img" />;
    case 'channel':
      return (
        <SurroundSoundOutlined style={style} size={fontSizeToPx(fontSize)} role="img" />
      );
    case 'draftworkspace':
      return <ArchitectureOutlined style={style} size={fontSizeToPx(fontSize)} role="img" />;
    case 'event':
      return <EventOutlined style={style} size={fontSizeToPx(fontSize)} role="img" />;
    case 'narrative':
      return (
        <SpeakerNotesOutlined style={style} size={fontSizeToPx(fontSize)} role="img" />
      );
    case 'language':
      return <TranslateOutlined style={style} size={fontSizeToPx(fontSize)} role="img" />;
    case 'data-source':
      return <StreamOutlined style={style} size={fontSizeToPx(fontSize)} role="img" />;
    case 'data-component':
      return <SourceOutlined style={style} size={fontSizeToPx(fontSize)} role="img" />;
    case 'kill-chain-phase':
      return <RouteOutlined style={style} size={fontSizeToPx(fontSize)} role="img" />;
    case 'artifact':
      return <ArchiveOutline style={style} size={fontSizeToPx(fontSize)} role="img" />;
    case 'statustemplate':
      return <FactCheckOutlined style={style} size={fontSizeToPx(fontSize)} role="img" />;
    case 'case':
      return <WorkOutline style={style} size={fontSizeToPx(fontSize)} role="img" />;
    case 'case-incident':
      return (
        <BriefcaseEyeOutline style={style} size={fontSizeToPx(fontSize)} role="img" />
      );
    case 'case-template':
      return (
        <BriefcaseCheckOutline style={style} size={fontSizeToPx(fontSize)} role="img" />
      );
    case 'feedback':
      return (
        <BriefcaseEditOutline style={style} size={fontSizeToPx(fontSize)} role="img" />
      );
    case 'case-rfi':
      return (
        <BriefcaseSearchOutline style={style} size={fontSizeToPx(fontSize)} role="img" />
      );
    case 'case-rft':
      return (
        <BriefcaseRemoveOutline style={style} size={fontSizeToPx(fontSize)} role="img" />
      );
    case 'task':
      return <TaskAltOutlined style={style} size={fontSizeToPx(fontSize)} role="img" />;
    case 'task-template':
      return (
        <TaskAlt style={style} size={fontSizeToPx(fontSize)} role="img" />
      );
    case 'security-coverage':
      return (
        <ShieldCheckOutline style={style} size={fontSizeToPx(fontSize)} role="img" />
      );
    case 'history':
      return (
        <ClipboardTextClockOutline
          style={style}
          size={fontSizeToPx(fontSize)}
          role="img"
        />
      );
    case 'activity':
      return (
        <SafetyCheckOutlined style={style} size={fontSizeToPx(fontSize)} role="img" />
      );
    case 'dashboard':
    case 'workspace':
      return (
        <DashboardCustomizeOutlined
          style={style}
          size={fontSizeToPx(fontSize)}
          role="img"
        />
      );
    case 'investigation':
      return <TravelExploreOutlined style={style} size={fontSizeToPx(fontSize)} role="img" />;
    case 'session':
      return <ReceiptOutlined style={style} size={fontSizeToPx(fontSize)} role="img" />;
    case 'playbook':
      return (
        <PrecisionManufacturingOutlined
          style={style}
          size={fontSizeToPx(fontSize)}
          role="img"
        />
      );
    case 'decayrule':
      return <TroubleshootOutlined style={style} size={fontSizeToPx(fontSize)} role="img" />;
    case 'edit':
      return <EditOutlined style={style} size={fontSizeToPx(fontSize)} role="img" />;
    case 'container':
      return <Group style={style} size={fontSizeToPx(fontSize)} role="img" />;
    case 'memory':
      return <MemoryOutlined style={style} size={fontSizeToPx(fontSize)} role="img" />;
    case 'notification':
      return (
        <NotificationsOutlined style={style} size={fontSizeToPx(fontSize)} role="img" />
      );
    case 'manual':
      return (
        <PlayCircleOutlined style={style} size={fontSizeToPx(fontSize)} role="img" />
      );
    case 'managerconfiguration':
      return (
        <SettingsApplicationsOutlined style={style} size={fontSizeToPx(fontSize)} role="img" />
      );
    case 'observable':
    case 'stix-cyber-observable':
    case 'autonomous-system':
    case 'directory':
    case 'domain-name':
    case 'email-addr':
    case 'email-message':
    case 'email-mime-part-type':
    case 'stixfile':
    case 'x509-certificate':
    case 'ipv4-addr':
    case 'ipv6-addr':
    case 'mac-addr':
    case 'mutex':
    case 'network-traffic':
    case 'process':
    case 'software':
    case 'url':
    case 'user-account':
    case 'windows-registry-key':
    case 'windows-registry-value-type':
    case 'cryptographic-key':
    case 'cryptocurrency-wallet':
    case 'hostname':
    case 'text':
    case 'user-agent':
    case 'bank-account':
    case 'phone-number':
    case 'payment-card':
    case 'credential':
    case 'tracking-number':
    case 'media-content':
    case 'persona':
    case 'ssh-key':
    case 'ai-prompt':
    case 'imei':
    case 'iccid':
    case 'imsi':
      return <HexagonOutline style={style} size={fontSizeToPx(fontSize)} role="img" />;
    case 'stix-sighting-relationship':
    case 'sighting':
      return (
        <VisibilityOutlined style={style} size={fontSizeToPx(fontSize)} role="img" />
      );
    case 'reduce':
      return <FilterAltOutlined style={style} size={fontSizeToPx(fontSize)} role="img" />;
    case 'filter':
      return <FilterVariant style={style} size={fontSizeToPx(fontSize)} role="img" />;
    case 'stream':
      return (
        <CastConnectedOutlined style={style} size={fontSizeToPx(fontSize)} role="img" />
      );
    case 'console':
      return <TerminalOutlined style={style} size={fontSizeToPx(fontSize)} role="img" />;
    case 'ai-agent':
      return <AutoAwesomeOutlined style={style} size={fontSizeToPx(fontSize)} role="img" />;
    case 'storage':
      return (
        <DriveFolderUploadOutlined
          style={style}
          size={fontSizeToPx(fontSize)}
          role="img"
        />
      );
    case 'related':
      return <LinkOutlined style={style} size={fontSizeToPx(fontSize)} role="img" />;
    case 'threats':
      return <FlaskOutline style={style} size={fontSizeToPx(fontSize)} role="img" />;
    case 'overview':
      return <Gauge style={style} size={fontSizeToPx(fontSize)} role="img" />;
    case 'variant':
      return <SourceFork style={style} size={fontSizeToPx(fontSize)} role="img" />;
    case 'attribution':
      return <SourcePull style={style} size={fontSizeToPx(fontSize)} role="img" />;
    case 'victimology':
      return <Target style={style} size={fontSizeToPx(fontSize)} role="img" />;
    case 'cron':
      return <BackupTableOutlined style={style} size={fontSizeToPx(fontSize)} role="img" />;
    case 'relationship':
    case 'stix-core-relationship':
    case 'targets':
    case 'uses':
    case 'located-at':
    case 'related-to':
    case 'mitigates':
    case 'reports-to':
    case 'supports':
    case 'known-as':
    case 'impersonates':
    case 'indicates':
    case 'comes-after':
    case 'attributed-to':
    case 'variant-of':
    case 'part-of':
    case 'employed-by':
    case 'resides-in':
    case 'citizen-of':
    case 'national-of':
    case 'drops':
    case 'delivers':
    case 'compromises':
    case 'belongs-to':
    case 'based-on':
    case 'communicates-with':
    case 'amplifies':
    case 'analysis-of':
    case 'authored-by':
    case 'beacons-to':
    case 'characterizes':
    case 'consists-of':
    case 'interpreted-by':
    case 'technology-from':
    case 'technology-to':
    case 'technology':
    case 'transferred-to':
    case 'demonstrates':
    case 'controls':
    case 'cooperates-with':
    case 'derived-from':
    case 'downloads':
    case 'has':
    case 'bcc':
    case 'cc':
    case 'obs_belongs-to':
    case 'owns':
    case 'dst':
    case 'from':
    case 'hosts':
    case 'image':
    case 'publishes':
    case 'duplicate-of':
    case 'obs_content':
    case 'service-dll':
    case 'dynamic-analysis-of':
    case 'contains':
    case 'created-by':
    case 'object-marking':
    case 'object-label':
    case 'object':
    case 'exfiltrates-to':
    case 'exploits':
    case 'investigates':
    case 'originates-from':
    case 'participates-in':
    case 'body-multipart':
    case 'body-raw':
    case 'child':
    case 'creator-user':
    case 'detects':
    case 'dst-payload':
    case 'encapsulated-by':
    case 'encapsulates':
    case 'opened-connection':
    case 'operating-system':
    case 'parent':
    case 'parent-directory':
    case 'raw-email':
    case 'src-payload':
    case 'remediates':
    case 'resolves-to':
    case 'participates-to':
    case 'obs_resolves-to':
    case 'revoked-by':
    case 'sample':
    case 'sender':
    case 'src':
    case 'to':
    case 'values':
    case 'static-analysis-of':
    case 'subnarrative-of':
    case 'subtechnique-of':
    case 'should-cover':
    case 'has-covered':
      return <VectorRadius style={style} size={fontSizeToPx(fontSize)} role="img" />;
    case 'notifier':
      return <UpcomingOutlined style={style} size={fontSizeToPx(fontSize)} role="img" />;
    case 'synchronizer':
      return <ViewStreamTwoTone style={style} size={fontSizeToPx(fontSize)} role="img" />;
    case 'draft_context':
      return <ArchitectureOutlined style={style} size={fontSizeToPx(fontSize)} role="img" />;
    case 'exclusionlist':
      return <PlaylistRemoveOutlined style={style} size={fontSizeToPx(fontSize)} role="img" />;
    case 'disseminationlist':
      return <AlternateEmailOutlined style={style} size={fontSizeToPx(fontSize)} role="img" />;
    case 'emailtemplate':
      return <EmailOutlined style={style} size={fontSizeToPx(fontSize)} role="img" />;
    case 'finteldesign':
      return <DrawOutlined style={style} size={fontSizeToPx(fontSize)} role="img" />;
    case 'securityplatform':
      return <SecurityOutlined style={style} size={fontSizeToPx(fontSize)} role="img" />;
    case 'autofix':
      return <AutoFix style={style} size={fontSizeToPx(fontSize)} role="img" />;
    case 'lock':
      return <LockOutline style={style} size={fontSizeToPx(fontSize)} role="img" />;
    case 'lock-remove':
      return <LockMinusOutline style={style} size={fontSizeToPx(fontSize)} role="img" />;
    case 'customview':
      return <Insights style={style} size={fontSizeToPx(fontSize)} role="img" />;
    case 'savedfilter':
      return <FilterOutline style={style} size={fontSizeToPx(fontSize)} role="img" />;
    case 'default':
      return <CircleOutlined style={style} size={fontSizeToPx(fontSize)} role="img" />;
    default:
      return <AutoAwesomeMotion style={style} size={fontSizeToPx(fontSize)} role="img" />;
  }
};

interface ItemIconProps {
  type?: string | null;
  size?: 'inherit' | 'large' | 'medium' | 'small';
  variant?: string;
  color?: string | null;
  isReversed?: boolean;
  style?: CSSProperties;
}

const ItemIcon = ({
  type,
  size = 'medium',
  variant,
  color = null,
  isReversed = false,
  style,
}: ItemIconProps) => {
  return iconSelector(type, variant, size, color, isReversed, style);
};

export default ItemIcon;
