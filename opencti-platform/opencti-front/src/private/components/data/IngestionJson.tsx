/*
Copyright (c) 2021-2025 Filigran SAS

This file is part of the OpenCTI Enterprise Edition ("EE") and is
licensed under the OpenCTI Enterprise Edition License (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

https://github.com/OpenCTI-Platform/opencti/blob/master/LICENSE

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
*/

import Alert from '@mui/material/Alert';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import React from 'react';
import IngestionJsonLines, { ingestionJsonLinesQuery } from '@components/data/ingestionJson/IngestionJsonLines';
import {
  IngestionJsonLinesPaginationQuery,
  IngestionJsonLinesPaginationQuery$variables,
} from '@components/data/ingestionJson/__generated__/IngestionJsonLinesPaginationQuery.graphql';
import { IngestionJsonLineDummy } from '@components/data/ingestionJson/IngestionJsonLine';
import { IngestionJsonCreationContainer } from '@components/data/ingestionJson/IngestionJsonCreation';
import { useFormatter } from '../../../components/i18n';
import useAuth from '../../../utils/hooks/useAuth';
import { usePaginationLocalStorage } from '../../../utils/hooks/useLocalStorage';
import { INGESTION_MANAGER } from '../../../utils/platformModulesHelper';
import ListLines from '../../../components/list_lines/ListLines';
import useQueryLoading from '../../../utils/hooks/useQueryLoading';
import { INGESTION_SETINGESTIONS } from '../../../utils/hooks/useGranted';
import Security from '../../../utils/Security';
import Breadcrumbs from '../../../components/Breadcrumbs';
import useConnectedDocumentModifier from '../../../utils/hooks/useConnectedDocumentModifier';
import PageContainer from '../../../components/PageContainer';

const LOCAL_STORAGE_KEY = 'ingestionJsons';

const IngestionJson = () => {
  const { t_i18n } = useFormatter();
  const { setTitle } = useConnectedDocumentModifier();
  setTitle(t_i18n('JSON Feeds | Ingestion | Data'));
  const { platformModuleHelpers } = useAuth();
  const {
    viewStorage,
    paginationOptions,
    helpers,
  } = usePaginationLocalStorage<IngestionJsonLinesPaginationQuery$variables>(LOCAL_STORAGE_KEY, {
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
      connector: {
        label: 'Connector',
        isSortable: false,
        width: '15%',
      },
    };
    const queryRef = useQueryLoading<IngestionJsonLinesPaginationQuery>(
      ingestionJsonLinesQuery,
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
                    <IngestionJsonLineDummy key={idx} dataColumns={dataColumns} />
                  ))}
              </>
            )}
          >
            <IngestionJsonLines
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
    <div data-testid="json-feeds-page">
      <PageContainer withRightMenu>
        <Breadcrumbs elements={[{ label: t_i18n('Data') }, { label: t_i18n('Ingestion') }, { label: t_i18n('JSON Feeds'), current: true }]} />
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
              {t_i18n('JSON Feeds')}
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
            <IngestionJsonCreationContainer
              open={false}
              handleClose={() => { }}
              paginationOptions={paginationOptions}
              isDuplicated={false}
            />
          </Security>
        </Box>
        <>{renderLines()}</>
      </PageContainer>
    </div>
  );
};

export default IngestionJson;
