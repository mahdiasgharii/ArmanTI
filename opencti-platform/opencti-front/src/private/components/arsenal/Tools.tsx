import React from 'react';
import { graphql } from 'react-relay';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Tooltip from '@mui/material/Tooltip';
import { ToolsLines_data$data } from '@components/arsenal/__generated__/ToolsLines_data.graphql';
import { ToolsLinesPaginationQuery, ToolsLinesPaginationQuery$variables } from '@components/arsenal/__generated__/ToolsLinesPaginationQuery.graphql';
import ToolCreation from './tools/ToolCreation';
import Security from '../../../utils/Security';
import { KNOWLEDGE_KNPARTICIPATE, KNOWLEDGE_KNUPDATE } from '../../../utils/hooks/useGranted';
import { usePaginationLocalStorage } from '../../../utils/hooks/useLocalStorage';
import useQueryLoading from '../../../utils/hooks/useQueryLoading';
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

const lowercaseVoiceSx = {
  textTransform: 'lowercase',
  '&::first-letter': { textTransform: 'uppercase' },
} as const;

const LOCAL_STORAGE_KEY = 'tools';

const toolLineFragment = graphql`
  fragment ToolsLine_node on Tool {
    id
    entity_type
    name
    tool_types
    tool_version
    created
    modified
    confidence
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

const toolsLinesQuery = graphql`
  query ToolsLinesPaginationQuery(
    $search: String
    $count: Int!
    $cursor: ID
    $orderBy: ToolsOrdering
    $orderMode: OrderingMode
    $filters: FilterGroup
  ) {
    ...ToolsLines_data
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

const toolsLinesFragment = graphql`
  fragment ToolsLines_data on Query
  @argumentDefinitions(
    search: { type: "String" }
    count: { type: "Int", defaultValue: 25 }
    cursor: { type: "ID" }
    orderBy: { type: "ToolsOrdering", defaultValue: name }
    orderMode: { type: "OrderingMode", defaultValue: asc }
    filters: { type: "FilterGroup" }
  )
  @refetchable(queryName: "ToolsLinesRefetchQuery") {
    tools(
      search: $search
      first: $count
      after: $cursor
      orderBy: $orderBy
      orderMode: $orderMode
      filters: $filters
    ) @connection(key: "Pagination_tools") {
      edges {
        node {
          id
          name
          description
          ...ToolsLine_node
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

const Tools = () => {
  const { t_i18n } = useFormatter();
  const { setTitle } = useConnectedDocumentModifier();
  setTitle(t_i18n('Tools | Arsenal'));
  const initialValues = {
    searchTerm: '',
    sortBy: 'name',
    orderAsc: true,
    openExports: false,
    filters: emptyFilterGroup,
  };
  const { viewStorage, helpers: storageHelpers, paginationOptions } = usePaginationLocalStorage<ToolsLinesPaginationQuery$variables>(
    LOCAL_STORAGE_KEY,
    initialValues,
  );

  const {
    filters,
  } = viewStorage;

  const contextFilters = useBuildEntityTypeBasedFilterContext('Tool', filters);
  const queryPaginationOptions = {
    ...paginationOptions,
    filters: contextFilters,
  } as unknown as ToolsLinesPaginationQuery$variables;

  const queryRef = useQueryLoading<ToolsLinesPaginationQuery>(
    toolsLinesQuery,
    queryPaginationOptions,
  );

  const dataColumns: DataTableProps['dataColumns'] = {
    name: {
      percentWidth: 30,
      render: (data) => {
        const name = data.name || data.id;
        const link = `${resolveLink('Tool')}/${data.id}`;
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
    tool_types: {
      percentWidth: 13,
      render: ({ tool_types }) => {
        if (!tool_types || tool_types.length === 0) return EMPTY_VALUE;
        return (
          <Box
            component="span"
            sx={{
              display: 'inline-flex',
              alignItems: 'center',
              fontSize: 12,
              fontWeight: 500,
              color: 'var(--ravin-text-muted)',
              backgroundColor: 'var(--ravin-surface-2)',
              borderRadius: '4px',
              padding: '2px 8px',
              lineHeight: '20px',
              ...lowercaseVoiceSx,
            }}
          >
            {tool_types[0]}
          </Box>
        );
      },
    },
    createdBy: {
      percentWidth: 12,
      render: ({ createdBy }) => (
        <span style={{ color: 'var(--ravin-text-muted)' }}>
          {defaultRender(createdBy?.name)}
        </span>
      ),
    },
    creator: {
      percentWidth: 12,
      render: ({ creators }) => {
        if (!creators || creators.length === 0) return EMPTY_VALUE;
        return (
          <span style={{ color: 'var(--ravin-text-muted)' }}>
            {defaultRender(creators[0]?.name)}
          </span>
        );
      },
    },
    objectLabel: {
      percentWidth: 15,
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
      percentWidth: 10,
      render: ({ created }, { rd, nsdt }) => (
        <Tooltip title={nsdt(created)}>
          <span style={{ color: 'var(--ravin-text-muted)' }}>{rd(created)}</span>
        </Tooltip>
      ),
    },
    objectMarking: {
      percentWidth: 8,
    },
  };

  const preloadedPaginationOptions = {
    linesQuery: toolsLinesQuery,
    linesFragment: toolsLinesFragment,
    queryRef,
    nodePath: ['tools', 'pageInfo', 'globalCount'],
    setNumberOfElements: storageHelpers.handleSetNumberOfElements,
  } as UsePreloadedPaginationFragment<ToolsLinesPaginationQuery>;

  const createButton = (
    <Security needs={[KNOWLEDGE_KNUPDATE, KNOWLEDGE_KNPARTICIPATE]}>
      <ToolCreation paginationOptions={queryPaginationOptions} />
    </Security>
  );

  return (
    <div data-testid="tool-page">
      <Breadcrumbs elements={[{ label: t_i18n('Arsenal') }, { label: t_i18n('Tools'), current: true }]} />
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
                {t_i18n('Tools')}
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
              {t_i18n('Track tools used by threat actors')}
            </Typography>
          </Box>
          {createButton}
        </Box>
        {queryRef && (
          <DataTable
            dataColumns={dataColumns}
            resolvePath={(data: ToolsLines_data$data) => data.tools?.edges?.map((n) => n?.node)}
            storageKey={LOCAL_STORAGE_KEY}
            initialValues={initialValues}
            contextFilters={contextFilters}
            preloadedPaginationProps={preloadedPaginationOptions}
            lineFragment={toolLineFragment}
            exportContext={{ entity_type: 'Tool' }}
            emptyStateMessage={t_i18n('No tools yet. Create one to start tracking threat arsenals.')}
          />
        )}
      </Box>
    </div>
  );
};

export default Tools;
