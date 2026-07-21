import React from 'react';
import { graphql } from 'react-relay';
import Box from '@mui/material/Box';
import Tooltip from '@mui/material/Tooltip';
import Typography from '@mui/material/Typography';
import { FileDelimitedOutline } from 'mdi-material-ui';
import { ErrorBoundary } from '@components/Error';
import {
  FeedDataTablePaginationQuery,
  FeedDataTablePaginationQuery$variables,
} from '@components/data/__generated__/FeedDataTablePaginationQuery.graphql';
import { FeedDataTable_data$data } from '@components/data/__generated__/FeedDataTable_data.graphql';
import Security from '../../../utils/Security';
import { TAXIIAPI_SETCOLLECTIONS } from '../../../utils/hooks/useGranted';
import { usePaginationLocalStorage } from '../../../utils/hooks/useLocalStorage';
import useQueryLoading from '../../../utils/hooks/useQueryLoading';
import { UsePreloadedPaginationFragment } from '../../../utils/hooks/usePreloadedPaginationFragment';
import { useFormatter } from '../../../components/i18n';
import Breadcrumbs from '../../../components/Breadcrumbs';
import DataTable from '../../../components/dataGrid/DataTable';
import { DataTableProps } from '../../../components/dataGrid/dataTableTypes';
import FilterIconButton from '../../../components/FilterIconButton';
import useConnectedDocumentModifier from '../../../utils/hooks/useConnectedDocumentModifier';
import FeedCreation from './feeds/FeedCreation';
import FeedPopover from './feeds/FeedPopover';
import { EMPTY_VALUE } from '../../../utils/String';
import { DataColumns, PaginationOptions } from '../../../components/list_lines';
import {
  deserializeFilterGroupForFrontend,
  isFilterGroupNotEmpty,
} from '../../../utils/filters/filtersUtils';

const lowercaseVoiceSx = {
  textTransform: 'lowercase',
  '&::first-letter': { textTransform: 'uppercase' },
} as const;

const LOCAL_STORAGE_KEY = 'feed';

const feedLineFragment = graphql`
  fragment FeedDataTableLine_node on Feed {
    id
    name
    separator
    rolling_time
    filters
    include_header
    feed_types
    feed_attributes {
      attribute
      multi_match_strategy
      multi_match_separator
      mappings {
        type
        attribute
        relationship_type
        target_entity_type
      }
    }
  }
`;

export const feedLinesQuery = graphql`
  query FeedDataTablePaginationQuery(
    $search: String
    $count: Int!
    $cursor: ID
    $orderBy: FeedOrdering
    $orderMode: OrderingMode
  ) {
    ...FeedDataTable_data
      @arguments(
        search: $search
        count: $count
        cursor: $cursor
        orderBy: $orderBy
        orderMode: $orderMode
      )
  }
`;

export const feedLinesFragment = graphql`
  fragment FeedDataTable_data on Query
  @argumentDefinitions(
    search: { type: "String" }
    count: { type: "Int", defaultValue: 25 }
    cursor: { type: "ID" }
    orderBy: { type: "FeedOrdering", defaultValue: name }
    orderMode: { type: "OrderingMode", defaultValue: asc }
  )
  @refetchable(queryName: "FeedDataTableRefetchQuery") {
    feeds(
      search: $search
      first: $count
      after: $cursor
      orderBy: $orderBy
      orderMode: $orderMode
    ) @connection(key: "FeedDataTable__feeds") {
      edges {
        node {
          id
          ...FeedDataTableLine_node
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

const Feed = () => {
  const { t_i18n } = useFormatter();
  const { setTitle } = useConnectedDocumentModifier();
  setTitle(t_i18n('CSV Feeds | Data sharing | Data'));

  const initialValues = {
    searchTerm: '',
    sortBy: 'name',
    orderAsc: true,
    openExports: false,
  };

  const {
    viewStorage,
    paginationOptions,
    helpers: storageHelpers,
  } = usePaginationLocalStorage<FeedDataTablePaginationQuery$variables>(
    LOCAL_STORAGE_KEY,
    initialValues,
  );

  const queryRef = useQueryLoading<FeedDataTablePaginationQuery>(
    feedLinesQuery,
    paginationOptions as unknown as FeedDataTablePaginationQuery$variables,
  );

  const dataColumns: DataTableProps['dataColumns'] = {
    name: {
      id: 'name',
      label: 'Name',
      isSortable: true,
      percentWidth: 15,
      render: ({ name }) => (
        <Tooltip title={name}>
          <span style={{ color: 'var(--ravin-text)', fontWeight: 500 }}>{name}</span>
        </Tooltip>
      ),
    },
    feed_types: {
      id: 'feed_types',
      label: 'Entity types',
      isSortable: true,
      percentWidth: 20,
      render: ({ feed_types }) => (
        <span style={{ color: 'var(--ravin-text-muted)' }}>
          {feed_types.map((type: string) => t_i18n(`entity_${type}`)).join(', ')}
        </span>
      ),
    },
    rolling_time: {
      id: 'rolling_time',
      label: 'Rolling time',
      isSortable: true,
      percentWidth: 10,
      render: ({ rolling_time }) => (
        <code style={{ color: 'var(--ravin-text-muted)', fontSize: 12 }}>{rolling_time}</code>
      ),
    },
    columns: {
      id: 'columns',
      label: 'Columns',
      isSortable: false,
      percentWidth: 20,
      render: ({ feed_attributes, separator }) => (
        <span style={{ color: 'var(--ravin-text-muted)' }}>
          {feed_attributes.map((n: { attribute: string }) => n.attribute).join(`${separator} `)}
        </span>
      ),
    },
    filters: {
      id: 'filters',
      label: 'Filters',
      isSortable: false,
      percentWidth: 35,
      render: ({ filters }) => {
        const deserializedFilters = deserializeFilterGroupForFrontend(filters);
        return isFilterGroupNotEmpty(deserializedFilters)
          ? (
            <FilterIconButton
              filters={deserializedFilters}
              dataColumns={dataColumns as unknown as DataColumns}
              variant="small"
            />
          )
          : EMPTY_VALUE;
      },
    },
  };

  const preloadedPaginationProps = {
    linesQuery: feedLinesQuery,
    linesFragment: feedLinesFragment,
    queryRef,
    nodePath: ['feeds', 'pageInfo', 'globalCount'],
    setNumberOfElements: storageHelpers.handleSetNumberOfElements,
  } as UsePreloadedPaginationFragment<FeedDataTablePaginationQuery>;

  const handleLineClick = (line: { id: string }) => {
    window.open(`/feeds/${line.id}`, '_blank');
  };

  return (
    <div data-testid="data-sharing-csv-feeds-page">
      <Breadcrumbs elements={[{ label: t_i18n('Data') }, { label: t_i18n('Data sharing') }, { label: t_i18n('CSV feeds'), current: true }]} />
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
                {t_i18n('CSV feeds')}
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
              {t_i18n('Export threat intelligence data as CSV feeds')}
            </Typography>
          </Box>
          <Security needs={[TAXIIAPI_SETCOLLECTIONS]}>
            <FeedCreation paginationOptions={paginationOptions as unknown as PaginationOptions} />
          </Security>
        </Box>
        {queryRef && (
          <DataTable
            dataColumns={dataColumns}
            resolvePath={(data: FeedDataTable_data$data) => data.feeds?.edges?.map((n) => n?.node).filter((node): node is NonNullable<typeof node> => node !== undefined)}
            storageKey={LOCAL_STORAGE_KEY}
            initialValues={initialValues}
            lineFragment={feedLineFragment}
            preloadedPaginationProps={preloadedPaginationProps}
            icon={() => <FileDelimitedOutline style={{ color: 'var(--ravin-primary)' }} />}
            actions={(row) => (
              <Security needs={[TAXIIAPI_SETCOLLECTIONS]}>
                <ErrorBoundary display={() => null}>
                  <FeedPopover
                    feedId={row.id}
                    paginationOptions={paginationOptions as unknown as PaginationOptions}
                  />
                </ErrorBoundary>
              </Security>
            )}
            onLineClick={handleLineClick}
            disableNavigation
            disableLineSelection
            emptyStateMessage={t_i18n('No CSV feeds configured. Create one to start exporting data.')}
          />
        )}
      </Box>
    </div>
  );
};

export default Feed;
