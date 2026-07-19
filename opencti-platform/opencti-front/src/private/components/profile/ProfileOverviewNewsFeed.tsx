import Card from '@common/card/Card';
import { ListItem, ListItemText, Switch } from '@mui/material';
import { useFormatter } from '../../../components/i18n';
import Box from '@mui/material/Box';
import { isKnownNewsFeedType } from '../../../utils/NewsFeed';

const ravinCardSx = {
  borderRadius: '8px',
  border: '1px solid var(--ravin-border)',
  borderColor: 'var(--ravin-border)',
  background: 'var(--ravin-bg)',
  padding: '16px',
  height: '100%',
  width: '100%',
} as const;

const ravinSwitchSx = {
  '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': {
    backgroundColor: 'var(--ravin-primary)',
    opacity: 0.3,
  },
  '& .MuiSwitch-switchBase.Mui-checked .MuiSwitch-thumb': {
    color: 'var(--ravin-primary)',
  },
} as const;

const ravinListItemTextSx = {
  '& .MuiTypography-root': {
    fontFamily: '"Peyda", sans-serif',
    fontSize: '0.9rem',
    color: 'var(--ravin-text)',
  },
} as const;

interface Props {
  availableNewsFeedTypes?: string[];
  unsubscribedNewsFeedTypes?: string[];
  onSubmitField: (name: string, value: string[]) => void;
}

const isAllUnsubscribed = (unsubscribed: string[]): boolean => {
  return unsubscribed?.includes('*') ?? false;
};

const ProfileOverviewNewsFeed = ({
  availableNewsFeedTypes = [],
  unsubscribedNewsFeedTypes = [],
  onSubmitField,
}: Props) => {
  const { t_i18n } = useFormatter();
  const allUnsubscribed = isAllUnsubscribed(unsubscribedNewsFeedTypes);

  const handleGlobalToggle = (_: unknown, value: boolean) => {
    onSubmitField('unsubscribed_news_feed_types', value ? [] : ['*']);
  };

  const handleFeedTypeToggle = (feedType: string) => (_: unknown, value: boolean) => {
    const current = unsubscribedNewsFeedTypes ?? [];
    const next = value
      ? current.filter((type) => type !== feedType)
      : [...current, feedType];
    onSubmitField('unsubscribed_news_feed_types', next);
  };

  return (
    <Card sx={ravinCardSx} padding="none">
      <ListItem
        divider={!allUnsubscribed}
        sx={allUnsubscribed ? { padding: '0' } : { padding: '0 0 10px 0' }}
      >
        <ListItemText
          primary={t_i18n('Enable News Feed notifications')}
          sx={ravinListItemTextSx}
        />
        <Switch
          checked={!allUnsubscribed}
          onChange={handleGlobalToggle}
          sx={ravinSwitchSx}
        />
      </ListItem>
      {!allUnsubscribed && availableNewsFeedTypes.map((feedType) => (
        <ListItem key={feedType} sx={{ padding: '10px 0 0 0', opacity: 0.8 }}>
          <Box component="span" sx={{ mr: 1, ml: 1 }}>•</Box>
          <ListItemText
            secondary={isKnownNewsFeedType(feedType) ? t_i18n(feedType) : t_i18n('Unsupported type')}
            sx={{
              '& .MuiTypography-root': {
                fontFamily: '"Peyda", sans-serif',
                fontSize: '0.8rem',
                color: 'var(--ravin-text-muted)',
              },
            }}
          />
          <Switch
            checked={!unsubscribedNewsFeedTypes?.includes(feedType)}
            onChange={handleFeedTypeToggle(feedType)}
            sx={ravinSwitchSx}
          />
        </ListItem>
      ))}
    </Card>
  );
};

export default ProfileOverviewNewsFeed;
