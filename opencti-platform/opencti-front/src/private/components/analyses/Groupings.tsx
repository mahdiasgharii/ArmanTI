import React, { FunctionComponent } from 'react';
import { graphql } from 'react-relay';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Tooltip from '@mui/material/Tooltip';
import { GroupingsLinesPaginationQuery, GroupingsLinesPaginationQuery$variables } from '@components/analyses/__generated__/GroupingsLinesPaginationQuery.graphql';
import { GroupingsLines_data$data } from '@components/analyses/__generated__/GroupingsLines_data.graphql';
import StixCoreObjectForms from '@components/common/stix_core_objects/StixCoreObjectForms';
import GroupingCreation from './groupings/GroupingCreation';
import useAuth from '../../../utils/hooks/useAuth';
import { usePaginationLocalStorage } from '../../../utils/hooks/useLocalStorage';
import useQueryLoading from '../../../utils/hooks/useQueryLoading';
import { emptyFilterGroup, useBuildEntityTypeBasedFilterContext, useGetDefaultFilterObject } from '../../../utils/filters/filtersUtils';
import { useFormatter } from '../../../components/i18n';
import Breadcrumbs from '../../../components/Breadcrumbs';
import useConnectedDocumentModifier from '../../../utils/hooks/useConnectedDocumentModifier';
import { DataTableProps } from '../../../components/dataGrid/dataTableTypes';
import DataTable from '../../../components/dataGrid/DataTable';
import { Truncate } from '../../../components/dataGrid/dataTableUtils';
import { UsePreloadedPaginationFragment } from '../../../utils/hooks/usePreloadedPaginationFragment';
import { KNOWLEDGE_KNUPDATE, KNOWLEDGE_KNASKIMPORT } from '../../../utils/hooks/useGranted';
import Security from '../../../utils/Security';
import { resolveLink } from '../../../utils/Entity';
import { EMPTY_VALUE } from '../../../utils/String';
import Tag from '../../../components/common/tag/Tag';
import StixCoreObjectLabels from '../common/stix_core_objects/StixCoreObjectLabels';

const LOCAL_STORAGE_KEY = 'groupings';

interface GroupingsProps {
  match: { params: { groupingContext: string } };
}

const groupingLineFragment = graphql`
  fragment GroupingsLine_node on Grouping {
    id
    entity_type
    created
    name
    description
    context
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
        name
        color
      }
    }
    workflowEnabled
  }
`;

const groupingsLinesQuery = graphql`
  query GroupingsLinesPaginationQuery(
    $search: String
    $count: Int!
    $cursor: ID
    $orderBy: GroupingsOrdering
    $orderMode: OrderingMode
    $filters: FilterGroup
  ) {
    ...GroupingsLines_data
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

const groupingsLineFragment = graphql`
  fragment GroupingsLines_data on Query
  @argumentDefinitions(
    search: { type: "String" }
    count: { type: "Int", defaultValue: 25 }
    cursor: { type: "ID" }
    orderBy: { type: "GroupingsOrdering", defaultValue: name }
    orderMode: { type: "OrderingMode", defaultValue: asc }
    filters: { type: "FilterGroup" }
  )
  @refetchable(queryName: "GroupingsLinesRefetchQuery") {
    groupings(
      search: $search
      first: $count
      after: $cursor
      orderBy: $orderBy
      orderMode: $orderMode
      filters: $filters
    ) @connection(key: "Pagination_groupings") {
      edges {
        node {
          id
          name
          context
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
          ...GroupingsLine_node
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

const Groupings: FunctionComponent<GroupingsProps> = () => {
  const { t_i18n } = useFormatter();
  const { setTitle } = useConnectedDocumentModifier();
  setTitle(t_i18n('Groupings | Analyses'));
  const { platformModuleHelpers: { isRuntimeFieldEnable } } = useAuth();

  const initialValues = {
    filters: {
      ...emptyFilterGroup,
      filters: useGetDefaultFilterObject(['context'], ['Grouping']),
    },
    searchTerm: '',
    sortBy: 'created',
    orderAsc: false,
    openExports: false,
    count: 25,
  };
  const {
    viewStorage,
    paginationOptions,
    helpers: storageHelpers,
  } = usePaginationLocalStorage<GroupingsLinesPaginationQuery$variables>(
    LOCAL_STORAGE_KEY,
    initialValues,
  );
  const {
    filters,
  } = viewStorage;

  const contextFilters = useBuildEntityTypeBasedFilterContext('Grouping', filters);
  const queryPaginationOptions = {
    ...paginationOptions,
    filters: contextFilters,
  } as unknown as GroupingsLinesPaginationQuery$variables;
  const queryRef = useQueryLoading<GroupingsLinesPaginationQuery>(
    groupingsLinesQuery,
    queryPaginationOptions,
  );

  const isRuntimeSort = isRuntimeFieldEnable() ?? false;
  const dataColumns: DataTableProps['dataColumns'] = {
    name: {
      id: 'name',
      percentWidth: 25,
      isSortable: true,
      render: (data) => {
        const name = data.name || data.id;
        const link = `${resolveLink('Grouping')}/${data.id}`;
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
    context: {
      id: 'context',
      render: ({ context }, { storageHelpers: { handleAddFilter } }) => {
        if (!context) return EMPTY_VALUE;
        return (
          <Tag
            label={context}
            labelTextTransform="lowercase"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              handleAddFilter('context', context, 'eq');
            }}
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
    created: {
      id: 'created',
      percentWidth: 10,
      render: ({ created }, { rd, nsdt }) => (
        <Tooltip title={nsdt(created)}>
          <span>{rd(created)}</span>
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

  const preloadedPaginationProps = {
    linesQuery: groupingsLinesQuery,
    linesFragment: groupingsLineFragment,
    queryRef,
    nodePath: ['groupings', 'pageInfo', 'globalCount'],
    setNumberOfElements: storageHelpers.handleSetNumberOfElements,
  } as UsePreloadedPaginationFragment<GroupingsLinesPaginationQuery>;

  const createButton = (
    <Security needs={[KNOWLEDGE_KNUPDATE]}>
      <GroupingCreation paginationOptions={queryPaginationOptions} />
    </Security>
  );
  return (
    <span data-testid="groupings-page">
      <Breadcrumbs elements={[{ label: t_i18n('Analyses') }, { label: t_i18n('Groupings'), current: true }]} />
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
              {t_i18n('Groupings')}
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
            resolvePath={(data: GroupingsLines_data$data) => data.groupings?.edges?.map((n) => n?.node)}
            storageKey={LOCAL_STORAGE_KEY}
            initialValues={initialValues}
            contextFilters={contextFilters}
            preloadedPaginationProps={preloadedPaginationProps}
            lineFragment={groupingLineFragment}
            exportContext={{ entity_type: 'Grouping' }}
            redirectionModeEnabled
            additionalHeaderButtons={[
              <Security key="form-intake" needs={[KNOWLEDGE_KNUPDATE]} capabilitiesInDraft={[KNOWLEDGE_KNASKIMPORT]}>
                <StixCoreObjectForms entityType="Grouping" />
              </Security>,
            ]}
            emptyStateMessage={t_i18n('No groupings yet. Create one to organize and correlate related threat intelligence entities.')}
          />
        )}
      </Box>
    </span>
  );
};

export default Groupings;
