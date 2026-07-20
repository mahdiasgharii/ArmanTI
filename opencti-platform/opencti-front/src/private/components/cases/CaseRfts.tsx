import React, { FunctionComponent } from 'react';
import { graphql } from 'react-relay';
import { Box, Typography } from '@mui/material';
import { CaseRftsLinesCasesPaginationQuery, CaseRftsLinesCasesPaginationQuery$variables } from '@components/cases/__generated__/CaseRftsLinesCasesPaginationQuery.graphql';
import { CaseRftsLinesCases_data$data } from '@components/cases/__generated__/CaseRftsLinesCases_data.graphql';
import StixCoreObjectForms from '@components/common/stix_core_objects/StixCoreObjectForms';
import { usePaginationLocalStorage } from '../../../utils/hooks/useLocalStorage';
import useQueryLoading from '../../../utils/hooks/useQueryLoading';
import useAuth from '../../../utils/hooks/useAuth';
import CaseRftCreation from './case_rfts/CaseRftCreation';
import { emptyFilterGroup, useBuildEntityTypeBasedFilterContext } from '../../../utils/filters/filtersUtils';
import { useFormatter } from '../../../components/i18n';
import Breadcrumbs from '../../../components/Breadcrumbs';
import DataTable from '../../../components/dataGrid/DataTable';
import { UsePreloadedPaginationFragment } from '../../../utils/hooks/usePreloadedPaginationFragment';
import { DataTableProps } from '../../../components/dataGrid/dataTableTypes';
import useConnectedDocumentModifier from '../../../utils/hooks/useConnectedDocumentModifier';
import { KNOWLEDGE_KNUPDATE, KNOWLEDGE_KNASKIMPORT } from '../../../utils/hooks/useGranted';
import Security from '../../../utils/Security';

interface CaseRftsProps {
  inputValue?: string;
}

const caseFragment = graphql`
  fragment CaseRftsLineCases_data on CaseRft {
    id
    name
    description
    entity_type
    created
    takedown_types
    priority
    severity
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

const caseRftsLinesQuery = graphql`
  query CaseRftsLinesCasesPaginationQuery(
    $search: String
    $count: Int
    $cursor: ID
    $orderBy: CaseRftsOrdering
    $orderMode: OrderingMode
    $filters: FilterGroup
  ) {
    ...CaseRftsLinesCases_data
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

const caseRftsLinesFragment = graphql`
  fragment CaseRftsLinesCases_data on Query
  @argumentDefinitions(
    search: { type: "String" }
    count: { type: "Int" }
    cursor: { type: "ID" }
    orderBy: { type: "CaseRftsOrdering" }
    orderMode: { type: "OrderingMode", defaultValue: desc }
    filters: { type: "FilterGroup" }
  )
  @refetchable(queryName: "CaseRftCasesLinesRefetchQuery") {
    caseRfts(
      search: $search
      first: $count
      after: $cursor
      orderBy: $orderBy
      orderMode: $orderMode
      filters: $filters
    ) @connection(key: "Pagination_case_caseRfts") {
      edges {
        node {
          id
          ...CaseRftsLineCases_data
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

export const LOCAL_STORAGE_KEY = 'caseRfts';

const lowercaseVoiceSx = {
  textTransform: 'lowercase',
  '&::first-letter': { textTransform: 'uppercase' },
} as const;

const CaseRfts: FunctionComponent<CaseRftsProps> = () => {
  const { t_i18n } = useFormatter();
  const { setTitle } = useConnectedDocumentModifier();
  setTitle(t_i18n('Requests for Takedown | Cases'));
  const { platformModuleHelpers: { isRuntimeFieldEnable } } = useAuth();

  const initialValues = {
    searchTerm: '',
    sortBy: 'created',
    orderAsc: false,
    openExports: false,
    filters: emptyFilterGroup,
  };
  const { viewStorage, helpers: storageHelpers, paginationOptions } = usePaginationLocalStorage<CaseRftsLinesCasesPaginationQuery$variables>(
    LOCAL_STORAGE_KEY,
    initialValues,
  );

  const {
    filters,
  } = viewStorage;

  const contextFilters = useBuildEntityTypeBasedFilterContext('Case-Rft', filters);
  const queryPaginationOptions = {
    ...paginationOptions,
    filters: contextFilters,
  } as unknown as CaseRftsLinesCasesPaginationQuery$variables;
  const queryRef = useQueryLoading<CaseRftsLinesCasesPaginationQuery>(
    caseRftsLinesQuery,
    queryPaginationOptions,
  );

  const isRuntimeSort = isRuntimeFieldEnable() ?? false;
  const dataColumns: DataTableProps['dataColumns'] = {
    name: {
      percentWidth: 21,
    },
    priority: {
      percentWidth: 10,
    },
    severity: {
      percentWidth: 10,
    },
    objectAssignee: {
      percentWidth: 10,
      isSortable: isRuntimeSort,
    },
    creator: {
      percentWidth: 10,
      isSortable: isRuntimeSort,
    },
    objectLabel: {},
    created: {
      percentWidth: 8,
    },
    x_opencti_workflow_id: {},
    objectMarking: {
      isSortable: isRuntimeSort,
    },
  };

  const preloadedPaginationProps = {
    linesQuery: caseRftsLinesQuery,
    linesFragment: caseRftsLinesFragment,
    queryRef,
    nodePath: ['caseRfts', 'pageInfo', 'globalCount'],
    setNumberOfElements: storageHelpers.handleSetNumberOfElements,
  } as UsePreloadedPaginationFragment<CaseRftsLinesCasesPaginationQuery>;

  return (
    <div data-testid="rfts-page">
      <Breadcrumbs elements={[{ label: t_i18n('Cases') }, { label: t_i18n('Requests for takedown'), current: true }]} />
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
                {t_i18n('Requests for takedown')}
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
              {t_i18n('Track and manage takedown requests for malicious infrastructure and content')}
            </Typography>
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, flexShrink: 0 }}>
            <Security key="form-intake" needs={[KNOWLEDGE_KNUPDATE]} capabilitiesInDraft={[KNOWLEDGE_KNASKIMPORT]}>
              <StixCoreObjectForms entityType="Case-Rft" />
            </Security>
            <Security needs={[KNOWLEDGE_KNUPDATE]}>
              <CaseRftCreation paginationOptions={queryPaginationOptions} />
            </Security>
          </Box>
        </Box>
        {queryRef && (
          <DataTable
            dataColumns={dataColumns}
            resolvePath={(data: CaseRftsLinesCases_data$data) => data.caseRfts?.edges?.map((n) => n?.node)}
            storageKey={LOCAL_STORAGE_KEY}
            initialValues={initialValues}
            contextFilters={contextFilters}
            preloadedPaginationProps={preloadedPaginationProps}
            lineFragment={caseFragment}
            exportContext={{ entity_type: 'Case-Rft' }}
            emptyStateMessage={t_i18n('No requests for takedown yet. Create one to start tracking a takedown request.')}
          />
        )}
      </Box>
    </div>
  );
};

export default CaseRfts;
