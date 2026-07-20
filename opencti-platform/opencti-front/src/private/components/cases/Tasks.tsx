import React from 'react';
import { graphql } from 'react-relay';
import { Box, Typography } from '@mui/material';
import { TasksLinesPaginationQuery, TasksLinesPaginationQuery$variables } from './__generated__/TasksLinesPaginationQuery.graphql';
import { TasksLines_data$data } from './__generated__/TasksLines_data.graphql';
import { usePaginationLocalStorage } from '../../../utils/hooks/useLocalStorage';
import useQueryLoading from '../../../utils/hooks/useQueryLoading';
import { useBuildEntityTypeBasedFilterContext, emptyFilterGroup } from '../../../utils/filters/filtersUtils';
import { useFormatter } from '../../../components/i18n';
import Breadcrumbs from '../../../components/Breadcrumbs';
import DataTable from '../../../components/dataGrid/DataTable';
import { UsePreloadedPaginationFragment } from '../../../utils/hooks/usePreloadedPaginationFragment';
import ItemDueDate from '../../../components/ItemDueDate';
import { DataTableProps } from '../../../components/dataGrid/dataTableTypes';
import useConnectedDocumentModifier from '../../../utils/hooks/useConnectedDocumentModifier';
import { TasksLine_node$data } from './__generated__/TasksLine_node.graphql';

const TaskFragment = graphql`
  fragment TasksLine_node on Task {
    id
    standard_id
    name
    due_date
    description
    workflowEnabled
    entity_type
    draftVersion {
      draft_id
      draft_operation
    }
    objectMarking {
      definition
      definition_type
      id
    }
    objectLabel {
      id
      value
      color
    }
    objectAssignee {
      entity_type
      id
      name
    }
    status {
      template {
        name
        color
      }
    }
  }
`;

const tasksLinesQuery = graphql`
  query TasksLinesPaginationQuery(
    $search: String
    $count: Int
    $cursor: ID
    $orderBy: TasksOrdering
    $orderMode: OrderingMode
    $filters: FilterGroup
  ) {
    ...TasksLines_data
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

const tasksLinesFragment = graphql`
  fragment TasksLines_data on Query
  @argumentDefinitions(
    search: { type: "String" }
    count: { type: "Int" }
    cursor: { type: "ID" }
    orderBy: { type: "TasksOrdering" }
    orderMode: { type: "OrderingMode", defaultValue: desc }
    filters: { type: "FilterGroup" }
  )
  @refetchable(queryName: "TasksLinesRefetchQuery") {
    tasks(
      search: $search
      first: $count
      after: $cursor
      orderBy: $orderBy
      orderMode: $orderMode
      filters: $filters
    ) @connection(key: "Pagination_tasks__tasks") {
      edges {
        node {
          id
          ...TasksLine_node
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

export const LOCAL_STORAGE_KEY_TASKS = 'cases-casesTasks';

const lowercaseVoiceSx = {
  textTransform: 'lowercase',
  '&::first-letter': { textTransform: 'uppercase' },
} as const;

const Tasks = () => {
  const { t_i18n } = useFormatter();
  const { setTitle } = useConnectedDocumentModifier();
  setTitle(t_i18n('Tasks | Cases'));

  const initialValues = {
    searchTerm: '',
    sortBy: 'created',
    orderAsc: false,
    openExports: false,
    filters: emptyFilterGroup,
  };
  const { viewStorage, helpers: storageHelpers, paginationOptions } = usePaginationLocalStorage<TasksLinesPaginationQuery$variables>(
    LOCAL_STORAGE_KEY_TASKS,
    initialValues,
  );

  const {
    filters,
  } = viewStorage;

  const contextFilters = useBuildEntityTypeBasedFilterContext('Task', filters);
  const queryPaginationOptions = {
    ...paginationOptions,
    filters: contextFilters,
  } as unknown as TasksLinesPaginationQuery$variables;
  const queryRef = useQueryLoading<TasksLinesPaginationQuery>(
    tasksLinesQuery,
    queryPaginationOptions,
  );

  const dataColumns: DataTableProps['dataColumns'] = {
    name: { percentWidth: 35 },
    due_date: {
      label: 'Due Date',
      percentWidth: 15,
      isSortable: true,
      render: (task: TasksLine_node$data) => (
        <ItemDueDate due_date={task.due_date} variant="inList" />
      ),
    },
    objectAssignee: { percentWidth: 20 },
    objectLabel: { percentWidth: 20 },
    x_opencti_workflow_id: { percentWidth: 10 },
  };

  const preloadedPaginationProps = {
    linesQuery: tasksLinesQuery,
    linesFragment: tasksLinesFragment,
    queryRef,
    nodePath: ['tasks', 'pageInfo', 'globalCount'],
    setNumberOfElements: storageHelpers.handleSetNumberOfElements,
  } as UsePreloadedPaginationFragment<TasksLinesPaginationQuery>;

  return (
    <div data-testid="task-page">
      <Breadcrumbs elements={[{ label: t_i18n('Cases') }, { label: t_i18n('Tasks'), current: true }]} />
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
                {t_i18n('Tasks')}
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
              {t_i18n('Track and manage tasks across all cases')}
            </Typography>
          </Box>
        </Box>
        {queryRef && (
          <DataTable
            dataColumns={dataColumns}
            resolvePath={(data: TasksLines_data$data) => data.tasks?.edges?.map((n) => n?.node)}
            storageKey={LOCAL_STORAGE_KEY_TASKS}
            initialValues={initialValues}
            contextFilters={contextFilters}
            preloadedPaginationProps={preloadedPaginationProps}
            lineFragment={TaskFragment}
            exportContext={{ entity_type: 'Task' }}
            emptyStateMessage={t_i18n('No tasks yet. Tasks are created from within a case or container.')}
          />
        )}
        {/* TODO Add task creation when it will be possible to assign a task to something
             <Security needs={[KNOWLEDGE_KNUPDATE]}>
            <TaskCreation paginationOptions={paginationOptions} />
          </Security> */}
      </Box>
    </div>
  );
};

export default Tasks;
