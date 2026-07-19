import Alert from '@mui/material/Alert';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import React, { useContext } from 'react';
import IngestionCsvLines, { ingestionCsvLinesQuery } from '@components/data/ingestionCsv/IngestionCsvLines';
import { IngestionCsvLinesPaginationQuery, IngestionCsvLinesPaginationQuery$variables } from '@components/data/ingestionCsv/__generated__/IngestionCsvLinesPaginationQuery.graphql';
import { IngestionCsvLineDummy } from '@components/data/ingestionCsv/IngestionCsvLine';
import { IngestionCsvCreationContainer } from '@components/data/ingestionCsv/IngestionCsvCreation';
import IngestionCsvImport from '@components/data/ingestionCsv/IngestionCsvImport';
import { useFormatter } from '../../../components/i18n';
import useAuth, { UserContext } from '../../../utils/hooks/useAuth';
import { usePaginationLocalStorage } from '../../../utils/hooks/useLocalStorage';
import { INGESTION_MANAGER } from '../../../utils/platformModulesHelper';
import ListLines from '../../../components/list_lines/ListLines';
import useQueryLoading from '../../../utils/hooks/useQueryLoading';
import { INGESTION_SETINGESTIONS } from '../../../utils/hooks/useGranted';
import Security from '../../../utils/Security';
import Breadcrumbs from '../../../components/Breadcrumbs';
import useConnectedDocumentModifier from '../../../utils/hooks/useConnectedDocumentModifier';
import { isNotEmptyField } from '../../../utils/utils';
import Button from '../../../components/common/button/Button';
import PageContainer from '../../../components/PageContainer';

const LOCAL_STORAGE_KEY = 'ingestionCsvs';

const IngestionCsv = () => {
  const { settings, isXTMHubAccessible } = useContext(UserContext);
  const importFromHubUrl = isNotEmptyField(settings?.platform_xtmhub_url)
    ? `${settings.platform_xtmhub_url}/redirect/opencti_integrations?platform_id=${settings.id}&integrationType=csv_feed`
    : '';

  const { t_i18n } = useFormatter();
  const { setTitle } = useConnectedDocumentModifier();
  setTitle(t_i18n('CSV Feeds | Ingestion | Data'));
  const { platformModuleHelpers } = useAuth();
  const {
    viewStorage,
    paginationOptions,
    helpers,
  } = usePaginationLocalStorage<IngestionCsvLinesPaginationQuery$variables>(LOCAL_STORAGE_KEY, {
    sortBy: 'name',
    orderAsc: false,
    searchTerm: '',
    numberOfElements: {
      number: 0,
      symbol: '',
    },
  });

  const renderLines = () => {
    const { searchTerm, sortBy, orderAsc, numberOfElements } = viewStorage;
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
      current_state_hash: {
        label: 'Current state',
        isSortable: false,
        width: '15%',
      },
    };
    const queryRef = useQueryLoading<IngestionCsvLinesPaginationQuery>(
      ingestionCsvLinesQuery,
      paginationOptions,
    );

    return (
      <ListLines
        helpers={helpers}
        sortBy={sortBy}
        orderAsc={orderAsc}
        dataColumns={dataColumns}
        handleSort={helpers.handleSort}
        handleSearch={helpers.handleSearch}
        displayImport={false}
        secondaryAction={true}
        paginationOptions={paginationOptions}
        numberOfElements={numberOfElements}
        keyword={searchTerm}
        iconExtension
      >
        {queryRef && (
          <React.Suspense
            fallback={(
              <>
                {Array(20)
                  .fill(0)
                  .map((_, idx) => (
                    <IngestionCsvLineDummy key={idx} dataColumns={dataColumns} />
                  ))}
              </>
            )}
          >
            <IngestionCsvLines
              queryRef={queryRef}
              paginationOptions={paginationOptions}
              dataColumns={dataColumns}
              setNumberOfElements={helpers.handleSetNumberOfElements}
            />
          </React.Suspense>
        )}
      </ListLines>
    );
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
    <div data-testid="csv-feeds-page">
      <PageContainer withRightMenu>
        <Breadcrumbs elements={[{ label: t_i18n('Data') }, { label: t_i18n('Ingestion') }, { label: t_i18n('CSV feeds'), current: true }]} />
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
              {t_i18n('CSV feeds')}
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
              <IngestionCsvImport paginationOptions={paginationOptions} />
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
              <IngestionCsvCreationContainer
                paginationOptions={paginationOptions}
                drawerSettings={
                  {
                    title: t_i18n('Create a CSV Feed'),
                    button: t_i18n('Create'),
                  }
                }
              />
            </Box>
          </Security>
        </Box>
        {renderLines()}
      </PageContainer>
    </div>
  );
};

export default IngestionCsv;
