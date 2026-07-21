import React, { FunctionComponent } from 'react';
import { graphql } from 'react-relay';
import { Box, Typography, Tooltip } from '@mui/material';
import { AdministrativeAreasPaginationQuery, AdministrativeAreasPaginationQuery$variables } from './__generated__/AdministrativeAreasPaginationQuery.graphql';
import { AdministrativeAreasData_data$data } from './__generated__/AdministrativeAreasData_data.graphql';
import { AdministrativeAreasLinesPaginationQuery$variables } from './administrative_areas/__generated__/AdministrativeAreasLinesPaginationQuery.graphql';
import Security from '../../../utils/Security';
import { KNOWLEDGE_KNUPDATE } from '../../../utils/hooks/useGranted';
import useAuth from '../../../utils/hooks/useAuth';
import AdministrativeAreaCreation from './administrative_areas/AdministrativeAreaCreation';
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

const LOCAL_STORAGE_KEY = 'administrative-areas';

const administrativeAreaLineFragment = graphql`
  fragment AdministrativeAreasLine_node on AdministrativeArea {
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

const administrativeAreasQuery = graphql`
  query AdministrativeAreasPaginationQuery(
    $search: String
    $count: Int!
    $cursor: ID
    $orderBy: AdministrativeAreasOrdering
    $orderMode: OrderingMode
    $filters: FilterGroup
  ) {
    ...AdministrativeAreasData_data
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

const administrativeAreasFragment = graphql`
  fragment AdministrativeAreasData_data on Query
  @argumentDefinitions(
    search: { type: "String" }
    count: { type: "Int", defaultValue: 25 }
    cursor: { type: "ID" }
    orderBy: { type: "AdministrativeAreasOrdering", defaultValue: name }
    orderMode: { type: "OrderingMode", defaultValue: asc }
    filters: { type: "FilterGroup" }
  )
  @refetchable(queryName: "AdministrativeAreasRefetchQuery") {
    administrativeAreas(
      search: $search
      first: $count
      after: $cursor
      orderBy: $orderBy
      orderMode: $orderMode
      filters: $filters
    ) @connection(key: "Pagination_administrativeAreas") {
      edges {
        node {
          ...AdministrativeAreasLine_node
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

const AdministrativeAreas: FunctionComponent = () => {
  const { t_i18n } = useFormatter();
  const { setTitle } = useConnectedDocumentModifier();
  setTitle(t_i18n('Administrative Areas | Locations'));
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
  const { viewStorage, paginationOptions, helpers: storageHelpers } = usePaginationLocalStorage<AdministrativeAreasPaginationQuery$variables>(
    LOCAL_STORAGE_KEY,
    initialValues,
  );

  const contextFilters = useBuildEntityTypeBasedFilterContext('Administrative-Area', viewStorage.filters);
  const queryPaginationOptions = {
    ...paginationOptions,
    filters: contextFilters,
  } as unknown as AdministrativeAreasPaginationQuery$variables;
  const queryRef = useQueryLoading<AdministrativeAreasPaginationQuery>(
    administrativeAreasQuery,
    queryPaginationOptions,
  );

  const dataColumns: DataTableProps['dataColumns'] = {
    name: {
      percentWidth: 30,
      isSortable: isRuntimeSort,
      render: (data) => {
        const value = data.name || data.id;
        const link = `${resolveLink('Administrative-Area')}/${data.id}`;
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
    linesQuery: administrativeAreasQuery,
    linesFragment: administrativeAreasFragment,
    queryRef,
    nodePath: ['administrativeAreas', 'pageInfo', 'globalCount'],
    setNumberOfElements: storageHelpers.handleSetNumberOfElements,
  } as UsePreloadedPaginationFragment<AdministrativeAreasPaginationQuery>;

  const createButton = (
    <Security needs={[KNOWLEDGE_KNUPDATE]}>
      <AdministrativeAreaCreation paginationOptions={queryPaginationOptions as unknown as AdministrativeAreasLinesPaginationQuery$variables} />
    </Security>
  );

  return (
    <div data-testid="administrative-area-page">
      <ExportContextProvider>
        <Breadcrumbs elements={[{ label: t_i18n('Locations') }, { label: t_i18n('Administrative areas'), current: true }]} />
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
                  {t_i18n('Administrative areas')}
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
                {t_i18n('Administrative areas and subdivisions tracked in the intelligence workspace')}
              </Typography>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, flexShrink: 0 }}>
              {createButton}
            </Box>
          </Box>
          {queryRef && (
            <DataTable
              dataColumns={dataColumns}
              resolvePath={(data: AdministrativeAreasData_data$data) => data.administrativeAreas?.edges?.map((n) => n?.node)}
              storageKey={LOCAL_STORAGE_KEY}
              initialValues={initialValues}
              contextFilters={contextFilters}
              lineFragment={administrativeAreaLineFragment}
              preloadedPaginationProps={preloadedPaginationOptions}
              exportContext={{ entity_type: 'Administrative-Area' }}
              emptyStateMessage={t_i18n('No administrative areas yet. Create one to start tracking administrative areas and subdivisions.')}
            />
          )}
        </Box>
      </ExportContextProvider>
    </div>
  );
};

export default AdministrativeAreas;
