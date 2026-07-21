import React, { FunctionComponent, useEffect, useMemo, useState } from 'react';
import { graphql, useLazyLoadQuery, useSubscription } from 'react-relay';
import { Navigate, Outlet, useMatch, useNavigate } from 'react-router-dom';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { Tabs, TabsList, TabsTrigger } from '../../../components/ui/tabs';
import { useFormatter } from '../../../components/i18n';
import useAuth from '../../../utils/hooks/useAuth';
import useConnectedDocumentModifier from '../../../utils/hooks/useConnectedDocumentModifier';
import { requestSubscription } from '../../../relay/environment';
import { cn } from '../../../lib/utils';
import type { NotificationsUnreadNewsFeedsCountQuery } from './__generated__/NotificationsUnreadNewsFeedsCountQuery.graphql';
import { NotificationsNotificationNumberSubscription$data } from '@components/profile/__generated__/NotificationsNotificationNumberSubscription.graphql';
import { NotificationsNewsFeedNumberSubscription$data } from './__generated__/NotificationsNewsFeedNumberSubscription.graphql';

const notificationsUnreadNewsFeedsCountQuery = graphql`
  query NotificationsUnreadNewsFeedsCountQuery($skipNewsFeedsCount: Boolean!) {
    myUnreadNewsFeedsCount @skip(if: $skipNewsFeedsCount)
    myUnreadNotificationsCount
  }
`;

const notificationsNumberSubscription = graphql`
  subscription NotificationsNotificationNumberSubscription {
    notificationsNumber {
      count
    }
  }
`;

const newsFeedNumberSubscription = graphql`
  subscription NotificationsNewsFeedNumberSubscription {
    newsFeedsNumber {
      count
    }
  }
`;

const Notifications: FunctionComponent = () => {
  const { t_i18n } = useFormatter();
  const { setTitle } = useConnectedDocumentModifier();
  const { settings, me } = useAuth();
  const isXTMHubRegistered = settings.xtm_hub_registration_status === 'registered';
  const navigate = useNavigate();

  setTitle(t_i18n('Notifications'));

  const isUnsubscribedFromAllNewsFeeds = me.unsubscribed_news_feed_types?.includes('*') ?? false;
  const isNewsFeedTabVisible = isXTMHubRegistered && !isUnsubscribedFromAllNewsFeeds;

  const data = useLazyLoadQuery<NotificationsUnreadNewsFeedsCountQuery>(
    notificationsUnreadNewsFeedsCountQuery,
    { skipNewsFeedsCount: !isNewsFeedTabVisible },
  );

  const [liveNotificationsCount, setLiveNotificationsCount] = useState<number | null>(null);
  const [liveNewsFeedsCount, setLiveNewsFeedsCount] = useState<number | null>(null);

  const subConfig = useMemo(() => ({
    subscription: notificationsNumberSubscription,
    variables: {},
    onNext: (response: NotificationsNotificationNumberSubscription$data | null | undefined | unknown) => {
      const count = response ? (response as NotificationsNotificationNumberSubscription$data).notificationsNumber?.count : null;
      setLiveNotificationsCount(count ?? null);
    },
  }), []);
  useSubscription(subConfig);

  useEffect(() => {
    if (!isNewsFeedTabVisible) return undefined;
    const sub = requestSubscription({
      subscription: newsFeedNumberSubscription,
      variables: {},
      onNext: (response: NotificationsNewsFeedNumberSubscription$data | null | undefined | unknown) => {
        const count = response ? (response as NotificationsNewsFeedNumberSubscription$data).newsFeedsNumber?.count : null;
        setLiveNewsFeedsCount(count ?? null);
      },
    });
    return () => sub.dispose();
  }, [isNewsFeedTabVisible]);

  const unreadNotificationsCount = liveNotificationsCount !== null
    ? liveNotificationsCount
    : (data.myUnreadNotificationsCount ?? 0);
  const unreadNewsFeedsCount = liveNewsFeedsCount !== null
    ? liveNewsFeedsCount
    : (data.myUnreadNewsFeedsCount ?? 0);

  const activeTab = useMatch('/dashboard/profile/notifications/news-feed') ? 'news-feed' : 'alerts';

  const handleTabChange = (value: string) => {
    navigate(value);
  };

  const UnreadBadge = ({ count }: { count: number }) => {
    if (count === 0) return null;
    return (
      <span
        className={cn(
          'ml-1.5 inline-flex h-4 min-w-[16px] items-center justify-center rounded-[4px]',
          'bg-danger/15 px-1 text-[10px] font-medium leading-none text-danger',
        )}
      >
        {count > 99 ? '99+' : count}
      </span>
    );
  };

  const lowercaseVoiceSx = {
    textTransform: 'lowercase',
    '&::first-letter': { textTransform: 'uppercase' },
  } as const;

  if (!isNewsFeedTabVisible) {
    return (
      <Box sx={{ padding: '24px 24px 0 24px' }}>
        <Typography
          variant="h1"
          sx={{
            margin: 0,
            fontSize: '22px',
            fontWeight: 600,
            color: 'var(--ravin-text)',
            lineHeight: 1.3,
            ...lowercaseVoiceSx,
          }}
        >
          {t_i18n('Notifications')}
        </Typography>
        {activeTab === 'news-feed' && <Navigate to="alerts" replace />}
        <Outlet />
      </Box>
    );
  }

  return (
    <Box sx={{ padding: '24px 24px 0 24px' }}>
      <Box sx={{ marginBottom: 2 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
          <Typography
            variant="h1"
            sx={{
              margin: 0,
              fontSize: '22px',
              fontWeight: 600,
              color: 'var(--ravin-text)',
              lineHeight: 1.3,
              ...lowercaseVoiceSx,
            }}
          >
            {t_i18n('Notifications')}
          </Typography>
        </Box>
        <Typography
          sx={{
            fontSize: '0.8125rem',
            color: 'var(--ravin-text-muted)',
            marginTop: '4px',
            ...lowercaseVoiceSx,
          }}
        >
          {t_i18n('Stay informed on threat intelligence activity')}
        </Typography>
      </Box>
      <Tabs value={activeTab} onValueChange={handleTabChange}>
        <TabsList>
          <TabsTrigger value="alerts">
            {t_i18n('Alerts')}
            <UnreadBadge count={unreadNotificationsCount} />
          </TabsTrigger>
          <TabsTrigger value="news-feed">
            {t_i18n('XTM Hub News Feed')}
            <UnreadBadge count={unreadNewsFeedsCount} />
          </TabsTrigger>
        </TabsList>
      </Tabs>
      <Outlet />
    </Box>
  );
};

export default Notifications;
