import React from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Alert from '@mui/material/Alert';
import { FormLinesPaginationQuery, FormLinesPaginationQuery$variables } from '@components/data/forms/__generated__/FormLinesPaginationQuery.graphql';
import FormLines, { formLinesQuery } from '@components/data/forms/FormLines';
import FormCreationContainer from '@components/data/forms/FormCreationContainer';
import { FormLineDummy } from '@components/data/forms/FormLine';
import { useFormatter } from '../../../components/i18n';
import useAuth from '../../../utils/hooks/useAuth';
import { usePaginationLocalStorage } from '../../../utils/hooks/useLocalStorage';
import ListLines from '../../../components/list_lines/ListLines';
import useQueryLoading from '../../../utils/hooks/useQueryLoading';
import Security from '../../../utils/Security';
import useGranted, { INGESTION_SETINGESTIONS, KNOWLEDGE_KNASKIMPORT, KNOWLEDGE_KNUPDATE } from '../../../utils/hooks/useGranted';
import Breadcrumbs from '../../../components/Breadcrumbs';
import useConnectedDocumentModifier from '../../../utils/hooks/useConnectedDocumentModifier';
import PageContainer from '../../../components/PageContainer';

const LOCAL_STORAGE_KEY = 'forms';

const Forms = () => {
  const { t_i18n } = useFormatter();
  const { setTitle } = useConnectedDocumentModifier();
  setTitle(t_i18n('Form intakes | Ingestion | Data'));
  const { platformModuleHelpers } = useAuth();
  const hasIngestionCapability = useGranted([INGESTION_SETINGESTIONS]);
  const hasKnowledgeUpdateCapability = useGranted([KNOWLEDGE_KNUPDATE, KNOWLEDGE_KNASKIMPORT], false, { capabilitiesInDraft: [KNOWLEDGE_KNUPDATE] });

  const {
    viewStorage,
    paginationOptions,
    helpers,
  } = usePaginationLocalStorage<FormLinesPaginationQuery$variables>(
    LOCAL_STORAGE_KEY,
    {
      sortBy: 'name',
      orderAsc: false,
      searchTerm: '',
      numberOfElements: {
        number: 0,
        symbol: '',
      },
    },
  );

  const renderLines = () => {
    const { searchTerm, sortBy, orderAsc, numberOfElements } = viewStorage;
    const dataColumns = {
      name: {
        label: 'Name',
        width: '20%',
        isSortable: true,
      },
      description: {
        label: 'Description',
        width: '30%',
        isSortable: true,
      },
      mainEntityType: {
        label: 'Main Entity Type',
        width: '15%',
        isSortable: false,
      },
      active: {
        label: 'Status',
        width: '10%',
        isSortable: true,
      },
      updated_at: {
        label: 'Updated',
        width: '15%',
        isSortable: true,
      },
    };
    const queryRef = useQueryLoading<FormLinesPaginationQuery>(
      formLinesQuery,
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
                    <FormLineDummy key={idx} dataColumns={dataColumns} />
                  ))}
              </>
            )}
          >
            <FormLines
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
          {t_i18n('Ingestion manager is disabled or not configured, please go to the platform settings to enable it.')}
        </Alert>
      </div>
    );
  }

  // Check if user has permission to view forms
  if (!hasIngestionCapability && !hasKnowledgeUpdateCapability) {
    return (
      <div>
        <Breadcrumbs elements={[
          { label: t_i18n('Data') },
          { label: t_i18n('Ingestion') },
          { label: t_i18n('Form intakes'), current: true },
        ]}
        />
        <Alert severity="error">
          {t_i18n('You do not have permission to view form intakes.')}
        </Alert>
      </div>
    );
  }

  return (
    <div>
      <PageContainer withRightMenu>
        <Breadcrumbs elements={[
          { label: t_i18n('Data') },
          { label: t_i18n('Ingestion') },
          { label: t_i18n('Form intakes'), current: true },
        ]}
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
              {t_i18n('Form intakes')}
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
            <FormCreationContainer
              paginationOptions={paginationOptions}
              triggerButton={true}
            />
          </Security>
        </Box>
        {renderLines()}
      </PageContainer>
    </div>
  );
};

export default Forms;
