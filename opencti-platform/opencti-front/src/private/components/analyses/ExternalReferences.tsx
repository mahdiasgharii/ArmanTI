import React, { FunctionComponent } from 'react';
import { graphql } from 'react-relay';
import { Box, Typography } from '@mui/material';
import {
  ExternalReferencesLinesPaginationQuery,
  ExternalReferencesLinesPaginationQuery$variables,
} from '@components/analyses/__generated__/ExternalReferencesLinesPaginationQuery.graphql';
import { ExternalReferencesLines_data$data } from '@components/analyses/__generated__/ExternalReferencesLines_data.graphql';
import ExternalReferenceCreation from './external_references/ExternalReferenceCreation';
import Security from '../../../utils/Security';
import { usePaginationLocalStorage } from '../../../utils/hooks/useLocalStorage';
import { KNOWLEDGE_KNUPDATE } from '../../../utils/hooks/useGranted';
import useAuth from '../../../utils/hooks/useAuth';
import useQueryLoading from '../../../utils/hooks/useQueryLoading';
import { emptyFilterGroup, useBuildEntityTypeBasedFilterContext } from '../../../utils/filters/filtersUtils';
import { useFormatter } from '../../../components/i18n';
import Breadcrumbs from '../../../components/Breadcrumbs';
import useConnectedDocumentModifier from '../../../utils/hooks/useConnectedDocumentModifier';
import DataTable from '../../../components/dataGrid/DataTable';
import { DataTableProps } from '../../../components/dataGrid/dataTableTypes';
import { UsePreloadedPaginationFragment } from '../../../utils/hooks/usePreloadedPaginationFragment';

const LOCAL_STORAGE_KEY = 'externalReferences';

interface ExternalReferencesProps {
  history: History;
  location: Location;
}

const externalReferencesLineFragment = graphql`
  fragment ExternalReferencesLine_node on ExternalReference {
    id
    entity_type
    source_name
    external_id
    url
    created
    draftVersion {
      draft_id
      draft_operation
    }
    creators {
      id
      name
    }
  }
`;

const externalReferencesLinesQuery = graphql`
  query ExternalReferencesLinesPaginationQuery(
    $search: String
    $count: Int!
    $cursor: ID
    $orderBy: ExternalReferencesOrdering
    $orderMode: OrderingMode
    $filters: FilterGroup
  ) {
    ...ExternalReferencesLines_data
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

const externalReferencesLinesFragment = graphql`
  fragment ExternalReferencesLines_data on Query
  @argumentDefinitions(
    search: { type: "String" }
    count: { type: "Int", defaultValue: 25 }
    cursor: { type: "ID" }
    orderBy: { type: "ExternalReferencesOrdering", defaultValue: source_name }
    orderMode: { type: "OrderingMode", defaultValue: asc }
    filters: { type: "FilterGroup" }
  )
  @refetchable(queryName: "ExternalReferencesLinesRefetchQuery") {
    externalReferences(
      search: $search
      first: $count
      after: $cursor
      orderBy: $orderBy
      orderMode: $orderMode
      filters: $filters
    ) @connection(key: "Pagination_externalReferences") {
      edges {
        node {
          id
          ...ExternalReferencesLine_node
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

const ExternalReferences: FunctionComponent<ExternalReferencesProps> = () => {
  const { t_i18n } = useFormatter();
  const { setTitle } = useConnectedDocumentModifier();
  setTitle(t_i18n('External References | Analyses'));
  const {
    platformModuleHelpers: { isRuntimeFieldEnable },
  } = useAuth();

  const initialValues = {
    searchTerm: '',
    sortBy: 'created',
    orderAsc: true,
    openExports: false,
    filters: emptyFilterGroup,
  };
  const { viewStorage, helpers: storageHelpers, paginationOptions } = usePaginationLocalStorage<ExternalReferencesLinesPaginationQuery$variables>(
    LOCAL_STORAGE_KEY,
    initialValues,
  );
  const { filters } = viewStorage;

  const contextFilters = useBuildEntityTypeBasedFilterContext('External-Reference', filters);
  const queryPaginationOptions = {
    ...paginationOptions,
    filters: contextFilters,
  } as unknown as ExternalReferencesLinesPaginationQuery$variables;
  const queryRef = useQueryLoading<ExternalReferencesLinesPaginationQuery>(
    externalReferencesLinesQuery,
    queryPaginationOptions,
  );
  const isRuntimeSort = isRuntimeFieldEnable() ?? false;
  const dataColumns: DataTableProps['dataColumns'] = {
    source_name: {},
    external_id: {},
    url: {},
    creator: {
      percentWidth: 15,
      isSortable: isRuntimeSort,
    },
    created: {},
  };

  const preloadedPaginationProps = {
    linesQuery: externalReferencesLinesQuery,
    linesFragment: externalReferencesLinesFragment,
    queryRef,
    nodePath: ['externalReferences', 'pageInfo', 'globalCount'],
    setNumberOfElements: storageHelpers.handleSetNumberOfElements,
  } as UsePreloadedPaginationFragment<ExternalReferencesLinesPaginationQuery>;
  const createButton = (
    <Security needs={[KNOWLEDGE_KNUPDATE]}>
      <ExternalReferenceCreation
        paginationOptions={queryPaginationOptions}
        openContextual={false}
      />
    </Security>
  );
  return (
    <span data-testid="external-reference-page">
      <Breadcrumbs elements={[{ label: t_i18n('Analyses') }, { label: t_i18n('External references'), current: true }]} />
      <Box sx={{ padding: '24px 24px 0 24px', borderRadius: '0.625rem' }}>
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: 2,
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
            <Typography
              variant="h1"
              sx={{
                margin: 0,
                fontSize: 24,
                fontWeight: 600,
                textTransform: 'lowercase',
                '&::first-letter': { textTransform: 'uppercase' },
              }}
            >
              {t_i18n('External references')}
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
          {createButton}
        </Box>
        {queryRef && (
          <DataTable
            dataColumns={dataColumns}
            resolvePath={(data: ExternalReferencesLines_data$data) => data.externalReferences?.edges?.map((n) => n?.node)}
            storageKey={LOCAL_STORAGE_KEY}
            initialValues={initialValues}
            contextFilters={contextFilters}
            preloadedPaginationProps={preloadedPaginationProps}
            lineFragment={externalReferencesLineFragment}
            entityTypes={['External-Reference']}
            exportContext={{ entity_type: 'External-Reference' }}
            emptyStateMessage={t_i18n('No external references yet. Create one to link threat intelligence to external sources.')}
          />
        )}
      </Box>
    </span>
  );
};

export default ExternalReferences;
