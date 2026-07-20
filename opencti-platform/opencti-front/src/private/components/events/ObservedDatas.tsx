import React, { FunctionComponent } from 'react';
import { graphql } from 'react-relay';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Tooltip from '@mui/material/Tooltip';
import { ObservedDatasLinesPaginationQuery, ObservedDatasLinesPaginationQuery$variables } from '@components/events/__generated__/ObservedDatasLinesPaginationQuery.graphql';
import { ObservedDatasLines_data$data } from '@components/events/__generated__/ObservedDatasLines_data.graphql';
import ObservedDataCreation from './observed_data/ObservedDataCreation';
import Security from '../../../utils/Security';
import { KNOWLEDGE_KNUPDATE } from '../../../utils/hooks/useGranted';
import useAuth from '../../../utils/hooks/useAuth';
import { usePaginationLocalStorage } from '../../../utils/hooks/useLocalStorage';
import { useBuildEntityTypeBasedFilterContext, emptyFilterGroup } from '../../../utils/filters/filtersUtils';
import { useFormatter } from '../../../components/i18n';
import Breadcrumbs from '../../../components/Breadcrumbs';
import DataTable from '../../../components/dataGrid/DataTable';
import { DataTableProps } from '../../../components/dataGrid/dataTableTypes';
import { defaultRender, Truncate } from '../../../components/dataGrid/dataTableUtils';
import { UsePreloadedPaginationFragment } from '../../../utils/hooks/usePreloadedPaginationFragment';
import useQueryLoading from '../../../utils/hooks/useQueryLoading';
import useConnectedDocumentModifier from '../../../utils/hooks/useConnectedDocumentModifier';
import { resolveLink } from '../../../utils/Entity';
import { EMPTY_VALUE } from '../../../utils/String';
import ItemMarkings from '../../../components/ItemMarkings';
import StixCoreObjectLabels from '@components/common/stix_core_objects/StixCoreObjectLabels';

const lowercaseVoiceSx = {
  textTransform: 'lowercase',
  '&::first-letter': { textTransform: 'uppercase' },
} as const;

const LOCAL_STORAGE_KEY = 'observedDatas';

const observedDataFragment = graphql`
  fragment ObservedDatasLine_node on ObservedData {
    id
    created
    name
    entity_type
    first_observed
    last_observed
    number_observed
    confidence
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
  }
`;

const observedDatasLinesQuery = graphql`
  query ObservedDatasLinesPaginationQuery(
    $search: String
    $count: Int!
    $cursor: ID
    $orderBy: ObservedDatasOrdering
    $orderMode: OrderingMode
    $filters: FilterGroup
  ) {
    ...ObservedDatasLines_data
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

const observedDatasLinesFragment = graphql`
  fragment ObservedDatasLines_data on Query
  @argumentDefinitions(
    search: { type: "String" }
    count: { type: "Int", defaultValue: 25 }
    cursor: { type: "ID" }
    orderBy: { type: "ObservedDatasOrdering", defaultValue: created }
    orderMode: { type: "OrderingMode", defaultValue: desc }
    filters: { type: "FilterGroup" }
  ) @refetchable(queryName: "ObservedDatasLinesRefetchQuery") {
    observedDatas(
      search: $search
      first: $count
      after: $cursor
      orderBy: $orderBy
      orderMode: $orderMode
      filters: $filters
    ) @connection(key: "Pagination_observedDatas") {
      edges {
        node {
          id
          created
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
          ...ObservedDatasLine_node
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

const ObservedDatas: FunctionComponent = () => {
  const { t_i18n } = useFormatter();
  const { setTitle } = useConnectedDocumentModifier();
  setTitle(t_i18n('Observed Data | Events'));
  const {
    platformModuleHelpers: { isRuntimeFieldEnable },
  } = useAuth();

  const initialValues = {
    searchTerm: '',
    sortBy: 'last_observed',
    orderAsc: false,
    openExports: false,
    filters: emptyFilterGroup,
  };
  const {
    viewStorage,
    helpers: storageHelpers,
    paginationOptions,
  } = usePaginationLocalStorage<ObservedDatasLinesPaginationQuery$variables>(
    LOCAL_STORAGE_KEY,
    initialValues,
  );
  const {
    filters,
  } = viewStorage;

  const contextFilters = useBuildEntityTypeBasedFilterContext('Observed-Data', filters);
  const queryPaginationOptions = {
    ...paginationOptions, filters: contextFilters,
  } as unknown as ObservedDatasLinesPaginationQuery$variables;

  const queryRef = useQueryLoading<ObservedDatasLinesPaginationQuery>(
    observedDatasLinesQuery,
    queryPaginationOptions,
  );

  const isRuntimeSort = isRuntimeFieldEnable();
  const dataColumns: DataTableProps['dataColumns'] = {
    name: {
      id: 'name',
      percentWidth: 29,
      isSortable: false,
      render: (data) => {
        const name = data.name || data.id;
        const link = `${resolveLink('Observed-Data')}/${data.id}`;
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
    number_observed: {
      id: 'number_observed',
      render: ({ number_observed }, { n }) => (
        <Tooltip title={number_observed}>
          <>{n(number_observed)}</>
        </Tooltip>
      ),
    },
    first_observed: {
      id: 'first_observed',
      render: ({ first_observed }, { nsdt }) => (
        <Tooltip title={nsdt(first_observed)}>
          <span>{nsdt(first_observed)}</span>
        </Tooltip>
      ),
    },
    last_observed: {
      id: 'last_observed',
      render: ({ last_observed }, { nsdt }) => (
        <Tooltip title={nsdt(last_observed)}>
          <span>{nsdt(last_observed)}</span>
        </Tooltip>
      ),
    },
    createdBy: {
      id: 'createdBy',
      isSortable: isRuntimeSort,
      render: ({ createdBy }) => (
        <span style={{ color: 'var(--ravin-text-muted)' }}>
          {defaultRender(createdBy?.name)}
        </span>
      ),
    },
    objectLabel: {
      id: 'objectLabel',
      render: ({ objectLabel }, { storageHelpers: { handleAddFilter } }) => {
        if (!objectLabel || objectLabel.length === 0) return EMPTY_VALUE;
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
      id: 'objectMarking',
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

  const preloadedPaginationProps = {
    linesQuery: observedDatasLinesQuery,
    linesFragment: observedDatasLinesFragment,
    queryRef,
    nodePath: ['observedDatas', 'pageInfo', 'globalCount'],
    setNumberOfElements: storageHelpers.handleSetNumberOfElements,
  } as UsePreloadedPaginationFragment<ObservedDatasLinesPaginationQuery>;

  const createButton = (
    <Security needs={[KNOWLEDGE_KNUPDATE]}>
      <ObservedDataCreation paginationOptions={queryPaginationOptions} />
    </Security>
  );

  return (
    <span data-testid="observed-data">
      <Breadcrumbs elements={[{ label: t_i18n('Events') }, { label: t_i18n('Observed datas'), current: true }]} />
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
                {t_i18n('Observed datas')}
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
              {t_i18n('Observed cyber events and activities')}
            </Typography>
          </Box>
          {createButton}
        </Box>
        {queryRef && (
          <DataTable
            dataColumns={dataColumns}
            resolvePath={(data: ObservedDatasLines_data$data) => data.observedDatas?.edges?.map((n) => n?.node)}
            storageKey={LOCAL_STORAGE_KEY}
            initialValues={initialValues}
            contextFilters={contextFilters}
            preloadedPaginationProps={preloadedPaginationProps}
            lineFragment={observedDataFragment}
            exportContext={{ entity_type: 'Observed-Data' }}
            emptyStateMessage={t_i18n('No observed data yet. Create one to start tracking cyber events and activities.')}
          />
        )}
      </Box>
    </span>
  );
};

export default ObservedDatas;
