import React from 'react';
import { graphql } from 'react-relay';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Tooltip from '@mui/material/Tooltip';
import { AttackPatternsLinesPaginationQuery, AttackPatternsLinesPaginationQuery$variables } from '@components/techniques/__generated__/AttackPatternsLinesPaginationQuery.graphql';
import { AttackPatternsLines_data$data } from '@components/techniques/__generated__/AttackPatternsLines_data.graphql';
import AttackPatternCreation from './attack_patterns/AttackPatternCreation';
import StixCoreObjectForms from '@components/common/stix_core_objects/StixCoreObjectForms';
import Security from '../../../utils/Security';
import { KNOWLEDGE_KNUPDATE } from '../../../utils/hooks/useGranted';
import { usePaginationLocalStorage } from '../../../utils/hooks/useLocalStorage';
import useQueryLoading from '../../../utils/hooks/useQueryLoading';
import { useBuildEntityTypeBasedFilterContext, emptyFilterGroup } from '../../../utils/filters/filtersUtils';
import { useFormatter } from '../../../components/i18n';
import Breadcrumbs from '../../../components/Breadcrumbs';
import DataTable from '../../../components/dataGrid/DataTable';
import { UsePreloadedPaginationFragment } from '../../../utils/hooks/usePreloadedPaginationFragment';
import { DataTableProps } from '../../../components/dataGrid/dataTableTypes';
import { Truncate, defaultRender } from '../../../components/dataGrid/dataTableUtils';
import useConnectedDocumentModifier from '../../../utils/hooks/useConnectedDocumentModifier';
import { resolveLink } from '../../../utils/Entity';
import { EMPTY_VALUE } from '../../../utils/String';
import Tag from '../../../components/common/tag/Tag';
import TagsOverflow from '../../../components/common/tag/TagsOverflow';

const lowercaseVoiceSx = {
  textTransform: 'lowercase',
  '&::first-letter': { textTransform: 'uppercase' },
} as const;

const LOCAL_STORAGE_KEY = 'attackPattern';

const attackPatternLineFragment = graphql`
  fragment AttackPatternsLine_node on AttackPattern {
    id
    entity_type
    name
    x_mitre_id
    created
    modified
    draftVersion {
      draft_id
      draft_operation
    }
    objectLabel {
      id
      value
      color
    }
    killChainPhases {
      kill_chain_name
      phase_name
    }
    objectMarking {
      id
      definition_type
      definition
      x_opencti_order
      x_opencti_color
    }
  }
`;

export const attackPatternsLinesQuery = graphql`
  query AttackPatternsLinesPaginationQuery(
    $search: String
    $count: Int!
    $cursor: ID
    $orderBy: AttackPatternsOrdering
    $orderMode: OrderingMode
    $filters: FilterGroup
  ) {
    ...AttackPatternsLines_data
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

const attackPatternsLinesFragment = graphql`
  fragment AttackPatternsLines_data on Query
  @argumentDefinitions(
    search: { type: "String" }
    count: { type: "Int", defaultValue: 25 }
    cursor: { type: "ID" }
    orderBy: { type: "AttackPatternsOrdering", defaultValue: name }
    orderMode: { type: "OrderingMode", defaultValue: asc }
    filters: { type: "FilterGroup" }
  )
  @refetchable(queryName: "AttackPatternsLinesRefetchQuery") {
    attackPatterns(
      search: $search
      first: $count
      after: $cursor
      orderBy: $orderBy
      orderMode: $orderMode
      filters: $filters
    ) @connection(key: "Pagination_attackPatterns") {
      edges {
        node {
          id
          name
          ...AttackPatternsLine_node
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

const AttackPatterns = () => {
  const { t_i18n } = useFormatter();
  const { setTitle } = useConnectedDocumentModifier();
  setTitle(t_i18n('Attack Patterns | Techniques'));
  const initialValues = {
    searchTerm: '',
    sortBy: 'name',
    orderAsc: true,
    openExports: false,
    filters: emptyFilterGroup,
  };
  const { viewStorage, helpers: storageHelpers, paginationOptions } = usePaginationLocalStorage<AttackPatternsLinesPaginationQuery$variables>(
    LOCAL_STORAGE_KEY,
    initialValues,
  );

  const {
    filters,
  } = viewStorage;
  const contextFilters = useBuildEntityTypeBasedFilterContext('Attack-Pattern', filters);
  const queryPaginationOptions = {
    ...paginationOptions,
    filters: contextFilters,
  } as unknown as AttackPatternsLinesPaginationQuery$variables;

  const dataColumns: DataTableProps['dataColumns'] = {
    x_mitre_id: {
      percentWidth: 10,
      render: ({ x_mitre_id }) => {
        if (!x_mitre_id) return EMPTY_VALUE;
        return (
          <Box
            component="span"
            sx={{
              display: 'inline-flex',
              alignItems: 'center',
              fontSize: 12,
              fontWeight: 500,
              fontFamily: 'Consolas, monaco, monospace',
              color: 'var(--ravin-text-muted)',
              backgroundColor: 'var(--ravin-surface-2)',
              borderRadius: '4px',
              padding: '2px 8px',
              lineHeight: '20px',
            }}
          >
            {x_mitre_id}
          </Box>
        );
      },
    },
    name: {
      percentWidth: 25,
      render: (data) => {
        const name = data.name || data.id;
        const link = `${resolveLink('Attack-Pattern')}/${data.id}`;
        const displayDraftChip = !!data.draftVersion;
        return (
          <Tooltip title={name}>
            <Box sx={{ display: 'inline-flex', alignItems: 'center', gap: 0.75 }}>
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
              {displayDraftChip && defaultRender(null, true)}
            </Box>
          </Tooltip>
        );
      },
    },
    killChainPhase: {
      percentWidth: 15,
      render: ({ killChainPhases }) => {
        if (!killChainPhases || killChainPhases.length === 0) return EMPTY_VALUE;
        return (
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
            {killChainPhases.map((phase: { kill_chain_name: string; phase_name: string }) => (
              <Box
                key={phase.phase_name}
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
                {phase.phase_name}
              </Box>
            ))}
          </Box>
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
      percentWidth: 12,
      render: ({ created }, { rd, nsdt }) => (
        <Tooltip title={nsdt(created)}>
          <span style={{ color: 'var(--ravin-text-muted)' }}>{rd(created)}</span>
        </Tooltip>
      ),
    },
    modified: {
      percentWidth: 12,
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
  const queryRef = useQueryLoading<AttackPatternsLinesPaginationQuery>(
    attackPatternsLinesQuery,
    queryPaginationOptions,
  );

  const preloadedPaginationOptions = {
    linesQuery: attackPatternsLinesQuery,
    linesFragment: attackPatternsLinesFragment,
    queryRef,
    nodePath: ['attackPatterns', 'pageInfo', 'globalCount'],
    setNumberOfElements: storageHelpers.handleSetNumberOfElements,
  } as UsePreloadedPaginationFragment<AttackPatternsLinesPaginationQuery>;

  const createButton = (
    <Security needs={[KNOWLEDGE_KNUPDATE]}>
      <AttackPatternCreation paginationOptions={queryPaginationOptions} />
    </Security>
  );

  return (
    <div data-testid="attack-pattern-page">
      <Breadcrumbs elements={[{ label: t_i18n('Techniques') }, { label: t_i18n('Attack patterns'), current: true }]} />
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
                {t_i18n('Attack patterns')}
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
              {t_i18n('Catalog adversary techniques and procedures mapped to kill chain phases')}
            </Typography>
          </Box>
          {createButton}
        </Box>
        {queryRef && (
          <DataTable
            dataColumns={dataColumns}
            resolvePath={(data: AttackPatternsLines_data$data) => data.attackPatterns?.edges?.map((n) => n?.node)}
            storageKey={LOCAL_STORAGE_KEY}
            initialValues={initialValues}
            contextFilters={contextFilters}
            preloadedPaginationProps={preloadedPaginationOptions}
            lineFragment={attackPatternLineFragment}
            exportContext={{ entity_type: 'Attack-Pattern' }}
            additionalHeaderButtons={[
              <Security key="form-intake" needs={[KNOWLEDGE_KNUPDATE]}>
                <StixCoreObjectForms entityType="Attack-Pattern" />
              </Security>,
            ]}
            emptyStateMessage={t_i18n('No attack patterns yet. Create one to start cataloging adversary techniques.')}
          />
        )}
      </Box>
    </div>
  );
};

export default AttackPatterns;
