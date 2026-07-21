import React from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Tooltip from '@mui/material/Tooltip';
import CourseOfActionCreation from '@components/techniques/courses_of_action/CourseOfActionCreation';
import { graphql } from 'react-relay';
import { CoursesOfActionLines_data$data } from '@components/techniques/__generated__/CoursesOfActionLines_data.graphql';
import {
  CoursesOfActionLinesPaginationQuery,
  CoursesOfActionLinesPaginationQuery$variables,
} from '@components/techniques/__generated__/CoursesOfActionLinesPaginationQuery.graphql';
import Security from '../../../utils/Security';
import { KNOWLEDGE_KNUPDATE } from '../../../utils/hooks/useGranted';
import { usePaginationLocalStorage } from '../../../utils/hooks/useLocalStorage';
import useQueryLoading from '../../../utils/hooks/useQueryLoading';
import { useBuildEntityTypeBasedFilterContext, emptyFilterGroup } from '../../../utils/filters/filtersUtils';
import { useFormatter } from '../../../components/i18n';
import Breadcrumbs from '../../../components/Breadcrumbs';
import DataTable from '../../../components/dataGrid/DataTable';
import { DataTableProps } from '../../../components/dataGrid/dataTableTypes';
import { UsePreloadedPaginationFragment } from '../../../utils/hooks/usePreloadedPaginationFragment';
import useConnectedDocumentModifier from '../../../utils/hooks/useConnectedDocumentModifier';
import { resolveLink } from '../../../utils/Entity';
import { EMPTY_VALUE } from '../../../utils/String';
import { Truncate } from '../../../components/dataGrid/dataTableUtils';
import Tag from '../../../components/common/tag/Tag';
import TagsOverflow from '../../../components/common/tag/TagsOverflow';

const lowercaseVoiceSx = {
  textTransform: 'lowercase',
  '&::first-letter': { textTransform: 'uppercase' },
} as const;

const LOCAL_STORAGE_KEY = 'coursesOfAction';

const CourseOfActionLineFragment = graphql`
  fragment CoursesOfActionLine_node on CourseOfAction {
    id
    entity_type
    name
    created
    modified
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
  }
`;

const coursesOfActionLinesQuery = graphql`
  query CoursesOfActionLinesPaginationQuery(
    $search: String
    $count: Int!
    $cursor: ID
    $orderBy: CoursesOfActionOrdering
    $orderMode: OrderingMode
    $filters: FilterGroup
  ) {
    ...CoursesOfActionLines_data
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

export const coursesOfActionLinesFragment = graphql`
  fragment CoursesOfActionLines_data on Query
  @argumentDefinitions(
    search: { type: "String" }
    count: { type: "Int", defaultValue: 25 }
    cursor: { type: "ID" }
    orderBy: { type: "CoursesOfActionOrdering", defaultValue: name }
    orderMode: { type: "OrderingMode", defaultValue: asc }
    filters: { type: "FilterGroup" }
  )
  @refetchable(queryName: "CoursesOfActionLinesRefetchQuery") {
    coursesOfAction(
      search: $search
      first: $count
      after: $cursor
      orderBy: $orderBy
      orderMode: $orderMode
      filters: $filters
    ) @connection(key: "Pagination_coursesOfAction") {
      edges {
        node {
          id
          name
          ...CoursesOfActionLine_node
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

const CoursesOfAction = () => {
  const { t_i18n } = useFormatter();
  const { setTitle } = useConnectedDocumentModifier();
  setTitle(t_i18n('Courses of Action | Techniques'));

  const initialValues = {
    searchTerm: '',
    sortBy: 'name',
    orderAsc: true,
    openExports: false,
    filters: emptyFilterGroup,
  };

  const {
    viewStorage,
    helpers: storageHelpers,
    paginationOptions,
  } = usePaginationLocalStorage<CoursesOfActionLinesPaginationQuery$variables>(
    LOCAL_STORAGE_KEY,
    initialValues,
  );

  const { filters } = viewStorage;

  const contextFilters = useBuildEntityTypeBasedFilterContext('Course-Of-Action', filters);

  const queryPaginationOptions = {
    ...paginationOptions,
    filters: contextFilters,
  } as unknown as CoursesOfActionLinesPaginationQuery$variables;

  const dataColumns: DataTableProps['dataColumns'] = {
    name: {
      percentWidth: 30,
      render: (data) => {
        const name = data.name || data.id;
        const link = `${resolveLink('Course-Of-Action')}/${data.id}`;
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
    objectLabel: {
      percentWidth: 20,
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
    created: {
      percentWidth: 17,
      render: ({ created }, { rd, nsdt }) => (
        <Tooltip title={nsdt(created)}>
          <span style={{ color: 'var(--ravin-text-muted)' }}>{rd(created)}</span>
        </Tooltip>
      ),
    },
    modified: {
      percentWidth: 17,
      render: ({ modified }, { rd, nsdt }) => (
        <Tooltip title={nsdt(modified)}>
          <span style={{ color: 'var(--ravin-text-muted)' }}>{rd(modified)}</span>
        </Tooltip>
      ),
    },
    objectMarking: {
      percentWidth: 16,
    },
  };

  const queryRef = useQueryLoading<CoursesOfActionLinesPaginationQuery>(
    coursesOfActionLinesQuery,
    queryPaginationOptions,
  );

  const preloadedPaginationOptions = {
    linesQuery: coursesOfActionLinesQuery,
    linesFragment: coursesOfActionLinesFragment,
    queryRef,
    nodePath: ['coursesOfAction', 'pageInfo', 'globalCount'],
    setNumberOfElements: storageHelpers.handleSetNumberOfElements,
  } as UsePreloadedPaginationFragment<CoursesOfActionLinesPaginationQuery>;

  const createButton = (
    <Security needs={[KNOWLEDGE_KNUPDATE]}>
      <CourseOfActionCreation paginationOptions={queryPaginationOptions} />
    </Security>
  );

  return (
    <div data-testid="course-of-action-page">
      <Breadcrumbs elements={[{ label: t_i18n('Techniques') }, { label: t_i18n('Courses of action'), current: true }]} />
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
                {t_i18n('Courses of action')}
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
              {t_i18n('Define defensive measures and countermeasures against attack patterns')}
            </Typography>
          </Box>
          {createButton}
        </Box>
        {queryRef && (
          <DataTable
            dataColumns={dataColumns}
            preloadedPaginationProps={preloadedPaginationOptions}
            initialValues={initialValues}
            contextFilters={contextFilters}
            exportContext={{ entity_type: 'Course-Of-Action' }}
            lineFragment={CourseOfActionLineFragment}
            resolvePath={(data: CoursesOfActionLines_data$data) => data.coursesOfAction?.edges?.map((e) => e?.node)}
            storageKey={LOCAL_STORAGE_KEY}
            emptyStateMessage={t_i18n('No courses of action yet. Create one to define defensive measures against threats.')}
          />
        )}
      </Box>
    </div>
  );
};

export default CoursesOfAction;
