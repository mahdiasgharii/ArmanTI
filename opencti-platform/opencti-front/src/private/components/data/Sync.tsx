import React, { useContext } from 'react';
import MuiAlert from '@mui/material/Alert';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { SyncLinesPaginationQuery$data, SyncLinesPaginationQuery$variables } from '@components/data/sync/__generated__/SyncLinesPaginationQuery.graphql';
import { QueryRenderer } from '../../../relay/environment';
import ListLines from '../../../components/list_lines/ListLines';
import SyncLines, { SyncLinesQuery } from './sync/SyncLines';
import SyncCreation from './sync/SyncCreation';
import { usePaginationLocalStorage } from '../../../utils/hooks/useLocalStorage';
import useAuth, { UserContext } from '../../../utils/hooks/useAuth';
import { useFormatter } from '../../../components/i18n';
import { SYNC_MANAGER } from '../../../utils/platformModulesHelper';
import Breadcrumbs from '../../../components/Breadcrumbs';
import Security from '../../../utils/Security';
import { INGESTION_SETINGESTIONS } from '../../../utils/hooks/useGranted';
import useConnectedDocumentModifier from '../../../utils/hooks/useConnectedDocumentModifier';
import PageContainer from '../../../components/PageContainer';
import SyncImport from '@components/data/SyncImport';
import { isNotEmptyField } from '../../../utils/utils';
import { PaginationOptions } from '../../../components/list_lines';
import Button from '../../../components/common/button/Button';

const LOCAL_STORAGE_KEY = 'sync';

const Sync = () => {
  const { t_i18n } = useFormatter();
  const { setTitle } = useConnectedDocumentModifier();
  const { platformModuleHelpers } = useAuth();
  const { settings, isXTMHubAccessible } = useContext(UserContext);

  const importFromHubUrl = isNotEmptyField(settings?.platform_xtmhub_url)
    ? `${settings.platform_xtmhub_url}/redirect/opencti_integrations?platform_id=${settings.id}&integrationType=stream`
    : '';

  setTitle(t_i18n('Remote OCTI Streams | Ingestion | Data'));

  const {
    viewStorage,
    paginationOptions,
    helpers: storageHelpers,
  } = usePaginationLocalStorage<PaginationOptions>(LOCAL_STORAGE_KEY, {
    sortBy: 'name',
    orderAsc: false,
    searchTerm: '',
  });

  const dataColumns = {
    name: {
      label: 'Name',
      width: '20%',
      isSortable: true,
    },
    uri: {
      label: 'URL',
      width: '20%',
      isSortable: true,
    },
    messages: {
      label: 'Messages',
      width: '8%',
      isSortable: false,
    },
    running: {
      label: 'Status',
      width: '10%',
      isSortable: false,
    },
    current_state_date: {
      label: 'Current state',
      width: '15%',
      isSortable: true,
    },
    producer: {
      label: 'Producer',
      width: '25%',
      isSortable: false,
    },
  };

  const variables = {
    ...paginationOptions,
    count: 200,
  } as unknown as SyncLinesPaginationQuery$variables;

  if (!platformModuleHelpers.isSyncManagerEnable()) {
    return (
      <div>
        <MuiAlert severity="info">
          {t_i18n(platformModuleHelpers.generateDisableMessage(SYNC_MANAGER))}
        </MuiAlert>
      </div>
    );
  }

  return (
    <div data-testid="streams-page">
      <PageContainer withRightMenu>
        <Breadcrumbs
          elements={[{ label: t_i18n('Data') }, { label: t_i18n('Ingestion') }, { label: t_i18n('OpenCTI Streams'), current: true }]}
        />
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
              sx={{ margin: 0, fontSize: 24, fontWeight: 600 }}
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
          <Security needs={[INGESTION_SETINGESTIONS]}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <SyncImport paginationOptions={paginationOptions} />
              {isXTMHubAccessible && isNotEmptyField(importFromHubUrl) && (
                <Button
                  gradient
                  href={importFromHubUrl}
                  target="_blank"
                  title={t_i18n('Import from Hub')}
                >
                  {t_i18n('Import from Hub')}
                </Button>
              )}
              <SyncCreation triggerButton paginationOptions={paginationOptions} />
            </Box>
          </Security>
        </Box>
        <ListLines
          sortBy={viewStorage.sortBy}
          orderAsc={viewStorage.orderAsc}
          dataColumns={dataColumns}
          handleSort={storageHelpers.handleSort}
          handleSearch={storageHelpers.handleSearch}
          displayImport={false}
          secondaryAction={true}
          keyword={viewStorage.searchTerm}
          iconExtension
        >
          <QueryRenderer
            query={SyncLinesQuery}
            variables={variables}
            render={({ props }: { props: SyncLinesPaginationQuery$data }) => (
              <SyncLines
                data={props}
                paginationOptions={paginationOptions}
                refetchPaginationOptions={variables}
                dataColumns={dataColumns}
                initialLoading={props === null}
              />
            )}
          />
        </ListLines>
      </PageContainer>
    </div>
  );
};

export default Sync;
