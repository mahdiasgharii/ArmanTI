import React, { FunctionComponent } from 'react';
import { graphql } from 'react-relay';
import { Box, Typography, Tooltip } from '@mui/material';
import { SecurityPlatformsPaginationQuery, SecurityPlatformsPaginationQuery$variables } from '@components/entities/__generated__/SecurityPlatformsPaginationQuery.graphql';
import { securityPlatformFragment } from '@components/entities/securityPlatforms/SecurityPlatform';
import { SecurityPlatformsLines_data$data } from '@components/entities/__generated__/SecurityPlatformsLines_data.graphql';
import SecurityPlatformCreation from '@components/entities/securityPlatforms/SecurityPlatformCreation';
import Security from '../../../utils/Security';
import { KNOWLEDGE_KNUPDATE } from '../../../utils/hooks/useGranted';
import useAuth from '../../../utils/hooks/useAuth';
import { usePaginationLocalStorage } from '../../../utils/hooks/useLocalStorage';
import useQueryLoading from '../../../utils/hooks/useQueryLoading';
import { emptyFilterGroup, useBuildEntityTypeBasedFilterContext } from '../../../utils/filters/filtersUtils';
import Breadcrumbs from '../../../components/Breadcrumbs';
import { useFormatter } from '../../../components/i18n';
import { UsePreloadedPaginationFragment } from '../../../utils/hooks/usePreloadedPaginationFragment';
import DataTable from '../../../components/dataGrid/DataTable';
import useConnectedDocumentModifier from '../../../utils/hooks/useConnectedDocumentModifier';
import { DataTableProps } from '../../../components/dataGrid/dataTableTypes';
import ExportContextProvider from '../../../utils/ExportContextProvider';
import { resolveLink } from '../../../utils/Entity';
import { EMPTY_VALUE } from '../../../utils/String';
import { Truncate } from '../../../components/dataGrid/dataTableUtils';
import ItemMarkings from '../../../components/ItemMarkings';
import StixCoreObjectLabels from '../common/stix_core_objects/StixCoreObjectLabels';

const lowercaseVoiceSx = {
  textTransform: 'lowercase',
  '&::first-letter': { textTransform: 'uppercase' },
} as const;

const LOCAL_STORAGE_KEY = 'securityPlatform';

export const securityPlatformsQuery = graphql`
  query SecurityPlatformsPaginationQuery(
    $search: String
    $count: Int!
    $cursor: ID
    $orderBy: SecurityPlatformOrdering
    $orderMode: OrderingMode
    $filters: FilterGroup
  ) {
    ...SecurityPlatformsLines_data
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

export const securityPlatformsFragment = graphql`
  fragment SecurityPlatformsLines_data on Query
  @argumentDefinitions(
    search: { type: "String" }
    count: { type: "Int", defaultValue: 25 }
    cursor: { type: "ID" }
    orderBy: { type: "SecurityPlatformOrdering", defaultValue: name }
    orderMode: { type: "OrderingMode", defaultValue: asc }
    filters: { type: "FilterGroup" }
  )
  @refetchable(queryName: "SecurityPlatformsLinesRefetchQuery") {
    securityPlatforms(
      search: $search
      first: $count
      after: $cursor
      orderBy: $orderBy
      orderMode: $orderMode
      filters: $filters
    ) @connection(key: "Pagination_securityPlatforms") {
      edges {
        node {
          id
          name
          description
          security_platform_type
          ...SecurityPlatform_securityPlatform
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

const SecurityPlatforms: FunctionComponent = () => {
  const { t_i18n } = useFormatter();
  const { setTitle } = useConnectedDocumentModifier();
  setTitle(t_i18n('Security platforms | Entities'));
  const {
    platformModuleHelpers: { isRuntimeFieldEnable },
  } = useAuth();
  const isRuntimeSort = isRuntimeFieldEnable() ?? false;

  const initialValues = {
    filters: emptyFilterGroup,
    searchTerm: '',
    sortBy: 'name',
    orderAsc: true,
    openExports: false,
  };
  const { viewStorage, helpers: storageHelpers, paginationOptions } = usePaginationLocalStorage<SecurityPlatformsPaginationQuery$variables>(
    LOCAL_STORAGE_KEY,
    initialValues,
  );

  const contextFilters = useBuildEntityTypeBasedFilterContext('SecurityPlatform', viewStorage.filters);
  const queryPaginationOptions = {
    ...paginationOptions,
    filters: contextFilters,
  } as unknown as SecurityPlatformsPaginationQuery$variables;

  const queryRef = useQueryLoading<SecurityPlatformsPaginationQuery>(
    securityPlatformsQuery,
    queryPaginationOptions,
  );

  const dataColumns: DataTableProps['dataColumns'] = {
    name: {
      percentWidth: 22,
      isSortable: isRuntimeSort,
      render: (data) => {
        const value = data.name || data.id;
        const link = `${resolveLink('SecurityPlatform')}/${data.id}`;
        return (
          <Tooltip title={value}>
            <a
              href={link}
              style={{
                color: 'var(--ravin-primary)',
                textDecoration: 'none',
                fontWeight: 500,
              }}
            >
              <Truncate>{value}</Truncate>
            </a>
          </Tooltip>
        );
      },
    },
    security_platform_type: {
      percentWidth: 13,
      isSortable: isRuntimeSort,
      render: ({ security_platform_type }) => (
        <span style={{ color: 'var(--ravin-text-muted)' }}>
          {security_platform_type ?? EMPTY_VALUE}
        </span>
      ),
    },
    createdBy: {
      percentWidth: 12,
      isSortable: isRuntimeSort,
      render: ({ createdBy }) => (
        <span style={{ color: 'var(--ravin-text-muted)' }}>
          {createdBy?.name ?? EMPTY_VALUE}
        </span>
      ),
    },
    creator: {
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
      percentWidth: 13,
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
    created: {
      percentWidth: 10,
      isSortable: isRuntimeSort,
      render: ({ created }, { fd, nsdt }) => (
        <Tooltip title={nsdt(created)}>
          <span>{fd(created)}</span>
        </Tooltip>
      ),
    },
    modified: {
      percentWidth: 10,
      isSortable: isRuntimeSort,
      render: ({ modified }, { fd, nsdt }) => (
        <Tooltip title={nsdt(modified)}>
          <span>{fd(modified)}</span>
        </Tooltip>
      ),
    },
    objectMarking: {
      percentWidth: 8,
      isSortable: isRuntimeSort,
      render: ({ objectMarking }, { storageHelpers: { handleAddFilter } }) => (
        <ItemMarkings
          markingDefinitions={objectMarking ?? []}
          limit={1}
          onClick={(m) => handleAddFilter('objectMarking', m.id, 'eq')}
        />
      ),
    },
  };

  const preloadedPaginationProps = {
    linesQuery: securityPlatformsQuery,
    linesFragment: securityPlatformsFragment,
    queryRef,
    nodePath: ['securityPlatforms', 'pageInfo', 'globalCount'],
    setNumberOfElements: storageHelpers.handleSetNumberOfElements,
  } as UsePreloadedPaginationFragment<SecurityPlatformsPaginationQuery>;

  const createButton = (
    <Security needs={[KNOWLEDGE_KNUPDATE]}>
      <SecurityPlatformCreation paginationOptions={queryPaginationOptions} />
    </Security>
  );

  return (
    <div data-testid="security-platform-page">
      <ExportContextProvider>
        <Breadcrumbs elements={[{ label: t_i18n('Entities') }, { label: t_i18n('Security platforms'), current: true }]} />
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
                  {t_i18n('Security platforms')}
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
                {t_i18n('Security platforms and tools used across threat intelligence operations')}
              </Typography>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, flexShrink: 0 }}>
              {createButton}
            </Box>
          </Box>
          {queryRef && (
            <DataTable
              dataColumns={dataColumns}
              resolvePath={(data: SecurityPlatformsLines_data$data) => data.securityPlatforms?.edges?.map((n) => n?.node)}
              storageKey={LOCAL_STORAGE_KEY}
              initialValues={initialValues}
              contextFilters={contextFilters}
              preloadedPaginationProps={preloadedPaginationProps}
              lineFragment={securityPlatformFragment}
              exportContext={{ entity_type: 'SecurityPlatform' }}
              emptyStateMessage={t_i18n('No security platforms yet. Create one to start tracking security tools and platforms.')}
            />
          )}
        </Box>
      </ExportContextProvider>
    </div>
  );
};

export default SecurityPlatforms;
