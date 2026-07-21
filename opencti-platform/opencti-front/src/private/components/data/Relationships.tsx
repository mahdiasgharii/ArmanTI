import React from 'react';
import { graphql } from 'react-relay';
import { Box, Typography, Tooltip } from '@mui/material';
import {
  RelationshipsStixCoreRelationshipsLinesPaginationQuery,
  RelationshipsStixCoreRelationshipsLinesPaginationQuery$variables,
} from '@components/data/__generated__/RelationshipsStixCoreRelationshipsLinesPaginationQuery.graphql';
import { RelationshipsStixCoreRelationshipsLines_data$data } from '@components/data/__generated__/RelationshipsStixCoreRelationshipsLines_data.graphql';
import { AutoFix } from 'mdi-material-ui';
import { getDraftModeColor } from '@components/common/draft/DraftChip';
import { useTheme } from '@mui/styles';
import useAuth from '../../../utils/hooks/useAuth';
import { usePaginationLocalStorage } from '../../../utils/hooks/useLocalStorage';
import useQueryLoading from '../../../utils/hooks/useQueryLoading';
import { emptyFilterGroup, useBuildEntityTypeBasedFilterContext, useGetDefaultFilterObject } from '../../../utils/filters/filtersUtils';
import { useFormatter } from '../../../components/i18n';
import Breadcrumbs from '../../../components/Breadcrumbs';
import DataTable from '../../../components/dataGrid/DataTable';
import { UsePreloadedPaginationFragment } from '../../../utils/hooks/usePreloadedPaginationFragment';
import { DataTableProps } from '../../../components/dataGrid/dataTableTypes';
import ItemIcon from '../../../components/ItemIcon';
import ItemEntityType from '../../../components/ItemEntityType';
import { itemColor } from '../../../utils/Colors';
import useConnectedDocumentModifier from '../../../utils/hooks/useConnectedDocumentModifier';
import ExportContextProvider from '../../../utils/ExportContextProvider';
import { resolveLink } from '../../../utils/Entity';
import { EMPTY_VALUE } from '../../../utils/String';
import { Truncate } from '../../../components/dataGrid/dataTableUtils';
import ItemMarkings from '../../../components/ItemMarkings';
import StixCoreObjectLabels from '../common/stix_core_objects/StixCoreObjectLabels';
import type { Theme } from '../../../components/Theme';

const LOCAL_STORAGE_KEY = 'relationships';

const relationshipsStixCoreRelationshipsLineFragment = graphql`
  fragment RelationshipsStixCoreRelationshipLine_node on StixCoreRelationship {
    id
    entity_type
    parent_types
    relationship_type
    confidence
    start_time
    stop_time
    description
    fromRole
    toRole
    created_at
    updated_at
    is_inferred
    draftVersion {
      draft_id
      draft_operation
    }
    createdBy {
      ... on Identity {
        name
      }
    }
    objectMarking {
      id
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
    objectMarking {
      id
      definition
      x_opencti_order
      x_opencti_color
    }
    from {
      ... on BasicObject {
        id
        entity_type
        parent_types
      }
      ... on BasicRelationship {
        id
        entity_type
        parent_types
      }
      ... on StixCoreObject {
        draftVersion {
          draft_id
          draft_operation
        }
        created_at
        representative {
          main
        }
      }
      ... on StixCoreRelationship {
        draftVersion {
          draft_id
          draft_operation
        }
        created_at
        start_time
        stop_time
        created
        representative {
          main
        }
      }
    }
    to {
      ... on BasicObject {
        id
        entity_type
        parent_types
      }
      ... on BasicRelationship {
        id
        entity_type
        parent_types
      }
      ... on StixCoreObject {
        draftVersion {
          draft_id
          draft_operation
        }
        created_at
        representative {
          main
        }
      }
      ... on StixCoreRelationship {
        draftVersion {
          draft_id
          draft_operation
        }
        created_at
        start_time
        stop_time
        created
        representative {
          main
        }
      }
    }
  }
`;

const relationshipsStixCoreRelationshipsLinesQuery = graphql`
  query RelationshipsStixCoreRelationshipsLinesPaginationQuery(
    $search: String
    $fromId: [String]
    $toId: [String]
    $fromTypes: [String]
    $toTypes: [String]
    $count: Int!
    $cursor: ID
    $orderBy: StixCoreRelationshipsOrdering
    $orderMode: OrderingMode
    $filters: FilterGroup
  ) {
    ...RelationshipsStixCoreRelationshipsLines_data
    @arguments(
      search: $search
      fromId: $fromId
      toId: $toId
      fromTypes: $fromTypes
      toTypes: $toTypes
      count: $count
      cursor: $cursor
      orderBy: $orderBy
      orderMode: $orderMode
      filters: $filters
    )
  }
`;

export const relationshipsStixCoreRelationshipsLinesFragment = graphql`
  fragment RelationshipsStixCoreRelationshipsLines_data on Query
  @argumentDefinitions(
    search: { type: "String" }
    fromId: { type: "[String]" }
    toId: { type: "[String]" }
    fromTypes: { type: "[String]" }
    toTypes: { type: "[String]" }
    count: { type: "Int", defaultValue: 25 }
    cursor: { type: "ID" }
    orderBy: {
      type: "StixCoreRelationshipsOrdering"
      defaultValue: created
    }
    orderMode: { type: "OrderingMode", defaultValue: desc }
    filters: { type: "FilterGroup" },
  )
  @refetchable(queryName: "RelationshipsStixCoreRelationshipsLinesRefetchQuery") {
    stixCoreRelationships(
      search: $search
      fromId: $fromId
      toId: $toId
      fromTypes: $fromTypes
      toTypes: $toTypes
      first: $count
      after: $cursor
      orderBy: $orderBy
      orderMode: $orderMode
      filters: $filters
    ) @connection(key: "Pagination_stixCoreRelationships") {
      edges {
        node {
          id
          entity_type
          created_at
          draftVersion {
            draft_id
            draft_operation
          }
          createdBy {
            ... on Identity {
              name
            }
          }
          objectMarking {
            id
            definition_type
            definition
            x_opencti_order
            x_opencti_color
          }
          ...RelationshipsStixCoreRelationshipLine_node
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

const lowercaseVoiceSx = {
  textTransform: 'lowercase',
  '&::first-letter': { textTransform: 'uppercase' },
} as const;

const Relationships = () => {
  const { t_i18n } = useFormatter();
  const { setTitle } = useConnectedDocumentModifier();
  const theme = useTheme<Theme>();
  setTitle(t_i18n('Relationships | Data'));
  const {
    platformModuleHelpers: { isRuntimeFieldEnable },
  } = useAuth();

  const initialValues = {
    filters: {
      ...emptyFilterGroup,
      filters: useGetDefaultFilterObject(['fromId', 'toId'], ['stix-core-relationship']),
    },
    searchTerm: '',
    sortBy: 'created_at',
    orderAsc: false,
    openExports: false,
  };

  const {
    viewStorage,
    paginationOptions,
    helpers: storageHelpers,
  } = usePaginationLocalStorage<RelationshipsStixCoreRelationshipsLinesPaginationQuery$variables>(
    LOCAL_STORAGE_KEY,
    initialValues,
  );
  const {
    filters,
  } = viewStorage;

  const contextFilters = useBuildEntityTypeBasedFilterContext('stix-core-relationship', filters);
  const queryPaginationOptions = {
    ...paginationOptions,
    filters: contextFilters,
  } as unknown as RelationshipsStixCoreRelationshipsLinesPaginationQuery$variables;
  const queryRef = useQueryLoading<RelationshipsStixCoreRelationshipsLinesPaginationQuery>(
    relationshipsStixCoreRelationshipsLinesQuery,
    queryPaginationOptions,
  );

  const isRuntimeSort = isRuntimeFieldEnable() ?? false;
  const dataColumns: DataTableProps['dataColumns'] = {
    is_inferred: {
      id: 'is_inferred',
      label: ' ',
      isSortable: false,
      percentWidth: 3,
      render: ({ is_inferred, entity_type, draftVersion }) => {
        if (is_inferred) {
          const inferredColor = draftVersion ? getDraftModeColor(theme) : itemColor(entity_type);
          return (<AutoFix style={{ color: inferredColor }} />);
        }
        if (draftVersion) {
          return (<ItemIcon type={entity_type} color={getDraftModeColor(theme)} />);
        }
        return (<ItemIcon type={entity_type} />);
      },
    },
    fromType: {
      percentWidth: 10,
      isSortable: isRuntimeSort,
      render: (data) => {
        const fromType = data.from?.entity_type;
        if (!fromType) return EMPTY_VALUE;
        return <ItemEntityType entityType={fromType} />;
      },
    },
    fromName: {
      percentWidth: 15,
      isSortable: isRuntimeSort,
      render: (data) => {
        const from = data.from;
        if (!from) return EMPTY_VALUE;
        const value = from.representative?.main ?? from.id;
        const link = from.entity_type ? `${resolveLink(from.entity_type)}/${from.id}` : null;
        if (link) {
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
        }
        return (
          <Tooltip title={value}>
            <span style={{ color: 'var(--ravin-text-muted)' }}>
              <Truncate>{value}</Truncate>
            </span>
          </Tooltip>
        );
      },
    },
    relationship_type: {
      percentWidth: 10,
      isSortable: isRuntimeSort,
      render: (data) => {
        const value = data.relationship_type || EMPTY_VALUE;
        return (
          <span
            style={{
              color: itemColor(data.entity_type),
              fontWeight: 500,
              fontSize: '0.8125rem',
            }}
          >
            {value}
          </span>
        );
      },
    },
    toType: {
      percentWidth: 10,
      isSortable: isRuntimeSort,
      render: (data) => {
        const toType = data.to?.entity_type;
        if (!toType) return EMPTY_VALUE;
        return <ItemEntityType entityType={toType} />;
      },
    },
    toName: {
      percentWidth: 15,
      isSortable: isRuntimeSort,
      render: (data) => {
        const to = data.to;
        if (!to) return EMPTY_VALUE;
        const value = to.representative?.main ?? to.id;
        const link = to.entity_type ? `${resolveLink(to.entity_type)}/${to.id}` : null;
        if (link) {
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
        }
        return (
          <Tooltip title={value}>
            <span style={{ color: 'var(--ravin-text-muted)' }}>
              <Truncate>{value}</Truncate>
            </span>
          </Tooltip>
        );
      },
    },
    createdBy: {
      percentWidth: 7,
      isSortable: isRuntimeSort,
      render: ({ createdBy }) => (
        <span style={{ color: 'var(--ravin-text-muted)' }}>
          {createdBy?.name ?? EMPTY_VALUE}
        </span>
      ),
    },
    creator: {
      percentWidth: 7,
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
    created_at: {
      percentWidth: 12,
      isSortable: isRuntimeSort,
      render: ({ created_at }, { fd, nsdt }) => (
        <Tooltip title={nsdt(created_at)}>
          <span>{fd(created_at)}</span>
        </Tooltip>
      ),
    },
    objectMarking: {
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
    linesQuery: relationshipsStixCoreRelationshipsLinesQuery,
    linesFragment: relationshipsStixCoreRelationshipsLinesFragment,
    queryRef,
    nodePath: ['stixCoreRelationships', 'pageInfo', 'globalCount'],
    setNumberOfElements: storageHelpers.handleSetNumberOfElements,
  } as UsePreloadedPaginationFragment<RelationshipsStixCoreRelationshipsLinesPaginationQuery>;

  return (
    <div data-testid="data-relationships-page">
      <ExportContextProvider>
        <Breadcrumbs elements={[{ label: t_i18n('Data') }, { label: t_i18n('Relationships'), current: true }]} />
        <Box sx={{ padding: '24px 24px 0 24px' }}>
          <Box sx={{ marginBottom: 2 }}>
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
                {t_i18n('Relationships')}
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
              {t_i18n('All STIX core relationships in the intelligence workspace')}
            </Typography>
          </Box>
          {queryRef && (
            <DataTable
              dataColumns={dataColumns}
              resolvePath={(data: RelationshipsStixCoreRelationshipsLines_data$data) => data.stixCoreRelationships?.edges?.map((n) => n.node)}
              storageKey={LOCAL_STORAGE_KEY}
              initialValues={initialValues}
              contextFilters={contextFilters}
              lineFragment={relationshipsStixCoreRelationshipsLineFragment}
              preloadedPaginationProps={preloadedPaginationProps}
              exportContext={{ entity_type: 'stix-core-relationship' }}
              availableEntityTypes={['stix-core-relationship']}
              emptyStateMessage={t_i18n('No relationships found. Adjust your filters or create a new relationship.')}
            />
          )}
        </Box>
      </ExportContextProvider>
    </div>
  );
};

export default Relationships;
