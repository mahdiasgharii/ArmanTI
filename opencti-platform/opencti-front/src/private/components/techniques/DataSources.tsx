import React, { FunctionComponent } from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Tooltip from '@mui/material/Tooltip';
import { graphql } from 'react-relay';
import { DataSourcesLines_data$data } from '@components/techniques/__generated__/DataSourcesLines_data.graphql';
import { DataSourcesLinesPaginationQuery, DataSourcesLinesPaginationQuery$variables } from '@components/techniques/__generated__/DataSourcesLinesPaginationQuery.graphql';
import { usePaginationLocalStorage } from '../../../utils/hooks/useLocalStorage';
import Security from '../../../utils/Security';
import { KNOWLEDGE_KNUPDATE } from '../../../utils/hooks/useGranted';
import useQueryLoading from '../../../utils/hooks/useQueryLoading';
import DataSourceCreation from './data_sources/DataSourceCreation';
import { emptyFilterGroup, useBuildEntityTypeBasedFilterContext } from '../../../utils/filters/filtersUtils';
import { useFormatter } from '../../../components/i18n';
import Breadcrumbs from '../../../components/Breadcrumbs';
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

export const LOCAL_STORAGE_KEY_DATA_SOURCES = 'dataSources';

const dataSourceLineFragment = graphql`
  fragment DataSourcesLine_node on DataSource {
    id
    name
    entity_type
    description
    created
    modified
    x_mitre_platforms
    collection_layers
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

const dataSourcesLinesQuery = graphql`
  query DataSourcesLinesPaginationQuery(
    $search: String
    $count: Int!
    $cursor: ID
    $orderBy: DataSourcesOrdering
    $orderMode: OrderingMode
    $filters: FilterGroup
  ) {
    ...DataSourcesLines_data
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

const dataSourcesLinesFragment = graphql`
  fragment DataSourcesLines_data on Query
  @argumentDefinitions(
    search: { type: "String" }
    count: { type: "Int", defaultValue: 25 }
    cursor: { type: "ID" }
    orderBy: { type: "DataSourcesOrdering", defaultValue: name }
    orderMode: { type: "OrderingMode", defaultValue: asc }
    filters: { type: "FilterGroup" }
  )
  @refetchable(queryName: "DataSourcesLinesRefetchQuery") {
    dataSources(
      search: $search
      first: $count
      after: $cursor
      orderBy: $orderBy
      orderMode: $orderMode
      filters: $filters
    ) @connection(key: "Pagination_dataSources") {
      edges {
        node {
          id
          name
          description
          ...DataSourcesLine_node
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

const DataSources: FunctionComponent = () => {
  const { t_i18n } = useFormatter();
  const { setTitle } = useConnectedDocumentModifier();
  setTitle(t_i18n('Data Sources | Techniques'));

  const initialValues = {
    searchTerm: '',
    sortBy: 'name',
    orderAsc: true,
    openExports: false,
    filters: emptyFilterGroup,
  };
  const {
    viewStorage,
    helpers: storageHelpers,
    paginationOptions,
  } = usePaginationLocalStorage<DataSourcesLinesPaginationQuery$variables>(
    LOCAL_STORAGE_KEY_DATA_SOURCES,
    initialValues,
  );

  const { filters } = viewStorage;

  const contextFilters = useBuildEntityTypeBasedFilterContext('Data-Source', filters);
  const queryPaginationOptions = {
    ...paginationOptions,
    filters: contextFilters,
  } as unknown as DataSourcesLinesPaginationQuery$variables;

  const dataColumns: DataTableProps['dataColumns'] = {
    name: {
      percentWidth: 30,
      render: (data) => {
        const name = data.name || data.id;
        const link = `${resolveLink('Data-Source')}/${data.id}`;
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
      percentWidth: 17,
      render: ({ created }, { rd, nsdt }) => (
        <Tooltip title={nsdt(created)}>
          <span style={{ color: 'var(--ravin-text-muted)' }}>{rd(created)}</span>
        </Tooltip>
      ),
    },
    modified: {
      percentWidth: 17,
      render: ({ modified }, { rd, nsdt }) => (
        <Tooltip title={nsdt(modified)}>
          <span style={{ color: 'var(--ravin-text-muted)' }}>{rd(modified)}</span>
        </Tooltip>
      ),
    },
    objectMarking: {
      percentWidth: 16,
    },
  };

  const queryRef = useQueryLoading<DataSourcesLinesPaginationQuery>(
    dataSourcesLinesQuery,
    queryPaginationOptions,
  );

  const preloadedPaginationOptions = {
    linesQuery: dataSourcesLinesQuery,
    linesFragment: dataSourcesLinesFragment,
    queryRef,
    nodePath: ['dataSources', 'pageInfo', 'globalCount'],
    setNumberOfElements: storageHelpers.handleSetNumberOfElements,
  } as UsePreloadedPaginationFragment<DataSourcesLinesPaginationQuery>;

  const createButton = (
    <Security needs={[KNOWLEDGE_KNUPDATE]}>
      <DataSourceCreation paginationOptions={queryPaginationOptions} />
    </Security>
  );

  return (
    <div data-testid="data-source-page">
      <Breadcrumbs elements={[{ label: t_i18n('Techniques') }, { label: t_i18n('Data sources'), current: true }]} />
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
                {t_i18n('Data sources')}
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
              {t_i18n('Track data sources for detecting adversarial techniques and behaviors')}
            </Typography>
          </Box>
          {createButton}
        </Box>
        {queryRef && (
          <DataTable
            dataColumns={dataColumns}
            resolvePath={(data: DataSourcesLines_data$data) => data.dataSources?.edges?.map((e) => e?.node)}
            storageKey={LOCAL_STORAGE_KEY_DATA_SOURCES}
            initialValues={initialValues}
            contextFilters={contextFilters}
            preloadedPaginationProps={preloadedPaginationOptions}
            lineFragment={dataSourceLineFragment}
            exportContext={{ entity_type: 'Data-Source' }}
            emptyStateMessage={t_i18n('No data sources yet. Create one to track detection sources for adversarial techniques.')}
          />
        )}
      </Box>
    </div>
  );
};

export default DataSources;
