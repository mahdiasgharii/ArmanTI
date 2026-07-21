import React, { FunctionComponent } from 'react';
import { graphql } from 'react-relay';
import { Box, Typography, Tooltip } from '@mui/material';
import { EventsPaginationQuery, EventsPaginationQuery$variables } from './__generated__/EventsPaginationQuery.graphql';
import { EventsData_data$data } from './__generated__/EventsData_data.graphql';
import { EventsLinesPaginationQuery$variables } from './events/__generated__/EventsLinesPaginationQuery.graphql';
import Security from '../../../utils/Security';
import { KNOWLEDGE_KNUPDATE } from '../../../utils/hooks/useGranted';
import useAuth from '../../../utils/hooks/useAuth';
import EventCreation from './events/EventCreation';
import ExportContextProvider from '../../../utils/ExportContextProvider';
import { usePaginationLocalStorage } from '../../../utils/hooks/useLocalStorage';
import useQueryLoading from '../../../utils/hooks/useQueryLoading';
import { emptyFilterGroup, useBuildEntityTypeBasedFilterContext } from '../../../utils/filters/filtersUtils';
import { useFormatter } from '../../../components/i18n';
import Breadcrumbs from '../../../components/Breadcrumbs';
import DataTable from '../../../components/dataGrid/DataTable';
import { UsePreloadedPaginationFragment } from '../../../utils/hooks/usePreloadedPaginationFragment';
import { DataTableProps } from '../../../components/dataGrid/dataTableTypes';
import useConnectedDocumentModifier from '../../../utils/hooks/useConnectedDocumentModifier';
import { resolveLink } from '../../../utils/Entity';
import { EMPTY_VALUE } from '../../../utils/String';
import { Truncate } from '../../../components/dataGrid/dataTableUtils';
import ItemMarkings from '../../../components/ItemMarkings';
import StixCoreObjectLabels from '../common/stix_core_objects/StixCoreObjectLabels';
import { DraftChip } from '@components/common/draft/DraftChip';

const lowercaseVoiceSx = {
  textTransform: 'lowercase',
  '&::first-letter': { textTransform: 'uppercase' },
} as const;

const LOCAL_STORAGE_KEY = 'events';

const eventLineFragment = graphql`
  fragment EventsLine_node on Event {
    id
    entity_type
    parent_types
    name
    event_types
    created
    modified
    start_time
    stop_time
    draftVersion {
      draft_id
      draft_operation
    }
    createdBy {
      ... on Identity {
        id
        name
        entity_type
      }
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
    creators {
      id
      name
    }
  }
`;

const eventsQuery = graphql`
  query EventsPaginationQuery(
    $search: String
    $count: Int!
    $cursor: ID
    $orderBy: EventsOrdering
    $orderMode: OrderingMode
    $filters: FilterGroup
  ) {
    ...EventsData_data
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

const eventsFragment = graphql`
  fragment EventsData_data on Query
  @argumentDefinitions(
    search: { type: "String" }
    count: { type: "Int", defaultValue: 25 }
    cursor: { type: "ID" }
    orderBy: { type: "EventsOrdering", defaultValue: name }
    orderMode: { type: "OrderingMode", defaultValue: asc }
    filters: { type: "FilterGroup" }
  )
  @refetchable(queryName: "EventsRefetchQuery") {
    events(
      search: $search
      first: $count
      after: $cursor
      orderBy: $orderBy
      orderMode: $orderMode
      filters: $filters
    ) @connection(key: "Pagination_events") {
      edges {
        node {
          ...EventsLine_node
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

const Events: FunctionComponent = () => {
  const { t_i18n } = useFormatter();
  const { setTitle } = useConnectedDocumentModifier();
  setTitle(t_i18n('Events | Entities'));
  const {
    platformModuleHelpers: { isRuntimeFieldEnable },
  } = useAuth();
  const isRuntimeSort = isRuntimeFieldEnable() ?? false;

  const initialValues = {
    filters: emptyFilterGroup,
    searchTerm: '',
    sortBy: 'name',
    orderAsc: true,
    openExports: false,
  };
  const { viewStorage, paginationOptions, helpers: storageHelpers } = usePaginationLocalStorage<EventsPaginationQuery$variables>(
    LOCAL_STORAGE_KEY,
    initialValues,
  );

  const contextFilters = useBuildEntityTypeBasedFilterContext('Event', viewStorage.filters);
  const queryPaginationOptions = {
    ...paginationOptions,
    filters: contextFilters,
  } as unknown as EventsPaginationQuery$variables;
  const queryRef = useQueryLoading<EventsPaginationQuery>(
    eventsQuery,
    queryPaginationOptions,
  );

  const dataColumns: DataTableProps['dataColumns'] = {
    name: {
      percentWidth: 25,
      isSortable: isRuntimeSort,
      render: (data) => {
        const value = data.name || data.id;
        const link = `${resolveLink('Event')}/${data.id}`;
        return (
          <Tooltip title={value}>
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
              <a
                href={link}
                style={{
                  color: 'var(--ravin-primary)',
                  textDecoration: 'none',
                  fontWeight: 500,
                }}
              >
                <Truncate>{value}</Truncate>
              </a>
              {data.draftVersion && <DraftChip />}
            </span>
          </Tooltip>
        );
      },
    },
    event_types: {
      percentWidth: 15,
      isSortable: isRuntimeSort,
      render: ({ event_types }) => {
        if (!event_types || event_types.length === 0) return EMPTY_VALUE;
        return (
          <span style={{ color: 'var(--ravin-text-muted)' }}>
            {event_types.join(', ')}
          </span>
        );
      },
    },
    start_time: {
      percentWidth: 12,
      isSortable: isRuntimeSort,
      render: ({ start_time }, { fd, nsdt }) => (
        <Tooltip title={nsdt(start_time)}>
          <span>{fd(start_time)}</span>
        </Tooltip>
      ),
    },
    stop_time: {
      percentWidth: 12,
      isSortable: isRuntimeSort,
      render: ({ stop_time }, { fd, nsdt }) => (
        <Tooltip title={nsdt(stop_time)}>
          <span>{fd(stop_time)}</span>
        </Tooltip>
      ),
    },
    createdBy: {
      percentWidth: 10,
      isSortable: isRuntimeSort,
      render: ({ createdBy }) => (
        <span style={{ color: 'var(--ravin-text-muted)' }}>
          {createdBy?.name ?? EMPTY_VALUE}
        </span>
      ),
    },
    creator: {
      percentWidth: 10,
      isSortable: isRuntimeSort,
      render: ({ creators }) => {
        if (!creators || creators.length === 0) return EMPTY_VALUE;
        const value = creators.map((c: { name: string }) => c.name).join(', ');
        return (
          <span style={{ color: 'var(--ravin-text-muted)' }}>
            {value}
          </span>
        );
      },
    },
    objectLabel: {
      percentWidth: 8,
      render: ({ objectLabel }, { storageHelpers: { handleAddFilter } }) => {
        return (
          <StixCoreObjectLabels
            variant="inList"
            labels={objectLabel}
            onClick={handleAddFilter}
          />
        );
      },
    },
    objectMarking: {
      percentWidth: 8,
      isSortable: isRuntimeSort,
      render: ({ objectMarking }, { storageHelpers: { handleAddFilter } }) => (
        <ItemMarkings
          markingDefinitions={objectMarking ?? []}
          limit={1}
          onClick={(m) => handleAddFilter('objectMarking', m.id, 'eq')}
        />
      ),
    },
  };

  const preloadedPaginationOptions = {
    linesQuery: eventsQuery,
    linesFragment: eventsFragment,
    queryRef,
    nodePath: ['events', 'pageInfo', 'globalCount'],
    setNumberOfElements: storageHelpers.handleSetNumberOfElements,
  } as UsePreloadedPaginationFragment<EventsPaginationQuery>;

  const createButton = (
    <Security needs={[KNOWLEDGE_KNUPDATE]}>
      <EventCreation paginationOptions={queryPaginationOptions as unknown as EventsLinesPaginationQuery$variables} />
    </Security>
  );

  return (
    <div data-testid="event-page">
      <ExportContextProvider>
        <Breadcrumbs elements={[{ label: t_i18n('Entities') }, { label: t_i18n('Events'), current: true }]} />
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
                  {t_i18n('Events')}
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
                {t_i18n('Tracked events with temporal context for intelligence analysis')}
              </Typography>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, flexShrink: 0 }}>
              {createButton}
            </Box>
          </Box>
          {queryRef && (
            <DataTable
              dataColumns={dataColumns}
              resolvePath={(data: EventsData_data$data) => data.events?.edges?.map((n) => n?.node)}
              storageKey={LOCAL_STORAGE_KEY}
              initialValues={initialValues}
              contextFilters={contextFilters}
              lineFragment={eventLineFragment}
              preloadedPaginationProps={preloadedPaginationOptions}
              exportContext={{ entity_type: 'Event' }}
              emptyStateMessage={t_i18n('No events yet. Create one to start tracking events with temporal context.')}
            />
          )}
        </Box>
      </ExportContextProvider>
    </div>
  );
};

export default Events;
