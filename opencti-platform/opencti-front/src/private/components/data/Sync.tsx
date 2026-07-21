import React, { useState } from 'react';
import { graphql } from 'react-relay';
import MuiAlert from '@mui/material/Alert';
import Box from '@mui/material/Box';
import Chip from '@mui/material/Chip';
import Tooltip from '@mui/material/Tooltip';
import Typography from '@mui/material/Typography';
import { ErrorBoundary } from '@components/Error';
import {
  SyncDataTablePaginationQuery,
  SyncDataTablePaginationQuery$variables,
} from '@components/data/sync/__generated__/SyncDataTablePaginationQuery.graphql';
import { SyncDataTable_data$data } from '@components/data/sync/__generated__/SyncDataTable_data.graphql';
import { DatabaseImportOutline } from 'mdi-material-ui';
import Security from '../../../utils/Security';
import { INGESTION_SETINGESTIONS } from '../../../utils/hooks/useGranted';
import useAuth from '../../../utils/hooks/useAuth';
import { usePaginationLocalStorage } from '../../../utils/hooks/useLocalStorage';
import useQueryLoading from '../../../utils/hooks/useQueryLoading';
import { UsePreloadedPaginationFragment } from '../../../utils/hooks/usePreloadedPaginationFragment';
import { useFormatter } from '../../../components/i18n';
import { SYNC_MANAGER } from '../../../utils/platformModulesHelper';
import Breadcrumbs from '../../../components/Breadcrumbs';
import DataTable from '../../../components/dataGrid/DataTable';
import { DataTableProps } from '../../../components/dataGrid/dataTableTypes';
import ItemBoolean from '../../../components/ItemBoolean';
import useConnectedDocumentModifier from '../../../utils/hooks/useConnectedDocumentModifier';
import SyncImport from '@components/data/SyncImport';
import SyncCreation from './sync/SyncCreation';
import SyncPopover from './sync/SyncPopover';
import SyncConsumersDrawer from './sync/SyncConsumersDrawer';
import { EMPTY_VALUE } from '../../../utils/String';
import { PaginationOptions } from '../../../components/list_lines';

const lowercaseVoiceSx = {
  textTransform: 'lowercase',
  '&::first-letter': { textTransform: 'uppercase' },
} as const;

const LOCAL_STORAGE_KEY = 'sync';

const syncLineFragment = graphql`
  fragment SyncDataTableLine_node on Synchronizer {
    id
    name
    uri
    stream_id
    running
    current_state_date
    queue_messages
    ssl_verify
    consumer_metrics {
      connectionId
      estimatedOutOfDepth
    }
  }
`;

export const syncLinesQuery = graphql`
  query SyncDataTablePaginationQuery(
    $search: String
    $count: Int!
    $cursor: ID
    $orderBy: SynchronizersOrdering
    $orderMode: OrderingMode
  ) {
    ...SyncDataTable_data
      @arguments(
        search: $search
        count: $count
        cursor: $cursor
        orderBy: $orderBy
        orderMode: $orderMode
      )
  }
`;

export const syncLinesFragment = graphql`
  fragment SyncDataTable_data on Query
  @argumentDefinitions(
    search: { type: "String" }
    count: { type: "Int", defaultValue: 25 }
    cursor: { type: "ID" }
    orderBy: { type: "SynchronizersOrdering", defaultValue: name }
    orderMode: { type: "OrderingMode", defaultValue: asc }
  )
  @refetchable(queryName: "SyncDataTableRefetchQuery") {
    synchronizers(
      search: $search
      first: $count
      after: $cursor
      orderBy: $orderBy
      orderMode: $orderMode
    ) @connection(key: "SyncDataTable__synchronizers") {
      edges {
        node {
          id
          ...SyncDataTableLine_node
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

const computeConsumerHealth = (estimatedOutOfDepth: number | null | undefined, t_i18n: (key: string) => string) => {
  if (!estimatedOutOfDepth && estimatedOutOfDepth !== 0) {
    return { label: t_i18n('No data'), hexColor: null };
  }
  const ONE_HOUR = 3600;
  const ONE_DAY = 86400;
  if (estimatedOutOfDepth > 0 && estimatedOutOfDepth < ONE_HOUR) {
    return { label: t_i18n('At risk'), hexColor: '#c62828' };
  }
  if (estimatedOutOfDepth >= ONE_HOUR && estimatedOutOfDepth < ONE_DAY) {
    return { label: t_i18n('Degraded'), hexColor: '#d84315' };
  }
  return { label: t_i18n('Healthy'), hexColor: '#2e7d32' };
};

const Sync = () => {
  const { t_i18n } = useFormatter();
  const { setTitle } = useConnectedDocumentModifier();
  const { platformModuleHelpers } = useAuth();

  setTitle(t_i18n('Remote OCTI Streams | Ingestion | Data'));

  const [drawerOpen, setDrawerOpen] = useState(false);
  const [selectedSync, setSelectedSync] = useState<{ id: string; name: string } | null>(null);

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
  } = usePaginationLocalStorage<SyncDataTablePaginationQuery$variables>(
    LOCAL_STORAGE_KEY,
    initialValues,
  );

  const queryRef = useQueryLoading<SyncDataTablePaginationQuery>(
    syncLinesQuery,
    paginationOptions as unknown as SyncDataTablePaginationQuery$variables,
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
      percentWidth: 20,
      render: ({ uri }) => (
        <span style={{ color: 'var(--ravin-text-muted)' }}>{uri}</span>
      ),
    },
    messages: {
      id: 'messages',
      label: 'Messages',
      isSortable: false,
      percentWidth: 8,
      render: ({ queue_messages }, { n }) => (
        <span style={{ color: 'var(--ravin-text-muted)' }}>{n(queue_messages)}</span>
      ),
    },
    running: {
      id: 'running',
      label: 'Status',
      isSortable: false,
      percentWidth: 10,
      render: ({ running }) => (
        <ItemBoolean
          label={running ? t_i18n('Active') : t_i18n('Inactive')}
          status={running}
          labelTextTransform="lowercase"
        />
      ),
    },
    current_state_date: {
      id: 'current_state_date',
      label: 'Current state',
      isSortable: true,
      percentWidth: 15,
      render: ({ current_state_date }, { nsdt }) => (
        <span style={{ color: 'var(--ravin-text-muted)' }}>
          {current_state_date ? nsdt(current_state_date) : EMPTY_VALUE}
        </span>
      ),
    },
    producer: {
      id: 'producer',
      label: 'Producer',
      isSortable: false,
      percentWidth: 25,
      render: ({ consumer_metrics }) => {
        const health = computeConsumerHealth(consumer_metrics?.estimatedOutOfDepth, t_i18n);
        if (!health.hexColor) {
          return <span style={{ color: 'var(--ravin-text-light)' }}>-</span>;
        }
        return (
          <Chip
            label={health.label}
            size="small"
            style={{
              fontSize: 12,
              lineHeight: '12px',
              borderRadius: 4,
              height: 20,
              backgroundColor: `${health.hexColor}33`,
              color: health.hexColor,
              border: `1px solid ${health.hexColor}`,
            }}
          />
        );
      },
    },
  };

  const preloadedPaginationProps = {
    linesQuery: syncLinesQuery,
    linesFragment: syncLinesFragment,
    queryRef,
    nodePath: ['synchronizers', 'pageInfo', 'globalCount'],
    setNumberOfElements: storageHelpers.handleSetNumberOfElements,
  } as UsePreloadedPaginationFragment<SyncDataTablePaginationQuery>;

  if (!platformModuleHelpers.isSyncManagerEnable()) {
    return (
      <div data-testid="streams-page" style={{ padding: '24px 24px 0 24px' }}>
        <MuiAlert severity="info">
          {t_i18n(platformModuleHelpers.generateDisableMessage(SYNC_MANAGER))}
        </MuiAlert>
      </div>
    );
  }

  const handleLineClick = (line: { id: string; name: string }) => {
    setSelectedSync({ id: line.id, name: line.name });
    setDrawerOpen(true);
  };

  return (
    <div data-testid="streams-page">
      <Breadcrumbs
        elements={[{ label: t_i18n('Data') }, { label: t_i18n('Ingestion') }, { label: t_i18n('OpenCTI Streams'), current: true }]}
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
                {t_i18n('OpenCTI Streams')}
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
              {t_i18n('Synchronize data from remote OpenCTI instances via live streams')}
            </Typography>
          </Box>
          <Security needs={[INGESTION_SETINGESTIONS]}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <SyncImport paginationOptions={paginationOptions as unknown as PaginationOptions} />
              <SyncCreation triggerButton paginationOptions={paginationOptions as unknown as PaginationOptions} />
            </Box>
          </Security>
        </Box>
        {queryRef && (
          <DataTable
            dataColumns={dataColumns}
            resolvePath={(data: SyncDataTable_data$data) => data.synchronizers?.edges?.map((n) => n?.node).filter((node): node is NonNullable<typeof node> => node !== undefined)}
            storageKey={LOCAL_STORAGE_KEY}
            initialValues={initialValues}
            lineFragment={syncLineFragment}
            preloadedPaginationProps={preloadedPaginationProps}
            icon={() => <DatabaseImportOutline style={{ color: 'var(--ravin-primary)' }} />}
            actions={(row) => (
              <Security needs={[INGESTION_SETINGESTIONS]}>
                <ErrorBoundary display={() => null}>
                  <SyncPopover
                    syncId={row.id}
                    running={row.running}
                    paginationOptions={paginationOptions}
                  />
                </ErrorBoundary>
              </Security>
            )}
            onLineClick={handleLineClick}
            disableNavigation
            disableLineSelection
            emptyStateMessage={t_i18n('No OpenCTI streams configured. Create one to start synchronizing data.')}
          />
        )}
        {selectedSync && (
          <SyncConsumersDrawer
            syncId={selectedSync.id}
            syncName={selectedSync.name}
            open={drawerOpen}
            onClose={() => setDrawerOpen(false)}
          />
        )}
      </Box>
    </div>
  );
};

export default Sync;
