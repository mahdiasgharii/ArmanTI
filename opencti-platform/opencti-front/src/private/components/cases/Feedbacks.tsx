import React, { FunctionComponent } from 'react';
import { graphql } from 'react-relay';
import { Box, Typography } from '@mui/material';
import { FeedbacksLinesPaginationQuery, FeedbacksLinesPaginationQuery$variables } from '@components/cases/__generated__/FeedbacksLinesPaginationQuery.graphql';
import { FeedbacksLines_data$data } from '@components/cases/__generated__/FeedbacksLines_data.graphql';
import { usePaginationLocalStorage } from '../../../utils/hooks/useLocalStorage';
import useQueryLoading from '../../../utils/hooks/useQueryLoading';
import useAuth from '../../../utils/hooks/useAuth';
import { useBuildEntityTypeBasedFilterContext, emptyFilterGroup } from '../../../utils/filters/filtersUtils';
import { useFormatter } from '../../../components/i18n';
import Breadcrumbs from '../../../components/Breadcrumbs';
import DataTable from '../../../components/dataGrid/DataTable';
import { UsePreloadedPaginationFragment } from '../../../utils/hooks/usePreloadedPaginationFragment';
import { DataTableProps } from '../../../components/dataGrid/dataTableTypes';
import useConnectedDocumentModifier from '../../../utils/hooks/useConnectedDocumentModifier';
import { KNOWLEDGE_KNUPDATE } from '../../../utils/hooks/useGranted';
import Security from '../../../utils/Security';
import FeedbackCreation from './feedbacks/FeedbackCreation';

interface FeedbacksProps {
  inputValue?: string;
}

const feedbackFragment = graphql`
  fragment FeedbacksLine_node on Feedback {
    id
    standard_id
    name
    description
    rating
    entity_type
    created
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

const feedbacksLinesQuery = graphql`
  query FeedbacksLinesPaginationQuery(
    $search: String
    $count: Int
    $cursor: ID
    $orderBy: FeedbacksOrdering
    $orderMode: OrderingMode
    $filters: FilterGroup
  ) {
    ...FeedbacksLines_data
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

const feedbacksLinesFragment = graphql`
  fragment FeedbacksLines_data on Query
  @argumentDefinitions(
    search: { type: "String" }
    count: { type: "Int" }
    cursor: { type: "ID" }
    orderBy: { type: "FeedbacksOrdering" }
    orderMode: { type: "OrderingMode", defaultValue: desc }
    filters: { type: "FilterGroup" }
  )
  @refetchable(queryName: "FeedbackLinesRefetchQuery") {
    feedbacks(
      search: $search
      first: $count
      after: $cursor
      orderBy: $orderBy
      orderMode: $orderMode
      filters: $filters
    ) @connection(key: "Pagination_feedbacks") {
      edges {
        node {
          id
          ...FeedbacksLine_node
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

export const LOCAL_STORAGE_KEY_FEEDBACK = 'feedbacks';

const lowercaseVoiceSx = {
  textTransform: 'lowercase',
  '&::first-letter': { textTransform: 'uppercase' },
} as const;

const Feedbacks: FunctionComponent<FeedbacksProps> = () => {
  const { t_i18n } = useFormatter();
  const { setTitle } = useConnectedDocumentModifier();
  setTitle(t_i18n('Feedbacks | Cases'));
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
  const { viewStorage, helpers: storageHelpers, paginationOptions } = usePaginationLocalStorage<FeedbacksLinesPaginationQuery$variables>(
    LOCAL_STORAGE_KEY_FEEDBACK,
    initialValues,
  );

  const {
    filters,
  } = viewStorage;
  const isRuntimeSort = isRuntimeFieldEnable() ?? false;
  const dataColumns: DataTableProps['dataColumns'] = {
    name: {},
    rating: {},
    createdBy: {
      isSortable: isRuntimeSort,
    },
    creator: {
      isSortable: isRuntimeSort,
    },
    objectLabel: {},
    created: {
      percentWidth: 10,
    },
    x_opencti_workflow_id: {},
    objectMarking: {
      isSortable: isRuntimeSort,
    },
  };

  const contextFilters = useBuildEntityTypeBasedFilterContext('Feedback', filters);
  const queryPaginationOptions = {
    ...paginationOptions,
    filters: contextFilters,
  } as unknown as FeedbacksLinesPaginationQuery$variables;
  const queryRef = useQueryLoading<FeedbacksLinesPaginationQuery>(
    feedbacksLinesQuery,
    queryPaginationOptions,
  );

  const preloadedPaginationProps = {
    linesQuery: feedbacksLinesQuery,
    linesFragment: feedbacksLinesFragment,
    queryRef,
    nodePath: ['feedbacks', 'pageInfo', 'globalCount'],
    setNumberOfElements: storageHelpers.handleSetNumberOfElements,
  } as UsePreloadedPaginationFragment<FeedbacksLinesPaginationQuery>;

  return (
    <div data-testid="feedback-page">
      <Breadcrumbs elements={[{ label: t_i18n('Cases') }, { label: t_i18n('Feedbacks'), current: true }]} />
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
                {t_i18n('Feedbacks')}
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
              {t_i18n('Track and manage user feedback on the platform')}
            </Typography>
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, flexShrink: 0 }}>
            <Security needs={[KNOWLEDGE_KNUPDATE]}>
              <FeedbackCreation paginationOptions={queryPaginationOptions} />
            </Security>
          </Box>
        </Box>
        {queryRef && (
          <DataTable
            dataColumns={dataColumns}
            resolvePath={(data: FeedbacksLines_data$data) => data.feedbacks?.edges?.map((n) => n?.node)}
            storageKey={LOCAL_STORAGE_KEY_FEEDBACK}
            initialValues={initialValues}
            contextFilters={contextFilters}
            preloadedPaginationProps={preloadedPaginationProps}
            lineFragment={feedbackFragment}
            exportContext={{ entity_type: 'Feedback' }}
            emptyStateMessage={t_i18n('No feedbacks yet. Create one to share your feedback on the platform.')}
          />
        )}
      </Box>
    </div>
  );
};

export default Feedbacks;
