import React, { FunctionComponent } from 'react';
import { graphql } from 'react-relay';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Tooltip from '@mui/material/Tooltip';
import { ReportsLinesPaginationQuery, ReportsLinesPaginationQuery$variables } from '@components/analyses/__generated__/ReportsLinesPaginationQuery.graphql';
import { ReportsLines_data$data } from '@components/analyses/__generated__/ReportsLines_data.graphql';
import StixCoreObjectForms from '@components/common/stix_core_objects/StixCoreObjectForms';
import ReportCreation from './reports/ReportCreation';
import Security from '../../../utils/Security';
import { KNOWLEDGE_KNASKIMPORT, KNOWLEDGE_KNUPDATE } from '../../../utils/hooks/useGranted';
import useAuth from '../../../utils/hooks/useAuth';
import { usePaginationLocalStorage } from '../../../utils/hooks/useLocalStorage';
import useQueryLoading from '../../../utils/hooks/useQueryLoading';
import { emptyFilterGroup, useBuildEntityTypeBasedFilterContext } from '../../../utils/filters/filtersUtils';
import { useFormatter } from '../../../components/i18n';
import DataTable from '../../../components/dataGrid/DataTable';
import { UsePreloadedPaginationFragment } from '../../../utils/hooks/usePreloadedPaginationFragment';
import { DataTableProps } from '../../../components/dataGrid/dataTableTypes';
import { Truncate } from '../../../components/dataGrid/dataTableUtils';
import Breadcrumbs from '../../../components/Breadcrumbs';
import useConnectedDocumentModifier from '../../../utils/hooks/useConnectedDocumentModifier';
import { resolveLink } from '../../../utils/Entity';
import { EMPTY_VALUE } from '../../../utils/String';
import Tag from '../../../components/common/tag/Tag';
import TagsOverflow from '../../../components/common/tag/TagsOverflow';
import StixCoreObjectLabels from '../common/stix_core_objects/StixCoreObjectLabels';

const reportLineFragment = graphql`
  fragment ReportsLine_node on Report {
    id
    entity_type
    name
    description
    published
    report_types
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
        id
        name
        color
      }
    }
    workflowEnabled
    created_at
  }
`;

const reportsLinesQuery = graphql`
  query ReportsLinesPaginationQuery(
    $search: String
    $count: Int!
    $cursor: ID
    $orderBy: ReportsOrdering
    $orderMode: OrderingMode
    $filters: FilterGroup
  ) {
    ...ReportsLines_data
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

const reportsLineFragment = graphql`
  fragment ReportsLines_data on Query
  @argumentDefinitions(
    search: { type: "String" }
    count: { type: "Int", defaultValue: 25 }
    cursor: { type: "ID" }
    orderBy: { type: "ReportsOrdering", defaultValue: name }
    orderMode: { type: "OrderingMode", defaultValue: asc }
    filters: { type: "FilterGroup" }
  )
  @refetchable(queryName: "ReportsLinesRefetchQuery") {
    reports(
      search: $search
      first: $count
      after: $cursor
      orderBy: $orderBy
      orderMode: $orderMode
      filters: $filters
    ) @connection(key: "Pagination_reports") {
      edges {
        node {
          id
          name
          published
          createdBy {
            ... on Identity {
              id
              name
              entity_type
            }
          }
          objectMarking {
            id
            definition_type
            definition
            x_opencti_order
            x_opencti_color
          }
          ...ReportsLine_node
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

const LOCAL_STORAGE_KEY = 'reports';

const Reports: FunctionComponent = () => {
  const { t_i18n } = useFormatter();
  const { setTitle } = useConnectedDocumentModifier();
  setTitle(t_i18n('Reports | Analyses'));
  const { platformModuleHelpers: { isRuntimeFieldEnable } } = useAuth();

  const initialValues = {
    filters: emptyFilterGroup,
    searchTerm: '',
    sortBy: 'published',
    orderAsc: false,
    openExports: false,
    redirectionMode: 'overview',
  };
  const {
    viewStorage,
    paginationOptions,
    helpers: storageHelpers,
  } = usePaginationLocalStorage<ReportsLinesPaginationQuery$variables>(LOCAL_STORAGE_KEY, initialValues);
  const {
    filters,
  } = viewStorage;

  const contextFilters = useBuildEntityTypeBasedFilterContext('Report', filters);
  const queryPaginationOptions = {
    ...paginationOptions,
    filters: contextFilters,
  } as unknown as ReportsLinesPaginationQuery$variables;
  const queryRef = useQueryLoading<ReportsLinesPaginationQuery>(
    reportsLinesQuery,
    queryPaginationOptions,
  );

  const preloadedPaginationProps = {
    linesQuery: reportsLinesQuery,
    linesFragment: reportsLineFragment,
    queryRef,
    nodePath: ['reports', 'pageInfo', 'globalCount'],
    setNumberOfElements: storageHelpers.handleSetNumberOfElements,
  } as UsePreloadedPaginationFragment<ReportsLinesPaginationQuery>;

  const isRuntimeSort = isRuntimeFieldEnable() ?? false;
  const dataColumns: DataTableProps['dataColumns'] = {
    name: {
      id: 'name',
      percentWidth: 25,
      isSortable: true,
      render: (data) => {
        const name = data.name || data.id;
        const link = `${resolveLink('Report')}/${data.id}`;
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
    report_types: {
      id: 'report_types',
      render: ({ report_types }, { storageHelpers: { handleAddFilter } }) => {
        if (!report_types || report_types.length === 0) return EMPTY_VALUE;
        return (
          <TagsOverflow
            items={report_types}
            getKey={(type: string) => type}
            renderTag={(type: string) => (
              <Tag
                label={type}
                labelTextTransform="lowercase"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  handleAddFilter('report_types', type, 'eq');
                }}
              />
            )}
          />
        );
      },
    },
    createdBy: {
      id: 'createdBy',
      percentWidth: 12,
      isSortable: isRuntimeSort,
      render: ({ createdBy }) => (
        <span style={{ color: 'var(--ravin-text-muted)' }}>
          {createdBy?.name ?? EMPTY_VALUE}
        </span>
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
    published: {
      id: 'published',
      render: ({ published }, { rd, nsdt }) => (
        <Tooltip title={nsdt(published)}>
          <span>{rd(published)}</span>
        </Tooltip>
      ),
    },
    x_opencti_workflow_id: {
      id: 'x_opencti_workflow_id',
      percentWidth: 8,
    },
    objectMarking: {
      id: 'objectMarking',
      isSortable: isRuntimeSort,
      percentWidth: 8,
    },
  };
  const createButton = (
    <Security needs={[KNOWLEDGE_KNUPDATE]}>
      <ReportCreation paginationOptions={queryPaginationOptions} />
    </Security>
  );
  return (
    <span data-testid="report-page">
      <Breadcrumbs elements={[{ label: t_i18n('Analyses') }, { label: t_i18n('Reports'), current: true }]} />
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
              {t_i18n('Reports')}
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
          <DataTable
            dataColumns={dataColumns}
            resolvePath={(data: ReportsLines_data$data) => data.reports?.edges?.map((n) => n?.node)}
            storageKey={LOCAL_STORAGE_KEY}
            initialValues={initialValues}
            contextFilters={contextFilters}
            preloadedPaginationProps={preloadedPaginationProps}
            lineFragment={reportLineFragment}
            exportContext={{ entity_type: 'Report' }}
            redirectionModeEnabled
            additionalHeaderButtons={[
              <Security key="form-intake" needs={[KNOWLEDGE_KNUPDATE]} capabilitiesInDraft={[KNOWLEDGE_KNASKIMPORT]}>
                <StixCoreObjectForms entityType="Report" />
              </Security>,
            ]}
            emptyStateMessage={t_i18n('No reports yet. Create one to document and share threat intelligence analysis.')}
          />
        )}
      </Box>
    </span>
  );
};

export default Reports;
