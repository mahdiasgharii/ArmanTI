import React, { FunctionComponent } from 'react';
import { Box, Typography } from '@mui/material';
import StixCoreObjectForms from '@components/common/stix_core_objects/StixCoreObjectForms';
import { IncidentsLinesQuery, IncidentsLinesQuery$variables } from './incidents/__generated__/IncidentsLinesQuery.graphql';
import { IncidentsLines_data$data } from './incidents/__generated__/IncidentsLines_data.graphql';
import { incidentLineFragment } from './incidents/IncidentLine';
import { incidentsLinesFragment, incidentsLinesQuery } from './incidents/IncidentsLines';
import IncidentCreation from './incidents/IncidentCreation';
import useAuth from '../../../utils/hooks/useAuth';
import useQueryLoading from '../../../utils/hooks/useQueryLoading';
import { usePaginationLocalStorage } from '../../../utils/hooks/useLocalStorage';
import { emptyFilterGroup, useBuildEntityTypeBasedFilterContext, useGetDefaultFilterObject } from '../../../utils/filters/filtersUtils';
import { useFormatter } from '../../../components/i18n';
import Breadcrumbs from '../../../components/Breadcrumbs';
import { DataTableProps } from '../../../components/dataGrid/dataTableTypes';
import { UsePreloadedPaginationFragment } from '../../../utils/hooks/usePreloadedPaginationFragment';
import DataTable from '../../../components/dataGrid/DataTable';
import useConnectedDocumentModifier from '../../../utils/hooks/useConnectedDocumentModifier';
import Security from '../../../utils/Security';
import { KNOWLEDGE_KNUPDATE, KNOWLEDGE_KNASKIMPORT } from '../../../utils/hooks/useGranted';

export const LOCAL_STORAGE_KEY = 'incidents';

const lowercaseVoiceSx = {
  textTransform: 'lowercase',
  '&::first-letter': { textTransform: 'uppercase' },
} as const;

const Incidents: FunctionComponent = () => {
  const { t_i18n } = useFormatter();
  const { setTitle } = useConnectedDocumentModifier();
  setTitle(t_i18n('Incidents | Events'));
  const {
    platformModuleHelpers: { isRuntimeFieldEnable },
  } = useAuth();

  const initialValues = {
    filters: {
      ...emptyFilterGroup,
      filters: useGetDefaultFilterObject(['incident_type'], ['Incident']),
    },
    sortBy: 'created_at',
    orderAsc: false,
    openExports: false,
  };

  const { viewStorage, helpers, paginationOptions } = usePaginationLocalStorage<IncidentsLinesQuery$variables>(
    LOCAL_STORAGE_KEY,
    initialValues,
  );

  const contextFilters = useBuildEntityTypeBasedFilterContext('Incident', viewStorage.filters);
  const queryPaginationOptions = {
    ...paginationOptions,
    filters: contextFilters,
  } as unknown as IncidentsLinesQuery$variables;
  const queryRef = useQueryLoading<IncidentsLinesQuery>(
    incidentsLinesQuery,
    queryPaginationOptions,
  );

  const isRuntimeSort = isRuntimeFieldEnable() ?? false;
  const dataColumns: DataTableProps['dataColumns'] = {
    name: { percentWidth: 20 },
    incident_type: { percentWidth: 8 },
    severity: { percentWidth: 8 },
    objectAssignee: { percentWidth: 12, isSortable: isRuntimeSort },
    creator: { percentWidth: 11, isSortable: isRuntimeSort },
    objectLabel: { percentWidth: 15 },
    created: { percentWidth: 10 },
    x_opencti_workflow_id: { percentWidth: 8 },
    objectMarking: { percentWidth: 8, isSortable: isRuntimeSort },
  };

  const preloadedPaginationProps = {
    linesQuery: incidentsLinesQuery,
    linesFragment: incidentsLinesFragment,
    queryRef,
    nodePath: ['incidents', 'pageInfo', 'globalCount'],
    setNumberOfElements: helpers.handleSetNumberOfElements,
  } as UsePreloadedPaginationFragment<IncidentsLinesQuery>;

  return (
    <div data-testid="incident-page">
      <Breadcrumbs elements={[{ label: t_i18n('Events') }, { label: t_i18n('Incidents'), current: true }]} />
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
                {t_i18n('Incidents')}
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
              {t_i18n('Track and manage security incidents and their severity')}
            </Typography>
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, flexShrink: 0 }}>
            <Security key="form-intake" needs={[KNOWLEDGE_KNUPDATE]} capabilitiesInDraft={[KNOWLEDGE_KNASKIMPORT]}>
              <StixCoreObjectForms entityType="Incident" />
            </Security>
            <Security needs={[KNOWLEDGE_KNUPDATE]}>
              <IncidentCreation paginationOptions={queryPaginationOptions} />
            </Security>
          </Box>
        </Box>
        {queryRef && (
          <DataTable
            storageKey={LOCAL_STORAGE_KEY}
            initialValues={initialValues}
            preloadedPaginationProps={preloadedPaginationProps}
            resolvePath={(data: IncidentsLines_data$data) => data.incidents?.edges?.map((n) => n?.node)}
            dataColumns={dataColumns}
            lineFragment={incidentLineFragment}
            contextFilters={contextFilters}
            exportContext={{ entity_type: 'Incident' }}
            availableEntityTypes={['Incident']}
            emptyStateMessage={t_i18n('No incidents yet. Create one to start tracking a security incident.')}
          />
        )}
      </Box>
    </div>
  );
};

export default Incidents;
