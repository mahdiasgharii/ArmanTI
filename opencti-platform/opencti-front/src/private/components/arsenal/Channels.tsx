import React from 'react';
import { graphql } from 'react-relay';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Tooltip from '@mui/material/Tooltip';
import { ChannelsLines_data$data } from '@components/arsenal/__generated__/ChannelsLines_data.graphql';
import { ChannelsLinesPaginationQuery, ChannelsLinesPaginationQuery$variables } from '@components/arsenal/__generated__/ChannelsLinesPaginationQuery.graphql';
import ChannelCreation from './channels/ChannelCreation';
import Security from '../../../utils/Security';
import { KNOWLEDGE_KNPARTICIPATE, KNOWLEDGE_KNUPDATE } from '../../../utils/hooks/useGranted';
import { usePaginationLocalStorage } from '../../../utils/hooks/useLocalStorage';
import useQueryLoading from '../../../utils/hooks/useQueryLoading';
import { emptyFilterGroup, useBuildEntityTypeBasedFilterContext, useGetDefaultFilterObject } from '../../../utils/filters/filtersUtils';
import Breadcrumbs from '../../../components/Breadcrumbs';
import { useFormatter } from '../../../components/i18n';
import DataTable from '../../../components/dataGrid/DataTable';
import { DataTableProps } from '../../../components/dataGrid/dataTableTypes';
import { UsePreloadedPaginationFragment } from '../../../utils/hooks/usePreloadedPaginationFragment';
import useConnectedDocumentModifier from '../../../utils/hooks/useConnectedDocumentModifier';
import { resolveLink } from '../../../utils/Entity';
import { EMPTY_VALUE } from '../../../utils/String';
import { Truncate } from '../../../components/dataGrid/dataTableUtils';
import Tag from '../../../components/common/tag/Tag';
import TagsOverflow from '../../../components/common/tag/TagsOverflow';

const lowercaseVoiceSx = {
  textTransform: 'lowercase',
  '&::first-letter': { textTransform: 'uppercase' },
} as const;

const LOCAL_STORAGE_KEY = 'channels';

const channelLineFragment = graphql`
  fragment ChannelsLine_node on Channel {
    id
    entity_type
    name
    channel_types
    created
    modified
    confidence
    draftVersion {
      draft_id
      draft_operation
    }
    objectMarking {
      id
      definition_type
      definition
      x_opencti_order
      x_opencti_color
    }
    objectLabel {
      id
      value
      color
    }
  }
`;

const channelsLinesQuery = graphql`
  query ChannelsLinesPaginationQuery(
    $search: String
    $count: Int!
    $cursor: ID
    $orderBy: ChannelsOrdering
    $orderMode: OrderingMode
    $filters: FilterGroup
  ) {
    ...ChannelsLines_data
    @arguments(
      search: $search
      count: $count
      cursor: $cursor
      orderBy: $orderBy
      orderMode: $orderMode
      filters: $filters
    )
  }
`;

const channelsLinesFragment = graphql`
  fragment ChannelsLines_data on Query
  @argumentDefinitions(
    search: { type: "String" }
    count: { type: "Int", defaultValue: 25 }
    cursor: { type: "ID" }
    orderBy: { type: "ChannelsOrdering", defaultValue: name }
    orderMode: { type: "OrderingMode", defaultValue: asc }
    filters: { type: "FilterGroup" }
  )
  @refetchable(queryName: "ChannelsLinesRefetchQuery") {
    channels(
      search: $search
      first: $count
      after: $cursor
      orderBy: $orderBy
      orderMode: $orderMode
      filters: $filters
    ) @connection(key: "Pagination_channels") {
      edges {
        node {
          id
          name
          description
          ...ChannelsLine_node
        }
      }
      pageInfo {
        endCursor
        hasNextPage
        globalCount
      }
    }
  }
`;

const Channels = () => {
  const { t_i18n } = useFormatter();
  const { setTitle } = useConnectedDocumentModifier();
  setTitle(t_i18n('Channels | Arsenal'));
  const initialValues = {
    searchTerm: '',
    sortBy: 'name',
    orderAsc: true,
    openExports: false,
    filters: {
      ...emptyFilterGroup,
      filters: useGetDefaultFilterObject(['channel_types'], ['Channel']),
    },
  };
  const { viewStorage, helpers: storageHelpers, paginationOptions } = usePaginationLocalStorage<ChannelsLinesPaginationQuery$variables>(
    LOCAL_STORAGE_KEY,
    initialValues,
  );

  const {
    filters,
  } = viewStorage;

  const contextFilters = useBuildEntityTypeBasedFilterContext('Channel', filters);
  const queryPaginationOptions = {
    ...paginationOptions,
    filters: contextFilters,
  } as unknown as ChannelsLinesPaginationQuery$variables;

  const dataColumns: DataTableProps['dataColumns'] = {
    name: {
      percentWidth: 30,
      render: (data) => {
        const name = data.name || data.id;
        const link = `${resolveLink('Channel')}/${data.id}`;
        return (
          <Tooltip title={name}>
            <a
              href={link}
              style={{
                color: 'var(--ravin-primary)',
                textDecoration: 'none',
                fontWeight: 500,
              }}
            >
              <Truncate>{name}</Truncate>
            </a>
          </Tooltip>
        );
      },
    },
    channel_types: {
      percentWidth: 15,
      render: ({ channel_types }) => {
        if (!channel_types || channel_types.length === 0) return EMPTY_VALUE;
        return (
          <Box sx={{ display: 'flex', gap: 0.5, flexWrap: 'wrap' }}>
            {channel_types.map((type: string) => (
              <Box
                key={type}
                component="span"
                sx={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  fontSize: 12,
                  fontWeight: 500,
                  color: 'var(--ravin-text-muted)',
                  backgroundColor: 'var(--ravin-surface-2)',
                  borderRadius: '4px',
                  padding: '2px 8px',
                  lineHeight: '20px',
                  ...lowercaseVoiceSx,
                }}
              >
                {type}
              </Box>
            ))}
          </Box>
        );
      },
    },
    objectLabel: {
      percentWidth: 20,
      render: ({ objectLabel }) => {
        if (!objectLabel || objectLabel.length === 0) return EMPTY_VALUE;
        return (
          <TagsOverflow
            items={objectLabel}
            getKey={(label: { id: string }) => label.id}
            renderTag={(label: { id: string; value: string }) => (
              <Tag label={label.value} labelTextTransform="lowercase" />
            )}
          />
        );
      },
    },
    created: {
      percentWidth: 12,
      render: ({ created }, { rd, nsdt }) => (
        <Tooltip title={nsdt(created)}>
          <span style={{ color: 'var(--ravin-text-muted)' }}>{rd(created)}</span>
        </Tooltip>
      ),
    },
    modified: {
      percentWidth: 12,
      render: ({ modified }, { rd, nsdt }) => (
        <Tooltip title={nsdt(modified)}>
          <span style={{ color: 'var(--ravin-text-muted)' }}>{rd(modified)}</span>
        </Tooltip>
      ),
    },
    objectMarking: {
      percentWidth: 10,
    },
  };
  const queryRef = useQueryLoading<ChannelsLinesPaginationQuery>(
    channelsLinesQuery,
    queryPaginationOptions,
  );

  const preloadedPaginationProps = {
    linesQuery: channelsLinesQuery,
    linesFragment: channelsLinesFragment,
    queryRef,
    nodePath: ['channels', 'pageInfo', 'globalCount'],
    setNumberOfElements: storageHelpers.handleSetNumberOfElements,
  } as UsePreloadedPaginationFragment<ChannelsLinesPaginationQuery>;

  const createButton = (
    <Security needs={[KNOWLEDGE_KNUPDATE, KNOWLEDGE_KNPARTICIPATE]}>
      <ChannelCreation paginationOptions={queryPaginationOptions} />
    </Security>
  );

  return (
    <div data-testid="channel-page">
      <Breadcrumbs elements={[{ label: t_i18n('Arsenal') }, { label: t_i18n('Channels'), current: true }]} />
      <Box sx={{ padding: '24px 24px 0 24px' }}>
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: 2,
          }}
        >
          <Box>
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
                {t_i18n('Channels')}
              </Typography>
              <Box
                component="span"
                sx={{
                  fontSize: 12,
                  fontWeight: 500,
                  color: 'var(--ravin-text-muted)',
                  backgroundColor: 'var(--ravin-surface-2)',
                  borderRadius: '4px',
                  padding: '2px 8px',
                  lineHeight: '20px',
                }}
              >
                {viewStorage.numberOfElements?.number ?? 0}
              </Box>
            </Box>
            <Typography
              sx={{
                fontSize: '0.8125rem',
                color: 'var(--ravin-text-muted)',
                marginTop: '4px',
                ...lowercaseVoiceSx,
              }}
            >
              {t_i18n('Track communication channels used in threat campaigns')}
            </Typography>
          </Box>
          {createButton}
        </Box>
        {queryRef && (
          <DataTable
            dataColumns={dataColumns}
            resolvePath={(data: ChannelsLines_data$data) => data.channels?.edges?.map((n) => n?.node)}
            storageKey={LOCAL_STORAGE_KEY}
            initialValues={initialValues}
            contextFilters={contextFilters}
            preloadedPaginationProps={preloadedPaginationProps}
            lineFragment={channelLineFragment}
            exportContext={{ entity_type: 'Channel' }}
            emptyStateMessage={t_i18n('No channels yet. Create one to start tracking communication channels.')}
          />
        )}
      </Box>
    </div>
  );
};

export default Channels;
