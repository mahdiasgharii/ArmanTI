import React, { FunctionComponent } from 'react';
import { graphql } from 'react-relay';
import { Box, Typography, Tooltip } from '@mui/material';
import { RegionsPaginationQuery, RegionsPaginationQuery$variables } from './__generated__/RegionsPaginationQuery.graphql';
import { RegionsData_data$data } from './__generated__/RegionsData_data.graphql';
import { RegionsLinesPaginationQuery$variables } from './regions/__generated__/RegionsLinesPaginationQuery.graphql';
import Security from '../../../utils/Security';
import { KNOWLEDGE_KNUPDATE } from '../../../utils/hooks/useGranted';
import useAuth from '../../../utils/hooks/useAuth';
import RegionCreation from './regions/RegionCreation';
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

const LOCAL_STORAGE_KEY = 'regions';

const regionLineFragment = graphql`
  fragment RegionsLine_node on Region {
    id
    entity_type
    parent_types
    name
    created
    modified
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

const regionsQuery = graphql`
  query RegionsPaginationQuery(
    $search: String
    $count: Int!
    $cursor: ID
    $orderBy: RegionsOrdering
    $orderMode: OrderingMode
    $filters: FilterGroup
  ) {
    ...RegionsData_data
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

const regionsFragment = graphql`
  fragment RegionsData_data on Query
  @argumentDefinitions(
    search: { type: "String" }
    count: { type: "Int", defaultValue: 25 }
    cursor: { type: "ID" }
    orderBy: { type: "RegionsOrdering", defaultValue: name }
    orderMode: { type: "OrderingMode", defaultValue: asc }
    filters: { type: "FilterGroup" }
  )
  @refetchable(queryName: "RegionsRefetchQuery") {
    regions(
      search: $search
      first: $count
      after: $cursor
      orderBy: $orderBy
      orderMode: $orderMode
      filters: $filters
    ) @connection(key: "Pagination_regions") {
      edges {
        node {
          ...RegionsLine_node
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

const Regions: FunctionComponent = () => {
  const { t_i18n } = useFormatter();
  const { setTitle } = useConnectedDocumentModifier();
  setTitle(t_i18n('Regions | Locations'));
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
  const { viewStorage, paginationOptions, helpers: storageHelpers } = usePaginationLocalStorage<RegionsPaginationQuery$variables>(
    LOCAL_STORAGE_KEY,
    initialValues,
  );

  const contextFilters = useBuildEntityTypeBasedFilterContext('Region', viewStorage.filters);
  const queryPaginationOptions = {
    ...paginationOptions,
    filters: contextFilters,
  } as unknown as RegionsPaginationQuery$variables;
  const queryRef = useQueryLoading<RegionsPaginationQuery>(
    regionsQuery,
    queryPaginationOptions,
  );

  const dataColumns: DataTableProps['dataColumns'] = {
    name: {
      percentWidth: 30,
      isSortable: isRuntimeSort,
      render: (data) => {
        const value = data.name || data.id;
        const link = `${resolveLink('Region')}/${data.id}`;
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
    createdBy: {
      percentWidth: 15,
      isSortable: isRuntimeSort,
      render: ({ createdBy }) => (
        <span style={{ color: 'var(--ravin-text-muted)' }}>
          {createdBy?.name ?? EMPTY_VALUE}
        </span>
      ),
    },
    creator: {
      percentWidth: 15,
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
      percentWidth: 17,
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
    created: {
      percentWidth: 13,
      isSortable: isRuntimeSort,
      render: ({ created }, { fd, nsdt }) => (
        <Tooltip title={nsdt(created)}>
          <span>{fd(created)}</span>
        </Tooltip>
      ),
    },
    modified: {
      percentWidth: 13,
      isSortable: isRuntimeSort,
      render: ({ modified }, { fd, nsdt }) => (
        <Tooltip title={nsdt(modified)}>
          <span>{fd(modified)}</span>
        </Tooltip>
      ),
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
    linesQuery: regionsQuery,
    linesFragment: regionsFragment,
    queryRef,
    nodePath: ['regions', 'pageInfo', 'globalCount'],
    setNumberOfElements: storageHelpers.handleSetNumberOfElements,
  } as UsePreloadedPaginationFragment<RegionsPaginationQuery>;

  const createButton = (
    <Security needs={[KNOWLEDGE_KNUPDATE]}>
      <RegionCreation paginationOptions={queryPaginationOptions as unknown as RegionsLinesPaginationQuery$variables} />
    </Security>
  );

  return (
    <div data-testid="region-page">
      <ExportContextProvider>
        <Breadcrumbs elements={[{ label: t_i18n('Locations') }, { label: t_i18n('Regions'), current: true }]} />
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
                  {t_i18n('Regions')}
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
                {t_i18n('Geographic regions tracked in the intelligence workspace')}
              </Typography>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, flexShrink: 0 }}>
              {createButton}
            </Box>
          </Box>
          {queryRef && (
            <DataTable
              dataColumns={dataColumns}
              resolvePath={(data: RegionsData_data$data) => data.regions?.edges?.map((n) => n?.node)}
              storageKey={LOCAL_STORAGE_KEY}
              initialValues={initialValues}
              contextFilters={contextFilters}
              lineFragment={regionLineFragment}
              preloadedPaginationProps={preloadedPaginationOptions}
              exportContext={{ entity_type: 'Region' }}
              emptyStateMessage={t_i18n('No regions yet. Create one to start tracking geographic regions.')}
            />
          )}
        </Box>
      </ExportContextProvider>
    </div>
  );
};

export default Regions;
