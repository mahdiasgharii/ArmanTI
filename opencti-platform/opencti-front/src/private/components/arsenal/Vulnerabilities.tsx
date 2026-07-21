import React from 'react';
import { graphql } from 'react-relay';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Tooltip from '@mui/material/Tooltip';
import { VulnerabilitiesLinesPaginationQuery, VulnerabilitiesLinesPaginationQuery$variables } from '@components/arsenal/__generated__/VulnerabilitiesLinesPaginationQuery.graphql';
import { VulnerabilitiesLines_data$data } from '@components/arsenal/__generated__/VulnerabilitiesLines_data.graphql';
import VulnerabilityCreation from './vulnerabilities/VulnerabilityCreation';
import Security from '../../../utils/Security';
import { KNOWLEDGE_KNPARTICIPATE, KNOWLEDGE_KNUPDATE } from '../../../utils/hooks/useGranted';
import useQueryLoading from '../../../utils/hooks/useQueryLoading';
import { usePaginationLocalStorage } from '../../../utils/hooks/useLocalStorage';
import useAuth from '../../../utils/hooks/useAuth';
import { emptyFilterGroup, useBuildEntityTypeBasedFilterContext } from '../../../utils/filters/filtersUtils';
import { useFormatter } from '../../../components/i18n';
import Breadcrumbs from '../../../components/Breadcrumbs';
import DataTable from '../../../components/dataGrid/DataTable';
import { DataTableProps } from '../../../components/dataGrid/dataTableTypes';
import { UsePreloadedPaginationFragment } from '../../../utils/hooks/usePreloadedPaginationFragment';
import useConnectedDocumentModifier from '../../../utils/hooks/useConnectedDocumentModifier';
import { resolveLink } from '../../../utils/Entity';
import { EMPTY_VALUE } from '../../../utils/String';
import { Truncate, defaultRender } from '../../../components/dataGrid/dataTableUtils';
import Tag from '../../../components/common/tag/Tag';
import TagsOverflow from '../../../components/common/tag/TagsOverflow';
import ItemCvssScore from '../../../components/ItemCvssScore';
import ItemSeverity from '../../../components/ItemSeverity';

const lowercaseVoiceSx = {
  textTransform: 'lowercase',
  '&::first-letter': { textTransform: 'uppercase' },
} as const;

const LOCAL_STORAGE_KEY = 'vulnerabilities';

const vulnerabilityLineFragment = graphql`
  fragment VulnerabilitiesLine_node on Vulnerability {
    id
    name
    x_opencti_cvss_base_score
    x_opencti_cvss_base_severity
    x_opencti_cisa_kev
    x_opencti_epss_score
    created
    modified
    confidence
    entity_type
    draftVersion {
      draft_id
      draft_operation
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
    createdBy {
      id
      name
    }
    creators {
      id
      name
    }
  }
`;

const vulnerabilitiesLinesQuery = graphql`
  query VulnerabilitiesLinesPaginationQuery(
    $search: String
    $count: Int!
    $cursor: ID
    $orderBy: VulnerabilitiesOrdering
    $orderMode: OrderingMode
    $filters: FilterGroup
  ) {
    ...VulnerabilitiesLines_data
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

const vulnerabilitiesLinesFragment = graphql`
  fragment VulnerabilitiesLines_data on Query
  @argumentDefinitions(
    search: { type: "String" }
    count: { type: "Int", defaultValue: 25 }
    cursor: { type: "ID" }
    orderBy: { type: "VulnerabilitiesOrdering", defaultValue: name }
    orderMode: { type: "OrderingMode", defaultValue: asc }
    filters: { type: "FilterGroup" }
  )
  @refetchable(queryName: "VulnerabilitiesLinesRefetchQuery") {
    vulnerabilities(
      search: $search
      first: $count
      after: $cursor
      orderBy: $orderBy
      orderMode: $orderMode
      filters: $filters
    ) @connection(key: "Pagination_vulnerabilities") {
      edges {
        node {
          id
          name
          description
          ...VulnerabilitiesLine_node
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

const Vulnerabilities = () => {
  const { t_i18n } = useFormatter();
  const { setTitle } = useConnectedDocumentModifier();
  setTitle(t_i18n('Vulnerabilities | Arsenal'));
  const {
    platformModuleHelpers: { isRuntimeFieldEnable },
  } = useAuth();

  const initialValues = {
    searchTerm: '',
    sortBy: 'name',
    orderAsc: true,
    openExports: false,
    filters: emptyFilterGroup,
  };
  const isRuntimeSort = isRuntimeFieldEnable() ?? false;
  const { viewStorage, helpers: storageHelpers, paginationOptions } = usePaginationLocalStorage<VulnerabilitiesLinesPaginationQuery$variables>(
    LOCAL_STORAGE_KEY,
    initialValues,
  );

  const {
    filters,
  } = viewStorage;

  const contextFilters = useBuildEntityTypeBasedFilterContext('Vulnerability', filters);
  const queryPaginationOptions = {
    ...paginationOptions,
    filters: contextFilters,
  } as unknown as VulnerabilitiesLinesPaginationQuery$variables;

  const queryRef = useQueryLoading<VulnerabilitiesLinesPaginationQuery>(
    vulnerabilitiesLinesQuery,
    queryPaginationOptions,
  );

  const dataColumns: DataTableProps['dataColumns'] = {
    name: {
      percentWidth: 22,
      render: (data) => {
        const name = data.name || data.id;
        const link = `${resolveLink('Vulnerability')}/${data.id}`;
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
    x_opencti_cvss_base_score: {
      percentWidth: 8,
      render: ({ x_opencti_cvss_base_score }) => (
        <ItemCvssScore score={x_opencti_cvss_base_score} />
      ),
    },
    x_opencti_cvss_base_severity: {
      percentWidth: 10,
      render: ({ x_opencti_cvss_base_severity }) => (
        <ItemSeverity
          severity={x_opencti_cvss_base_severity}
          label={x_opencti_cvss_base_severity}
        />
      ),
    },
    x_opencti_cisa_kev: {
      percentWidth: 8,
      render: ({ x_opencti_cisa_kev }) => {
        if (!x_opencti_cisa_kev) return EMPTY_VALUE;
        return (
          <Box
            component="span"
            sx={{
              display: 'inline-flex',
              alignItems: 'center',
              fontSize: 12,
              fontWeight: 500,
              color: 'var(--ravin-danger)',
              backgroundColor: 'rgba(242, 15, 15, 0.15)',
              borderRadius: '4px',
              padding: '2px 8px',
              lineHeight: '20px',
              ...lowercaseVoiceSx,
            }}
          >
            {t_i18n('KEV')}
          </Box>
        );
      },
    },
    x_opencti_epss_score: {
      percentWidth: 8,
      render: ({ x_opencti_epss_score }) => {
        if (x_opencti_epss_score == null) return EMPTY_VALUE;
        return (
          <span style={{ color: 'var(--ravin-text-muted)' }}>
            {x_opencti_epss_score.toFixed(2)}
          </span>
        );
      },
    },
    objectLabel: {
      percentWidth: 12,
      render: ({ objectLabel }) => {
        if (!objectLabel || objectLabel.length === 0) return EMPTY_VALUE;
        return (
          <TagsOverflow
            items={objectLabel}
            getKey={(label: { id: string }) => label.id}
            renderTag={(label: { id: string; value: string }) => (
              <Tag label={label.value} labelTextTransform="lowercase" />
            )}
          />
        );
      },
    },
    createdBy: {
      percentWidth: 10,
      isSortable: isRuntimeSort,
      render: ({ createdBy }) => (
        <span style={{ color: 'var(--ravin-text-muted)' }}>
          {defaultRender(createdBy?.name)}
        </span>
      ),
    },
    created: {
      percentWidth: 11,
      render: ({ created }, { rd, nsdt }) => (
        <Tooltip title={nsdt(created)}>
          <span style={{ color: 'var(--ravin-text-muted)' }}>{rd(created)}</span>
        </Tooltip>
      ),
    },
    modified: {
      percentWidth: 11,
      render: ({ modified }, { rd, nsdt }) => (
        <Tooltip title={nsdt(modified)}>
          <span style={{ color: 'var(--ravin-text-muted)' }}>{rd(modified)}</span>
        </Tooltip>
      ),
    },
    objectMarking: {
      percentWidth: 10,
    },
  };

  const preloadedPaginationOptions = {
    linesQuery: vulnerabilitiesLinesQuery,
    linesFragment: vulnerabilitiesLinesFragment,
    queryRef,
    nodePath: ['vulnerabilities', 'pageInfo', 'globalCount'],
    setNumberOfElements: storageHelpers.handleSetNumberOfElements,
  } as UsePreloadedPaginationFragment<VulnerabilitiesLinesPaginationQuery>;

  const createButton = (
    <Security needs={[KNOWLEDGE_KNUPDATE, KNOWLEDGE_KNPARTICIPATE]}>
      <VulnerabilityCreation paginationOptions={queryPaginationOptions} />
    </Security>
  );

  return (
    <div data-testid="vulnerability-page">
      <Breadcrumbs elements={[{ label: t_i18n('Arsenal') }, { label: t_i18n('Vulnerabilities'), current: true }]} />
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
                {t_i18n('Vulnerabilities')}
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
              {t_i18n('Track known vulnerabilities with CVSS scores, CISA KEV status, and EPSS ratings')}
            </Typography>
          </Box>
          {createButton}
        </Box>
        {queryRef && (
          <DataTable
            dataColumns={dataColumns}
            resolvePath={(data: VulnerabilitiesLines_data$data) => (data?.vulnerabilities?.edges || []).map((n) => n?.node)}
            storageKey={LOCAL_STORAGE_KEY}
            initialValues={initialValues}
            contextFilters={contextFilters}
            preloadedPaginationProps={preloadedPaginationOptions}
            lineFragment={vulnerabilityLineFragment}
            exportContext={{ entity_type: 'Vulnerability' }}
            emptyStateMessage={t_i18n('No vulnerabilities yet. Create one to start tracking security vulnerabilities.')}
          />
        )}
      </Box>
    </div>
  );
};

export default Vulnerabilities;
