import React from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { QueryRenderer } from '../../../relay/environment';
import ListLines from '../../../components/list_lines/ListLines';
import IngestionTaxiiCollectionLines, { IngestionTaxiiCollectionLinesQuery } from './ingestionTaxiiCollection/IngestionTaxiiCollectionLines';
import IngestionTaxiiCollectionCreation from './ingestionTaxiiCollection/IngestionTaxiiCollectionCreation';
import { usePaginationLocalStorage } from '../../../utils/hooks/useLocalStorage';
import { useFormatter } from '../../../components/i18n';
import Breadcrumbs from '../../../components/Breadcrumbs';
import Security from '../../../utils/Security';
import { INGESTION_SETINGESTIONS } from '../../../utils/hooks/useGranted';
import PageContainer from '../../../components/PageContainer';

const LOCAL_STORAGE_KEY = 'ingestionTaxii';

const IngestionTaxiiCollections = () => {
  const { t_i18n } = useFormatter();
  const {
    viewStorage,
    paginationOptions,
    helpers: storageHelpers,
  } = usePaginationLocalStorage(LOCAL_STORAGE_KEY, {
    sortBy: 'name',
    orderAsc: false,
    searchTerm: '',
  });
  const dataColumns = {
    name: {
      label: 'Name',
      width: '15%',
      isSortable: true,
    },
    id: {
      label: 'Push Collection URI',
      width: '65%',
      isSortable: false,
    },
    ingestion_running: {
      label: 'Status',
      width: '10%',
      isSortable: false,
    },
  };
  return (
    <div data-testid="taxii-push-page">
      <PageContainer withRightMenu>
        <Breadcrumbs elements={[{ label: t_i18n('Data') }, { label: t_i18n('Ingestion') }, { label: t_i18n('TAXII push'), current: true }]} />
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
              {t_i18n('TAXII push')}
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
            <IngestionTaxiiCollectionCreation paginationOptions={paginationOptions} />
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
            query={IngestionTaxiiCollectionLinesQuery}
            variables={{ count: 200, ...paginationOptions }}
            render={({ props }) => (
              <IngestionTaxiiCollectionLines
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

export default IngestionTaxiiCollections;
