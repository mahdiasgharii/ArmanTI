import React, { FunctionComponent } from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Tooltip from '@mui/material/Tooltip';
import { graphql } from 'react-relay';
import { SectorsLines_data$data } from '@components/entities/__generated__/SectorsLines_data.graphql';
import { SectorsLinesPaginationQuery, SectorsLinesPaginationQuery$variables } from '@components/entities/__generated__/SectorsLinesPaginationQuery.graphql';
import Security from '../../../utils/Security';
import { KNOWLEDGE_KNUPDATE } from '../../../utils/hooks/useGranted';
import SectorCreation from './sectors/SectorCreation';
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

const LOCAL_STORAGE_KEY = 'sectors';

const sectorLineFragment = graphql`
  fragment SectorsLine_node on Sector {
    id
    entity_type
    name
    description
    created
    modified
    isSubSector
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

const sectorsLinesQuery = graphql`
  query SectorsLinesPaginationQuery(
    $search: String
    $count: Int!
    $cursor: ID
    $orderBy: SectorsOrdering
    $orderMode: OrderingMode
    $filters: FilterGroup
  ) {
    ...SectorsLines_data
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

export const sectorsLinesFragment = graphql`
  fragment SectorsLines_data on Query
  @argumentDefinitions(
    search: { type: "String" }
    count: { type: "Int", defaultValue: 25 }
    cursor: { type: "ID" }
    orderBy: { type: "SectorsOrdering", defaultValue: name }
    orderMode: { type: "OrderingMode", defaultValue: asc }
    filters: { type: "FilterGroup" }
  )
  @refetchable(queryName: "SectorsLinesRefetchQuery") {
    sectors(
      search: $search
      first: $count
      after: $cursor
      orderBy: $orderBy
      orderMode: $orderMode
      filters: $filters
    ) @connection(key: "Pagination_sectors") {
      edges {
        node {
          id
          name
          ...SectorsLine_node
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

const Sectors: FunctionComponent = () => {
  const { t_i18n } = useFormatter();
  const { setTitle } = useConnectedDocumentModifier();
  setTitle(t_i18n('Sectors | Entities'));

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
  } = usePaginationLocalStorage<SectorsLinesPaginationQuery$variables>(
    LOCAL_STORAGE_KEY,
    initialValues,
  );

  const { filters } = viewStorage;

  const contextFilters = useBuildEntityTypeBasedFilterContext('Sector', filters);
  const queryPaginationOptions = {
    ...paginationOptions,
    filters: contextFilters,
  } as unknown as SectorsLinesPaginationQuery$variables;

  const dataColumns: DataTableProps['dataColumns'] = {
    name: {
      percentWidth: 30,
      render: (data) => {
        const name = data.name || data.id;
        const link = `${resolveLink('Sector')}/${data.id}`;
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

  const queryRef = useQueryLoading<SectorsLinesPaginationQuery>(
    sectorsLinesQuery,
    queryPaginationOptions,
  );

  const preloadedPaginationOptions = {
    linesQuery: sectorsLinesQuery,
    linesFragment: sectorsLinesFragment,
    queryRef,
    nodePath: ['sectors', 'pageInfo', 'globalCount'],
    setNumberOfElements: storageHelpers.handleSetNumberOfElements,
  } as UsePreloadedPaginationFragment<SectorsLinesPaginationQuery>;

  const createButton = (
    <Security needs={[KNOWLEDGE_KNUPDATE]}>
      <SectorCreation paginationOptions={queryPaginationOptions} />
    </Security>
  );

  return (
    <div data-testid="sector-page">
      <Breadcrumbs elements={[{ label: t_i18n('Entities') }, { label: t_i18n('Sectors'), current: true }]} />
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
                {t_i18n('Sectors')}
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
              {t_i18n('Organize activity sectors and track threats by industry')}
            </Typography>
          </Box>
          {createButton}
        </Box>
        {queryRef && (
          <DataTable
            dataColumns={dataColumns}
            preloadedPaginationProps={preloadedPaginationOptions}
            initialValues={initialValues}
            storageKey={LOCAL_STORAGE_KEY}
            contextFilters={contextFilters}
            resolvePath={(data: SectorsLines_data$data) => data.sectors?.edges?.map((e) => e?.node)}
            lineFragment={sectorLineFragment}
            exportContext={{ entity_type: 'Sector' }}
            emptyStateMessage={t_i18n('No sectors yet. Create one to organize activity sectors and track threats by industry.')}
          />
        )}
      </Box>
    </div>
  );
};

export default Sectors;
