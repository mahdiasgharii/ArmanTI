import React from 'react';
import { graphql } from 'react-relay';
import Box from '@mui/material/Box';
import Tooltip from '@mui/material/Tooltip';
import Typography from '@mui/material/Typography';
import { DatabaseExportOutline } from 'mdi-material-ui';
import { ErrorBoundary } from '@components/Error';
import {
  TaxiiDataTablePaginationQuery,
  TaxiiDataTablePaginationQuery$variables,
} from '@components/data/__generated__/TaxiiDataTablePaginationQuery.graphql';
import { TaxiiDataTable_data$data } from '@components/data/__generated__/TaxiiDataTable_data.graphql';
import Security from '../../../utils/Security';
import { TAXIIAPI_SETCOLLECTIONS } from '../../../utils/hooks/useGranted';
import { usePaginationLocalStorage } from '../../../utils/hooks/useLocalStorage';
import useQueryLoading from '../../../utils/hooks/useQueryLoading';
import { UsePreloadedPaginationFragment } from '../../../utils/hooks/usePreloadedPaginationFragment';
import { useFormatter } from '../../../components/i18n';
import Breadcrumbs from '../../../components/Breadcrumbs';
import DataTable from '../../../components/dataGrid/DataTable';
import { DataTableProps } from '../../../components/dataGrid/dataTableTypes';
import ItemCopy from '../../../components/ItemCopy';
import FilterIconButton from '../../../components/FilterIconButton';
import useConnectedDocumentModifier from '../../../utils/hooks/useConnectedDocumentModifier';
import TaxiiCollectionCreation from './taxii/TaxiiCollectionCreation';
import TaxiiPopover from './taxii/TaxiiPopover';
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

const LOCAL_STORAGE_KEY = 'taxii';

const taxiiLineFragment = graphql`
  fragment TaxiiDataTableLine_node on TaxiiCollection {
    id
    name
    description
    filters
  }
`;

export const taxiiLinesQuery = graphql`
  query TaxiiDataTablePaginationQuery(
    $search: String
    $count: Int!
    $cursor: ID
    $orderBy: TaxiiCollectionOrdering
    $orderMode: OrderingMode
  ) {
    ...TaxiiDataTable_data
      @arguments(
        search: $search
        count: $count
        cursor: $cursor
        orderBy: $orderBy
        orderMode: $orderMode
      )
  }
`;

export const taxiiLinesFragment = graphql`
  fragment TaxiiDataTable_data on Query
  @argumentDefinitions(
    search: { type: "String" }
    count: { type: "Int", defaultValue: 25 }
    cursor: { type: "ID" }
    orderBy: { type: "TaxiiCollectionOrdering", defaultValue: name }
    orderMode: { type: "OrderingMode", defaultValue: asc }
  )
  @refetchable(queryName: "TaxiiDataTableRefetchQuery") {
    taxiiCollections(
      search: $search
      first: $count
      after: $cursor
      orderBy: $orderBy
      orderMode: $orderMode
    ) @connection(key: "TaxiiDataTable__taxiiCollections") {
      edges {
        node {
          id
          ...TaxiiDataTableLine_node
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

const Taxii = () => {
  const { t_i18n } = useFormatter();
  const { setTitle } = useConnectedDocumentModifier();
  setTitle(t_i18n('TAXII Collections | Data sharing | Data'));

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
  } = usePaginationLocalStorage<TaxiiDataTablePaginationQuery$variables>(
    LOCAL_STORAGE_KEY,
    initialValues,
  );

  const queryRef = useQueryLoading<TaxiiDataTablePaginationQuery>(
    taxiiLinesQuery,
    paginationOptions as unknown as TaxiiDataTablePaginationQuery$variables,
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
    description: {
      id: 'description',
      label: 'Description',
      isSortable: false,
      percentWidth: 15,
      render: ({ description }) => (
        <span style={{ color: 'var(--ravin-text-muted)' }}>
          {description || EMPTY_VALUE}
        </span>
      ),
    },
    id: {
      id: 'id',
      label: 'Collection',
      isSortable: true,
      percentWidth: 25,
      render: ({ id }) => (
        <ItemCopy content={id} variant="inLine" />
      ),
    },
    filters: {
      id: 'filters',
      label: 'Filters',
      isSortable: false,
      percentWidth: 45,
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
    linesQuery: taxiiLinesQuery,
    linesFragment: taxiiLinesFragment,
    queryRef,
    nodePath: ['taxiiCollections', 'pageInfo', 'globalCount'],
    setNumberOfElements: storageHelpers.handleSetNumberOfElements,
  } as UsePreloadedPaginationFragment<TaxiiDataTablePaginationQuery>;

  const handleLineClick = (line: { id: string }) => {
    window.open(`/taxii2/root/collections/${line.id}/objects/`, '_blank');
  };

  return (
    <div data-testid="taxii-collections-page">
      <Breadcrumbs elements={[{ label: t_i18n('Data') }, { label: t_i18n('Data sharing') }, { label: t_i18n('TAXII collections'), current: true }]} />
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
                {t_i18n('TAXII collections')}
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
              {t_i18n('Expose threat intelligence data via TAXII 2.1 collections')}
            </Typography>
          </Box>
          <Security needs={[TAXIIAPI_SETCOLLECTIONS]}>
            <TaxiiCollectionCreation paginationOptions={paginationOptions as unknown as PaginationOptions} />
          </Security>
        </Box>
        {queryRef && (
          <DataTable
            dataColumns={dataColumns}
            resolvePath={(data: TaxiiDataTable_data$data) => data.taxiiCollections?.edges?.map((n) => n?.node).filter((node): node is NonNullable<typeof node> => node !== undefined)}
            storageKey={LOCAL_STORAGE_KEY}
            initialValues={initialValues}
            lineFragment={taxiiLineFragment}
            preloadedPaginationProps={preloadedPaginationProps}
            icon={() => <DatabaseExportOutline style={{ color: 'var(--ravin-primary)' }} />}
            actions={(row) => (
              <Security needs={[TAXIIAPI_SETCOLLECTIONS]}>
                <ErrorBoundary display={() => null}>
                  <TaxiiPopover
                    taxiiCollectionId={row.id}
                    paginationOptions={paginationOptions as unknown as PaginationOptions}
                  />
                </ErrorBoundary>
              </Security>
            )}
            onLineClick={handleLineClick}
            disableNavigation
            disableLineSelection
            emptyStateMessage={t_i18n('No TAXII collections configured. Create one to start sharing data.')}
          />
        )}
      </Box>
    </div>
  );
};

export default Taxii;
