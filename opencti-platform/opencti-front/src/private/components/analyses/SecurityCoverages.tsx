import React, { FunctionComponent } from 'react';
import { graphql } from 'react-relay';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Tooltip from '@mui/material/Tooltip';
import type { SecurityCoveragesLinesPaginationQuery, SecurityCoveragesLinesPaginationQuery$variables } from './__generated__/SecurityCoveragesLinesPaginationQuery.graphql';
import type { SecurityCoveragesLines_data$data } from './__generated__/SecurityCoveragesLines_data.graphql';
import { usePaginationLocalStorage } from '../../../utils/hooks/useLocalStorage';
import Security from '../../../utils/Security';
import { KNOWLEDGE_KNUPDATE } from '../../../utils/hooks/useGranted';
import SecurityCoverageCreation from './security_coverages/SecurityCoverageCreation';
import SecurityCoverageScores from './security_coverages/SecurityCoverageScores';
import useQueryLoading from '../../../utils/hooks/useQueryLoading';
import { emptyFilterGroup, useBuildEntityTypeBasedFilterContext } from '../../../utils/filters/filtersUtils';
import { useFormatter } from '../../../components/i18n';
import ExportContextProvider from '../../../utils/ExportContextProvider';
import Breadcrumbs from '../../../components/Breadcrumbs';
import DataTable from '../../../components/dataGrid/DataTable';
import { DataTableProps } from '../../../components/dataGrid/dataTableTypes';
import { Truncate } from '../../../components/dataGrid/dataTableUtils';
import { UsePreloadedPaginationFragment } from '../../../utils/hooks/usePreloadedPaginationFragment';
import useConnectedDocumentModifier from '../../../utils/hooks/useConnectedDocumentModifier';
import useAuth from '../../../utils/hooks/useAuth';
import { resolveLink } from '../../../utils/Entity';
import { EMPTY_VALUE } from '../../../utils/String';
import StixCoreObjectLabels from '../common/stix_core_objects/StixCoreObjectLabels';

const LOCAL_STORAGE_KEY = 'securityCoverages';

const securityCoverageFragment = graphql`
  fragment SecurityCoveragesLine_node on SecurityCoverage {
    id
    name
    description
    entity_type
    coverage_last_result
    coverage_valid_from
    coverage_valid_to
    auto_enrichment_disable
    coverage_information {
      coverage_name
      coverage_score
    }
    objectCovered {
      ... on Report {
        id
        name
        entity_type
      }
      ... on Malware {
        id
        name
        entity_type
      }
    }
    draftVersion {
      draft_id
      draft_operation
    }
    createdBy {
      ... on Identity {
        id
        name
        entity_type
      }
    }
    creators {
      id
      name
    }
    created
    modified
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
  }
`;

const securityCoveragesLinesQuery = graphql`
  query SecurityCoveragesLinesPaginationQuery(
    $search: String
    $count: Int
    $cursor: ID
    $orderBy: SecurityCoverageOrdering
    $orderMode: OrderingMode
    $filters: FilterGroup
  ) {
    ...SecurityCoveragesLines_data
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

const securityCoveragesLinesFragment = graphql`
  fragment SecurityCoveragesLines_data on Query
  @argumentDefinitions(
    search: { type: "String" }
    count: { type: "Int" }
    cursor: { type: "ID" }
    orderBy: { type: "SecurityCoverageOrdering" }
    orderMode: { type: "OrderingMode" }
    filters: { type: "FilterGroup" }
  ) @refetchable(queryName: "SecurityCoveragesLinesRefetchQuery") {
    securityCoverages(
      search: $search
      first: $count
      after: $cursor
      orderBy: $orderBy
      orderMode: $orderMode
      filters: $filters
    ) @connection(key: "Pagination__securityCoverages") {
      edges {
        node {
          id
          ...SecurityCoveragesLine_node
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

const SecurityCoverages: FunctionComponent = () => {
  const { t_i18n } = useFormatter();
  const { setTitle } = useConnectedDocumentModifier();
  const { platformModuleHelpers: { isRuntimeFieldEnable } } = useAuth();
  setTitle(t_i18n('Security coverages'));
  const initialValues = {
    searchTerm: '',
    sortBy: 'created',
    orderAsc: false,
    openExports: false,
    filters: emptyFilterGroup,
  };
  const { viewStorage, helpers: storageHelpers, paginationOptions } = usePaginationLocalStorage<SecurityCoveragesLinesPaginationQuery$variables>(
    LOCAL_STORAGE_KEY,
    initialValues,
  );
  const {
    filters,
  } = viewStorage;

  const contextFilters = useBuildEntityTypeBasedFilterContext('Security-Coverage', filters);
  const queryPaginationOptions = {
    ...paginationOptions,
    filters: contextFilters,
  } as unknown as SecurityCoveragesLinesPaginationQuery$variables;
  const queryRef = useQueryLoading<SecurityCoveragesLinesPaginationQuery>(
    securityCoveragesLinesQuery,
    queryPaginationOptions,
  );

  const preloadedPaginationProps = {
    linesQuery: securityCoveragesLinesQuery,
    linesFragment: securityCoveragesLinesFragment,
    queryRef,
    nodePath: ['securityCoverages', 'pageInfo', 'globalCount'],
    setNumberOfElements: storageHelpers.handleSetNumberOfElements,
  } as UsePreloadedPaginationFragment<SecurityCoveragesLinesPaginationQuery>;

  const isRuntimeSort = isRuntimeFieldEnable() ?? false;
  const dataColumns: DataTableProps['dataColumns'] = {
    name: {
      id: 'name',
      percentWidth: 35,
      isSortable: true,
      render: (data) => {
        const name = data.name || data.id;
        const link = `${resolveLink('Security-Coverage')}/${data.id}`;
        return (
          <Tooltip title={name}>
            <a
              href={link}
              style={{
                color: 'var(--ravin-primary)',
                textDecoration: 'none',
                fontWeight: 500,
              }}
            >
              <Truncate>{name}</Truncate>
            </a>
          </Tooltip>
        );
      },
    },
    coverage_last_result: {
      id: 'coverage_last_result',
      percentWidth: 15,
      render: ({ coverage_last_result }, { fndt }) => (
        <span style={{ color: 'var(--ravin-text-muted)' }}>
          {coverage_last_result ? fndt(coverage_last_result) : EMPTY_VALUE}
        </span>
      ),
    },
    coverage_information: {
      id: 'coverage_information',
      percentWidth: 15,
      render: ({ coverage_information }) => (
        <SecurityCoverageScores
          coverage_information={coverage_information}
          variant="header"
        />
      ),
    },
    creator: {
      id: 'creator',
      percentWidth: 12,
      isSortable: isRuntimeSort,
      render: ({ creators }) => {
        if (!creators || creators.length === 0) return EMPTY_VALUE;
        const value = creators.map((c: { name: string }) => c.name).join(', ');
        return (
          <span style={{ color: 'var(--ravin-text-muted)' }}>
            {value}
          </span>
        );
      },
    },
    objectLabel: {
      id: 'objectLabel',
      percentWidth: 15,
      render: ({ objectLabel }, { storageHelpers: { handleAddFilter } }) => {
        return (
          <StixCoreObjectLabels
            variant="inList"
            labels={objectLabel}
            onClick={handleAddFilter}
          />
        );
      },
    },
    objectMarking: {
      id: 'objectMarking',
      isSortable: isRuntimeSort,
      percentWidth: 8,
    },
  };

  const createButton = (
    <Security needs={[KNOWLEDGE_KNUPDATE]}>
      <SecurityCoverageCreation paginationOptions={queryPaginationOptions} />
    </Security>
  );
  return (
    <ExportContextProvider>
      <Breadcrumbs elements={[{ label: t_i18n('Analyses') }, { label: t_i18n('Security coverages'), current: true }]} />
      <Box sx={{ padding: '24px 24px 0 24px', borderRadius: '0.625rem' }}>
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
              sx={{
                margin: 0,
                fontSize: 24,
                fontWeight: 600,
              }}
            >
              {t_i18n('Security coverages')}
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
          {createButton}
        </Box>
        {queryRef && (
          <div data-testid="security-coverages-page">
            <DataTable
              dataColumns={dataColumns}
              resolvePath={(data: SecurityCoveragesLines_data$data) => data.securityCoverages?.edges?.map((n) => n.node)}
              storageKey={LOCAL_STORAGE_KEY}
              initialValues={initialValues}
              contextFilters={contextFilters}
              preloadedPaginationProps={preloadedPaginationProps}
              lineFragment={securityCoverageFragment}
              exportContext={{ entity_type: 'Security-Coverage' }}
              redirectionModeEnabled
              emptyStateMessage={t_i18n('No security coverages yet. Create one to track and visualize detection and prevention coverage across your threat landscape.')}
            />
          </div>
        )}
      </Box>
    </ExportContextProvider>
  );
};

export default SecurityCoverages;
