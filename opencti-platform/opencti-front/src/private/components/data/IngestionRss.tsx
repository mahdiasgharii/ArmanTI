import React, { useContext } from 'react';
import Alert from '@mui/material/Alert';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { QueryRenderer } from '../../../relay/environment';
import ListLines from '../../../components/list_lines/ListLines';
import IngestionRssLines, { IngestionRssLinesQuery } from './ingestionRss/IngestionRssLines';
import IngestionRssCreation from './ingestionRss/IngestionRssCreation';
import { usePaginationLocalStorage } from '../../../utils/hooks/useLocalStorage';
import useAuth, { UserContext } from '../../../utils/hooks/useAuth';
import { useFormatter } from '../../../components/i18n';
import { INGESTION_MANAGER } from '../../../utils/platformModulesHelper';
import Breadcrumbs from '../../../components/Breadcrumbs';
import Button from '../../../components/common/button/Button';
import Security from '../../../utils/Security';
import { INGESTION_SETINGESTIONS } from '../../../utils/hooks/useGranted';
import useConnectedDocumentModifier from '../../../utils/hooks/useConnectedDocumentModifier';
import { isNotEmptyField } from '../../../utils/utils';
import IngestionRssImport from '@components/data/IngestionRssImport';
import { PaginationOptions } from '../../../components/list_lines';
import { IngestionRssLinesPaginationQuery } from '@components/data/ingestionRss/__generated__/IngestionRssLinesPaginationQuery.graphql';
import PageContainer from '../../../components/PageContainer';

const LOCAL_STORAGE_KEY = 'ingestionRss';

const IngestionRss = () => {
  const { t_i18n } = useFormatter();
  const { settings, isXTMHubAccessible } = useContext(UserContext);
  const { setTitle } = useConnectedDocumentModifier();
  setTitle(t_i18n('RSS Feeds | Ingestion | Data'));
  const { platformModuleHelpers } = useAuth();
  const importFromHubUrl = isNotEmptyField(settings?.platform_xtmhub_url)
    ? `${settings.platform_xtmhub_url}/redirect/opencti_integrations?platform_id=${settings.id}&integrationType=rss_feed`
    : '';
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
      width: '25%',
      isSortable: true,
    },
    ingestion_running: {
      label: 'Status',
      width: '15%',
      isSortable: false,
    },
    last_execution_date: {
      label: 'Last run',
      width: '15%',
      isSortable: false,
    },
    current_state_date: {
      label: 'Current state',
      isSortable: false,
      width: '15%',
    },
  };
  if (!platformModuleHelpers.isIngestionManagerEnable()) {
    return (
      <div>
        <Alert severity="info">
          {t_i18n(platformModuleHelpers.generateDisableMessage(INGESTION_MANAGER))}
        </Alert>
      </div>
    );
  }
  return (
    <div data-testid="rss-feeds-page">
      <PageContainer withRightMenu>
        <Breadcrumbs elements={[{ label: t_i18n('Data') }, { label: t_i18n('Ingestion') }, { label: t_i18n('RSS feeds'), current: true }]} />
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
              {t_i18n('RSS feeds')}
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
              <IngestionRssImport paginationOptions={paginationOptions} />
              { isXTMHubAccessible && isNotEmptyField(importFromHubUrl) && (
                <Button
                  gradient
                  href={importFromHubUrl}
                  target="_blank"
                  title={t_i18n('Import from Hub')}
                >
                  {t_i18n('Import from Hub')}
                </Button>
              )}
              <IngestionRssCreation paginationOptions={paginationOptions} />
            </Box>
          </Security>
        </Box>
        <ListLines
          helpers={storageHelpers}
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
            query={IngestionRssLinesQuery}
            variables={{ count: 200, ...paginationOptions }}
            render={({ props }: { props: IngestionRssLinesPaginationQuery['response'] | null }) => (
              <IngestionRssLines
                data={props}
                paginationOptions={paginationOptions}
                refetchPaginationOptions={{ count: 200, ...paginationOptions }}
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

export default IngestionRss;
