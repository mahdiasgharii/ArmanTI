import React, { FunctionComponent } from 'react';
import { graphql } from 'react-relay';
import { Box, Typography } from '@mui/material';
import {
  CaseIncidentsLinesCasesPaginationQuery,
  CaseIncidentsLinesCasesPaginationQuery$variables,
} from '@components/cases/__generated__/CaseIncidentsLinesCasesPaginationQuery.graphql';
import { CaseIncidentsLinesCases_data$data } from '@components/cases/__generated__/CaseIncidentsLinesCases_data.graphql';
import StixCoreObjectForms from '@components/common/stix_core_objects/StixCoreObjectForms';
import { usePaginationLocalStorage } from '../../../utils/hooks/useLocalStorage';
import useQueryLoading from '../../../utils/hooks/useQueryLoading';
import useAuth from '../../../utils/hooks/useAuth';
import CaseIncidentCreation from './case_incidents/CaseIncidentCreation';
import { emptyFilterGroup, useBuildEntityTypeBasedFilterContext } from '../../../utils/filters/filtersUtils';
import { useFormatter } from '../../../components/i18n';
import Breadcrumbs from '../../../components/Breadcrumbs';
import DataTable from '../../../components/dataGrid/DataTable';
import { DataTableProps } from '../../../components/dataGrid/dataTableTypes';
import { UsePreloadedPaginationFragment } from '../../../utils/hooks/usePreloadedPaginationFragment';
import useConnectedDocumentModifier from '../../../utils/hooks/useConnectedDocumentModifier';
import { KNOWLEDGE_KNUPDATE, KNOWLEDGE_KNASKIMPORT } from '../../../utils/hooks/useGranted';
import Security from '../../../utils/Security';

interface CaseIncidentsProps {
  inputValue?: string;
}

const caseIncidentFragment = graphql`
  fragment CaseIncidentsLineCase_node on CaseIncident {
    id
    name
    description
    rating
    priority
    severity
    created
    entity_type
    response_types
    draftVersion {
      draft_id
      draft_operation
    }
    objectAssignee {
      entity_type
      id
      name
    }
    objectMarking {
      id
      definition_type
      definition
      x_opencti_order
      x_opencti_color
    }
    objectLabel {
      id
      value
      color
    }
    creators {
      id
      name
    }
    status {
      id
      order
      template {
        name
        color
      }
    }
    workflowEnabled
  }
`;

const caseIncidentsLinesQuery = graphql`
  query CaseIncidentsLinesCasesPaginationQuery(
    $search: String
    $count: Int
    $cursor: ID
    $orderBy: CaseIncidentsOrdering
    $orderMode: OrderingMode
    $filters: FilterGroup
  ) {
    ...CaseIncidentsLinesCases_data
    @arguments(
      search: $search
      count: $count
      cursor: $cursor
      orderBy: $orderBy
      orderMode: $orderMode
      filters: $filters
    )
  }
`;

const caseIncidentsLinesFragment = graphql`
  fragment CaseIncidentsLinesCases_data on Query
  @argumentDefinitions(
    search: { type: "String" }
    count: { type: "Int" }
    cursor: { type: "ID" }
    orderBy: { type: "CaseIncidentsOrdering" }
    orderMode: { type: "OrderingMode", defaultValue: desc }
    filters: { type: "FilterGroup" }
  )
  @refetchable(queryName: "CaseIncidentsCasesLinesRefetchQuery") {
    caseIncidents(
      search: $search
      first: $count
      after: $cursor
      orderBy: $orderBy
      orderMode: $orderMode
      filters: $filters
    ) @connection(key: "Pagination_incidents_caseIncidents") {
      edges {
        node {
          id
          ...CaseIncidentsLineCase_node
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

export const LOCAL_STORAGE_KEY_CASE_INCIDENT = 'caseIncidents';

const lowercaseVoiceSx = {
  textTransform: 'lowercase',
  '&::first-letter': { textTransform: 'uppercase' },
} as const;

const CaseIncidents: FunctionComponent<CaseIncidentsProps> = () => {
  const { t_i18n } = useFormatter();
  const { setTitle } = useConnectedDocumentModifier();
  setTitle(t_i18n('Incident Responses | Cases'));
  const { platformModuleHelpers: { isRuntimeFieldEnable } } = useAuth();

  const initialValues = {
    searchTerm: '',
    sortBy: 'created',
    orderAsc: false,
    openExports: false,
    filters: emptyFilterGroup,
  };
  const { viewStorage, helpers: storageHelpers, paginationOptions } = usePaginationLocalStorage<CaseIncidentsLinesCasesPaginationQuery$variables>(
    LOCAL_STORAGE_KEY_CASE_INCIDENT,
    initialValues,
  );

  const {
    filters,
  } = viewStorage;

  const contextFilters = useBuildEntityTypeBasedFilterContext('Case-Incident', filters);
  const queryPaginationOptions = {
    ...paginationOptions,
    filters: contextFilters,
  } as unknown as CaseIncidentsLinesCasesPaginationQuery$variables;
  const queryRef = useQueryLoading<CaseIncidentsLinesCasesPaginationQuery>(
    caseIncidentsLinesQuery,
    queryPaginationOptions,
  );

  const isRuntimeSort = isRuntimeFieldEnable() ?? false;
  const dataColumns: DataTableProps['dataColumns'] = {
    name: { percentWidth: 16 },
    response_types: { percentWidth: 9 },
    priority: { percentWidth: 8 },
    severity: { percentWidth: 8 },
    objectAssignee: {
      label: 'Assignees',
      percentWidth: 12,
      isSortable: isRuntimeSort,
    },
    creator: {
      percentWidth: 8,
      isSortable: isRuntimeSort,
    },
    objectLabel: { percentWidth: 8 },
    created: { percentWidth: 8 },
    x_opencti_workflow_id: { percentWidth: 8 },
    objectMarking: {
      isSortable: isRuntimeSort,
    },
  };

  const preloadedPaginationProps = {
    linesQuery: caseIncidentsLinesQuery,
    linesFragment: caseIncidentsLinesFragment,
    queryRef,
    nodePath: ['caseIncidents', 'pageInfo', 'globalCount'],
    setNumberOfElements: storageHelpers.handleSetNumberOfElements,
  } as UsePreloadedPaginationFragment<CaseIncidentsLinesCasesPaginationQuery>;

  return (
    <div data-testid="incident-response-page">
      <Breadcrumbs elements={[{ label: t_i18n('Cases') }, { label: t_i18n('Incident responses'), current: true }]} />
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
                {t_i18n('Incident responses')}
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
              {t_i18n('Track and manage security incident response cases')}
            </Typography>
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, flexShrink: 0 }}>
            <Security key="form-intake" needs={[KNOWLEDGE_KNUPDATE]} capabilitiesInDraft={[KNOWLEDGE_KNASKIMPORT]}>
              <StixCoreObjectForms entityType="Case-Incident" />
            </Security>
            <Security needs={[KNOWLEDGE_KNUPDATE]}>
              <CaseIncidentCreation paginationOptions={queryPaginationOptions} />
            </Security>
          </Box>
        </Box>
        {queryRef && (
          <DataTable
            dataColumns={dataColumns}
            resolvePath={(data: CaseIncidentsLinesCases_data$data) => data.caseIncidents?.edges?.map((n) => n?.node)}
            storageKey={LOCAL_STORAGE_KEY_CASE_INCIDENT}
            initialValues={initialValues}
            contextFilters={contextFilters}
            preloadedPaginationProps={preloadedPaginationProps}
            lineFragment={caseIncidentFragment}
            exportContext={{ entity_type: 'Case-Incident' }}
            emptyStateMessage={t_i18n('No incident responses yet. Create one to start tracking a security incident.')}
          />
        )}
      </Box>
    </div>
  );
};

export default CaseIncidents;
