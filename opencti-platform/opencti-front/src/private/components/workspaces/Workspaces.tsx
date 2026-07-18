import React, { FunctionComponent } from 'react';
import { graphql } from 'react-relay';
import { ErrorBoundary } from '@components/Error';
import { WorkspacesLinesPaginationQuery, WorkspacesLinesPaginationQuery$variables } from '@components/workspaces/__generated__/WorkspacesLinesPaginationQuery.graphql';
import { WorkspacesLines_data$data } from '@components/workspaces/__generated__/WorkspacesLines_data.graphql';
import WorkspacePopover from '@components/workspaces/WorkspacePopover';
import WorkspaceCreation from './WorkspaceCreation';
import Security from '../../../utils/Security';
import { EXPLORE, EXPLORE_EXUPDATE, INVESTIGATION_INUPDATE } from '../../../utils/hooks/useGranted';
import { usePaginationLocalStorage } from '../../../utils/hooks/useLocalStorage';
import useQueryLoading from '../../../utils/hooks/useQueryLoading';
import { emptyFilterGroup, useBuildEntityTypeBasedFilterContext } from '../../../utils/filters/filtersUtils';
import Breadcrumbs from '../../../components/Breadcrumbs';
import { useFormatter } from '../../../components/i18n';
import DataTable from '../../../components/dataGrid/DataTable';
import { DataTableProps } from '../../../components/dataGrid/dataTableTypes';
import { defaultRender, Truncate } from '../../../components/dataGrid/dataTableUtils';
import useConnectedDocumentModifier from '../../../utils/hooks/useConnectedDocumentModifier';
import { resolveLink } from '../../../utils/Entity';
import { EMPTY_VALUE } from '../../../utils/String';
import Tag from '../../../components/common/tag/Tag';
import TagsOverflow from '../../../components/common/tag/TagsOverflow';
import Tooltip from '@mui/material/Tooltip';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';

export const workspaceLineFragment = graphql`
  fragment WorkspacesLine_node on Workspace {
    id
    name
    tags
    created_at
    updated_at
    type
    manifest
    isShared
    entity_type
    owner {
      id
      name
      entity_type
    }
    currentUserAccessRight
    ...WorkspacePopoverFragment
  }
`;

export const workspacesLinesQuery = graphql`
  query WorkspacesLinesPaginationQuery(
    $search: String
    $count: Int!
    $cursor: ID
    $orderBy: WorkspacesOrdering
    $orderMode: OrderingMode
    $filters: FilterGroup
  ) {
    ...WorkspacesLines_data
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

export const workspacesLineFragment = graphql`
  fragment WorkspacesLines_data on Query
  @argumentDefinitions(
    search: { type: "String" }
    count: { type: "Int", defaultValue: 25 }
    cursor: { type: "ID" }
    orderBy: { type: "WorkspacesOrdering", defaultValue: name }
    orderMode: { type: "OrderingMode", defaultValue: asc }
    filters: { type: "FilterGroup" }
  )
  @refetchable(queryName: "WorkspacesLinesRefetchQuery") {
    workspaces(
      search: $search
      first: $count
      after: $cursor
      orderBy: $orderBy
      orderMode: $orderMode
      filters: $filters
    ) @connection(key: "Pagination_workspaces") {
      edges {
        node {
          id
          ...WorkspacesLine_node
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

interface WorkspacesProps {
  type: string;
}

const Workspaces: FunctionComponent<WorkspacesProps> = ({
  type,
}) => {
  const { t_i18n } = useFormatter();
  const { setTitle } = useConnectedDocumentModifier();
  setTitle(type === 'dashboard' ? t_i18n('Custom dashboards | Dashboards') : t_i18n('Investigations'));

  const LOCAL_STORAGE_KEY = `view-${type}-list`;
  const initialStorageValues = {
    searchTerm: '',
    sortBy: 'name',
    orderAsc: false,
    openExports: false,
    redirectionMode: 'overview',
    filters: emptyFilterGroup,
  };
  const {
    viewStorage,
    paginationOptions,
    helpers: storageHelpers,
  } = usePaginationLocalStorage<WorkspacesLinesPaginationQuery$variables>(
    `view-${type}-list`,
    initialStorageValues,
  );

  const filters = useBuildEntityTypeBasedFilterContext(
    'Workspace',
    {
      mode: 'and',
      filters: [{
        key: 'type',
        values: [type],
        mode: 'or',
        operator: 'eq',
      }],
      filterGroups: viewStorage.filters ? [viewStorage.filters] : [],
    },
  );

  const workspacePaginationOptions = {
    ...paginationOptions,
    filters,
  } as unknown as WorkspacesLinesPaginationQuery$variables;

  const queryRef = useQueryLoading<WorkspacesLinesPaginationQuery>(
    workspacesLinesQuery,
    workspacePaginationOptions,
  );

  const isInvestigation = type === 'investigation';

  const dataColumns: DataTableProps['dataColumns'] = {
    name: {
      id: 'name',
      percentWidth: 33,
      ...(isInvestigation ? {
        render: (data) => {
          const name = data.name || data.id;
          const link = `${resolveLink('Investigation')}/${data.id}`;
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
      } : {}),
    },
    tags: {
      id: 'tags',
      ...(isInvestigation ? {
        render: ({ tags }) => {
          if (!tags || tags.length === 0) return EMPTY_VALUE;
          return (
            <TagsOverflow
              items={tags}
              getKey={(tag: string) => tag}
              renderTag={(tag: string) => (
                <Tag label={tag} labelTextTransform="lowercase" />
              )}
            />
          );
        },
      } : {}),
    },
    creator: {
      id: 'creator',
      isSortable: true,
      render: ({ owner }) => (
        <span style={{ color: isInvestigation ? 'var(--ravin-text-muted)' : undefined }}>
          {defaultRender(owner.name)}
        </span>
      ),
    },
    created_at: {
      id: 'created_at',
      percentWidth: 16,
      ...(isInvestigation ? {
        render: ({ created_at }, { rd, nsdt }) => (
          <Tooltip title={nsdt(created_at)}>
            <span>{rd(created_at)}</span>
          </Tooltip>
        ),
      } : {}),
    },
    updated_at: {
      id: 'updated_at',
      percentWidth: isInvestigation ? 20 : 16,
      ...(isInvestigation ? {
        render: ({ updated_at }, { rd, nsdt }) => (
          <Tooltip title={nsdt(updated_at)}>
            <span>{rd(updated_at)}</span>
          </Tooltip>
        ),
      } : {}),
    },
    ...(type === 'dashboard' ? {
      isShared: {
        id: 'isShared',
      },
    } : {}),
  };

  const createButton = (
    <Security needs={[EXPLORE_EXUPDATE, INVESTIGATION_INUPDATE]}>
      <WorkspaceCreation
        paginationOptions={workspacePaginationOptions}
        type={type}
      />
    </Security>
  );

  return (
    <>
      <Breadcrumbs
        elements={type === 'dashboard'
          ? [{ label: t_i18n('Dashboards') }, { label: t_i18n('Custom dashboards'), current: true }]
          : [{ label: t_i18n('Investigations'), current: true }]
        }
      />

      {isInvestigation && (
        <Box sx={{ padding: '24px 24px 0 24px' }}>
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
                {t_i18n('Investigations')}
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
              resolvePath={(data: WorkspacesLines_data$data) => {
                return data.workspaces?.edges?.map((n) => n?.node);
              }}
              storageKey={LOCAL_STORAGE_KEY}
              initialValues={initialStorageValues}
              contextFilters={filters}
              preloadedPaginationProps={{
                linesQuery: workspacesLinesQuery,
                linesFragment: workspacesLineFragment,
                queryRef,
                nodePath: ['workspaces', 'pageInfo', 'globalCount'],
                setNumberOfElements: storageHelpers.handleSetNumberOfElements,
              }}
              lineFragment={workspaceLineFragment}
              entityTypes={['Workspace']}
              searchContextFinal={{ entityTypes: ['Workspace'] }}
              emptyStateMessage={t_i18n('No investigations yet. Create one to start graphing threat relationships.')}
              taskScope="INVESTIGATION"
              actions={(row) => (
                <Security needs={[INVESTIGATION_INUPDATE]}>
                  <ErrorBoundary display={() => null}>
                    <WorkspacePopover
                      data={row}
                      paginationOptions={workspacePaginationOptions}
                    />
                  </ErrorBoundary>
                </Security>
              )}
            />
          )}
        </Box>
      )}

      {!isInvestigation && queryRef && (
        <DataTable
          dataColumns={dataColumns}
          resolvePath={(data: WorkspacesLines_data$data) => {
            return data.workspaces?.edges?.map((n) => n?.node);
          }}
          storageKey={LOCAL_STORAGE_KEY}
          initialValues={initialStorageValues}
          contextFilters={filters}
          preloadedPaginationProps={{
            linesQuery: workspacesLinesQuery,
            linesFragment: workspacesLineFragment,
            queryRef,
            nodePath: ['workspaces', 'pageInfo', 'globalCount'],
            setNumberOfElements: storageHelpers.handleSetNumberOfElements,
          }}
          lineFragment={workspaceLineFragment}
          entityTypes={['Workspace']}
          searchContextFinal={{ entityTypes: ['Workspace'] }}
          createButton={createButton}
          taskScope={type === 'dashboard' ? 'DASHBOARD' : 'INVESTIGATION'}
          actions={(row) => (
            <Security needs={row.type === 'dashboard' ? [EXPLORE] : [INVESTIGATION_INUPDATE]}>
              <ErrorBoundary display={() => null}>
                <WorkspacePopover
                  data={row}
                  paginationOptions={workspacePaginationOptions}
                />
              </ErrorBoundary>
            </Security>
          )}
        />
      )}
    </>
  );
};

export default Workspaces;
