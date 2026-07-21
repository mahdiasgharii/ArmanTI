import React from 'react';
import MuiAlert from '@mui/material/Alert';
import Box from '@mui/material/Box';
import Tooltip from '@mui/material/Tooltip';
import Typography from '@mui/material/Typography';
import { AccessPoint } from 'mdi-material-ui';
import { graphql } from 'react-relay';
import { ErrorBoundary } from '@components/Error';
import {
  IngestionTaxiisDataTablePaginationQuery,
  IngestionTaxiisDataTablePaginationQuery$variables,
} from '@components/data/__generated__/IngestionTaxiisDataTablePaginationQuery.graphql';
import { IngestionTaxiisDataTable_data$data } from '@components/data/__generated__/IngestionTaxiisDataTable_data.graphql';
import Security from '../../../utils/Security';
import { INGESTION_SETINGESTIONS } from '../../../utils/hooks/useGranted';
import useAuth from '../../../utils/hooks/useAuth';
import { usePaginationLocalStorage } from '../../../utils/hooks/useLocalStorage';
import useQueryLoading from '../../../utils/hooks/useQueryLoading';
import { UsePreloadedPaginationFragment } from '../../../utils/hooks/usePreloadedPaginationFragment';
import { useFormatter } from '../../../components/i18n';
import { INGESTION_MANAGER } from '../../../utils/platformModulesHelper';
import Breadcrumbs from '../../../components/Breadcrumbs';
import DataTable from '../../../components/dataGrid/DataTable';
import { DataTableProps } from '../../../components/dataGrid/dataTableTypes';
import ItemBoolean from '../../../components/ItemBoolean';
import ItemCopy from '../../../components/ItemCopy';
import useConnectedDocumentModifier from '../../../utils/hooks/useConnectedDocumentModifier';
import IngestionTaxiiImport from '@components/data/ingestionTaxii/IngestionTaxiiImport';
import IngestionTaxiiCreation from '@components/data/ingestionTaxii/IngestionTaxiiCreation';
import IngestionTaxiiPopover from '@components/data/ingestionTaxii/IngestionTaxiiPopover';
import { EMPTY_VALUE } from '../../../utils/String';
import { PaginationOptions } from '../../../components/list_lines';

const lowercaseVoiceSx = {
  textTransform: 'lowercase',
  '&::first-letter': { textTransform: 'uppercase' },
} as const;

const LOCAL_STORAGE_KEY = 'ingestionTaxii';

const ingestionTaxiiLineFragment = graphql`
  fragment IngestionTaxiisDataTableLine_node on IngestionTaxii {
    id
    name
    description
    uri
    version
    ingestion_running
    added_after_start
    current_state_cursor
    last_execution_date
    confidence_to_score
  }
`;

export const ingestionTaxiiLinesQuery = graphql`
  query IngestionTaxiisDataTablePaginationQuery(
    $search: String
    $count: Int!
    $cursor: ID
    $orderBy: IngestionTaxiiOrdering
    $orderMode: OrderingMode
  ) {
    ...IngestionTaxiisDataTable_data
      @arguments(
        search: $search
        count: $count
        cursor: $cursor
        orderBy: $orderBy
        orderMode: $orderMode
      )
  }
`;

export const ingestionTaxiiLinesFragment = graphql`
  fragment IngestionTaxiisDataTable_data on Query
  @argumentDefinitions(
    search: { type: "String" }
    count: { type: "Int", defaultValue: 25 }
    cursor: { type: "ID" }
    orderBy: { type: "IngestionTaxiiOrdering", defaultValue: name }
    orderMode: { type: "OrderingMode", defaultValue: asc }
  )
  @refetchable(queryName: "IngestionTaxiisDataTableRefetchQuery") {
    ingestionTaxiis(
      search: $search
      first: $count
      after: $cursor
      orderBy: $orderBy
      orderMode: $orderMode
    ) @connection(key: "Pagination_ingestionTaxiis") {
      edges {
        node {
          id
          ...IngestionTaxiisDataTableLine_node
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

const IngestionTaxii = () => {
  const { t_i18n } = useFormatter();
  const { setTitle } = useConnectedDocumentModifier();

  setTitle(t_i18n('TAXII Feeds | Ingestion | Data'));

  const { platformModuleHelpers } = useAuth();

  const initialValues = {
    searchTerm: '',
    sortBy: 'name',
    orderAsc: false,
    openExports: false,
  };

  const {
    viewStorage,
    paginationOptions,
    helpers: storageHelpers,
  } = usePaginationLocalStorage<IngestionTaxiisDataTablePaginationQuery$variables>(
    LOCAL_STORAGE_KEY,
    initialValues,
  );

  const queryRef = useQueryLoading<IngestionTaxiisDataTablePaginationQuery>(
    ingestionTaxiiLinesQuery,
    paginationOptions as unknown as IngestionTaxiisDataTablePaginationQuery$variables,
  );

  const dataColumns: DataTableProps['dataColumns'] = {
    name: {
      id: 'name',
      label: 'Name',
      isSortable: true,
      percentWidth: 20,
      render: ({ name }) => (
        <Tooltip title={name}>
          <span style={{ color: 'var(--ravin-text)', fontWeight: 500 }}>{name}</span>
        </Tooltip>
      ),
    },
    uri: {
      id: 'uri',
      label: 'URL',
      isSortable: true,
      percentWidth: 25,
      render: ({ uri }) => (
        <span style={{ color: 'var(--ravin-text-muted)' }}>{uri}</span>
      ),
    },
    ingestion_running: {
      id: 'ingestion_running',
      label: 'Status',
      isSortable: false,
      percentWidth: 12,
      render: ({ ingestion_running }) => (
        <ItemBoolean
          label={ingestion_running ? t_i18n('Active') : t_i18n('Inactive')}
          status={!!ingestion_running}
          labelTextTransform="lowercase"
        />
      ),
    },
    last_execution_date: {
      id: 'last_execution_date',
      label: 'Last run',
      isSortable: false,
      percentWidth: 15,
      render: ({ last_execution_date }, { fldt }) => (
        <span style={{ color: 'var(--ravin-text-muted)' }}>
          {fldt(last_execution_date) || EMPTY_VALUE}
        </span>
      ),
    },
    added_after_start: {
      id: 'added_after_start',
      label: 'Added after date',
      isSortable: false,
      percentWidth: 13,
      render: ({ added_after_start }) => (
        <ItemCopy content={added_after_start || EMPTY_VALUE} variant="inLine" />
      ),
    },
    current_state_cursor: {
      id: 'current_state_cursor',
      label: 'Next cursor',
      isSortable: false,
      percentWidth: 15,
      render: ({ current_state_cursor }) => (
        <ItemCopy content={current_state_cursor || EMPTY_VALUE} variant="inLine" />
      ),
    },
  };

  const preloadedPaginationProps = {
    linesQuery: ingestionTaxiiLinesQuery,
    linesFragment: ingestionTaxiiLinesFragment,
    queryRef,
    nodePath: ['ingestionTaxiis', 'pageInfo', 'globalCount'],
    setNumberOfElements: storageHelpers.handleSetNumberOfElements,
  } as UsePreloadedPaginationFragment<IngestionTaxiisDataTablePaginationQuery>;

  if (!platformModuleHelpers.isIngestionManagerEnable()) {
    return (
      <div data-testid="taxii-feeds-page" style={{ padding: '24px 24px 0 24px' }}>
        <MuiAlert severity="info">
          {t_i18n(platformModuleHelpers.generateDisableMessage(INGESTION_MANAGER))}
        </MuiAlert>
      </div>
    );
  }

  return (
    <div data-testid="taxii-feeds-page">
      <Breadcrumbs
        elements={[
          { label: t_i18n('Data') },
          { label: t_i18n('Ingestion') },
          { label: t_i18n('TAXII feeds'), current: true },
        ]}
      />
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
                {t_i18n('TAXII feeds')}
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
              {t_i18n('Ingest threat intelligence data from remote TAXII 2.1 servers')}
            </Typography>
          </Box>
          <Security needs={[INGESTION_SETINGESTIONS]}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <IngestionTaxiiImport paginationOptions={paginationOptions as unknown as PaginationOptions} />
              <IngestionTaxiiCreation paginationOptions={paginationOptions as unknown as PaginationOptions} />
            </Box>
          </Security>
        </Box>
        {queryRef && (
          <DataTable
            dataColumns={dataColumns}
            resolvePath={(data: IngestionTaxiisDataTable_data$data) => data.ingestionTaxiis?.edges?.map((n) => n?.node).filter((node): node is NonNullable<typeof node> => node !== undefined)}
            storageKey={LOCAL_STORAGE_KEY}
            initialValues={initialValues}
            lineFragment={ingestionTaxiiLineFragment}
            preloadedPaginationProps={preloadedPaginationProps}
            icon={() => <AccessPoint style={{ color: 'var(--ravin-primary)' }} />}
            actions={(row) => (
              <Security needs={[INGESTION_SETINGESTIONS]}>
                <ErrorBoundary display={() => null}>
                  <IngestionTaxiiPopover
                    ingestionTaxiiId={row.id}
                    running={row.ingestion_running}
                    paginationOptions={paginationOptions as unknown as PaginationOptions}
                  />
                </ErrorBoundary>
              </Security>
            )}
            disableNavigation
            disableLineSelection
            emptyStateMessage={t_i18n('No TAXII feeds configured. Create one to start ingesting data.')}
          />
        )}
      </Box>
    </div>
  );
};

export default IngestionTaxii;
