import React from 'react';
import { graphql } from 'react-relay';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Tooltip from '@mui/material/Tooltip';
import { IndicatorsLinesPaginationQuery, IndicatorsLinesPaginationQuery$variables } from '@components/observations/__generated__/IndicatorsLinesPaginationQuery.graphql';
import { IndicatorsLines_data$data } from '@components/observations/__generated__/IndicatorsLines_data.graphql';
import StixCoreObjectForms from '@components/common/stix_core_objects/StixCoreObjectForms';
import IndicatorCreation from './indicators/IndicatorCreation';
import Security from '../../../utils/Security';
import { KNOWLEDGE_KNUPDATE, KNOWLEDGE_KNASKIMPORT } from '../../../utils/hooks/useGranted';
import useAuth from '../../../utils/hooks/useAuth';
import { usePaginationLocalStorage } from '../../../utils/hooks/useLocalStorage';
import useQueryLoading from '../../../utils/hooks/useQueryLoading';
import { emptyFilterGroup, useBuildEntityTypeBasedFilterContext, useGetDefaultFilterObject } from '../../../utils/filters/filtersUtils';
import { useFormatter } from '../../../components/i18n';
import Breadcrumbs from '../../../components/Breadcrumbs';
import { UsePreloadedPaginationFragment } from '../../../utils/hooks/usePreloadedPaginationFragment';
import DataTable from '../../../components/dataGrid/DataTable';
import { DataTableProps } from '../../../components/dataGrid/dataTableTypes';
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

const LOCAL_STORAGE_KEY = 'indicators-list';

const indicatorLineFragment = graphql`
  fragment IndicatorsLine_node on Indicator {
    id
    entity_type
    name
    pattern_type
    valid_from
    valid_until
    x_opencti_score
    x_opencti_main_observable_type
    x_opencti_reliability
    created
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
  }
`;

const indicatorsLinesQuery = graphql`
  query IndicatorsLinesPaginationQuery(
    $search: String
    $count: Int!
    $cursor: ID
    $filters: FilterGroup
    $orderBy: IndicatorsOrdering
    $orderMode: OrderingMode
  ) {
    ...IndicatorsLines_data
    @arguments(
      search: $search
      count: $count
      cursor: $cursor
      filters: $filters
      orderBy: $orderBy
      orderMode: $orderMode
    )
  }
`;

const indicatorsLinesFragment = graphql`
  fragment IndicatorsLines_data on Query
  @argumentDefinitions(
    search: { type: "String" }
    count: { type: "Int", defaultValue: 25 }
    cursor: { type: "ID" }
    filters: { type: "FilterGroup" }
    orderBy: { type: "IndicatorsOrdering", defaultValue: valid_from }
    orderMode: { type: "OrderingMode", defaultValue: desc }
  )
  @refetchable(queryName: "IndicatorsLinesRefetchQuery") {
    indicators(
      search: $search
      first: $count
      after: $cursor
      filters: $filters
      orderBy: $orderBy
      orderMode: $orderMode
    ) @connection(key: "Pagination_indicators") {
      edges {
        node {
          id
          ...IndicatorsLine_node
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

const Indicators = () => {
  const { t_i18n } = useFormatter();
  const { setTitle } = useConnectedDocumentModifier();
  setTitle(t_i18n('Indicators | Observations'));

  const {
    platformModuleHelpers: { isRuntimeFieldEnable },
  } = useAuth();
  const isRuntimeSort = isRuntimeFieldEnable();

  const initialValues = {
    filters: {
      ...emptyFilterGroup,
      filters: useGetDefaultFilterObject(['pattern_type', 'x_opencti_main_observable_type'], ['Indicator']),
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
  } = usePaginationLocalStorage<IndicatorsLinesPaginationQuery$variables>(
    LOCAL_STORAGE_KEY,
    initialValues,
  );
  const { filters } = viewStorage;

  const contextFilters = useBuildEntityTypeBasedFilterContext('Indicator', filters);
  const queryPaginationOptions = {
    ...paginationOptions,
    filters: contextFilters,
  } as unknown as IndicatorsLinesPaginationQuery$variables;
  const queryRef = useQueryLoading<IndicatorsLinesPaginationQuery>(
    indicatorsLinesQuery,
    queryPaginationOptions,
  );

  const dataColumns: DataTableProps['dataColumns'] = {
    pattern_type: {
      percentWidth: 11,
      render: ({ pattern_type }) => {
        if (!pattern_type) return EMPTY_VALUE;
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
            {pattern_type}
          </Box>
        );
      },
    },
    name: {
      percentWidth: 24,
      render: (data) => {
        const name = data.name || data.id;
        const link = `${resolveLink('Indicator')}/${data.id}`;
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
    createdBy: {
      isSortable: isRuntimeSort ?? false,
      percentWidth: 12,
      render: ({ createdBy }) => (
        <span style={{ color: 'var(--ravin-text-muted)' }}>
          {defaultRender(createdBy?.name)}
        </span>
      ),
    },
    creator: {
      isSortable: isRuntimeSort ?? false,
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
      percentWidth: 15,
      render: ({ created }, { rd, nsdt }) => (
        <Tooltip title={nsdt(created)}>
          <span style={{ color: 'var(--ravin-text-muted)' }}>{rd(created)}</span>
        </Tooltip>
      ),
    },
    objectMarking: {
      percentWidth: 10,
      isSortable: isRuntimeSort ?? false,
    },
  };

  const preloadedPaginationOptions = {
    linesQuery: indicatorsLinesQuery,
    linesFragment: indicatorsLinesFragment,
    queryRef,
    nodePath: ['indicators', 'pageInfo', 'globalCount'],
    setNumberOfElements: storageHelpers.handleSetNumberOfElements,
  } as UsePreloadedPaginationFragment<IndicatorsLinesPaginationQuery>;

  const createButton = (
    <Security needs={[KNOWLEDGE_KNUPDATE]}>
      <IndicatorCreation paginationOptions={queryPaginationOptions} />
    </Security>
  );

  return (
    <div data-testid="indicator-page">
      <Breadcrumbs elements={[{ label: t_i18n('Observations') }, { label: t_i18n('Indicators'), current: true }]} />
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
                {t_i18n('Indicators')}
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
              {t_i18n('Track patterns that identify malicious activity')}
            </Typography>
          </Box>
          {createButton}
        </Box>
        {queryRef && (
          <DataTable
            dataColumns={dataColumns}
            resolvePath={(data: IndicatorsLines_data$data) => data.indicators?.edges?.map((n) => n?.node)}
            storageKey={LOCAL_STORAGE_KEY}
            initialValues={initialValues}
            contextFilters={contextFilters}
            lineFragment={indicatorLineFragment}
            preloadedPaginationProps={preloadedPaginationOptions}
            exportContext={{ entity_type: 'Indicator' }}
            additionalHeaderButtons={[
              <Security key="form-intake" needs={[KNOWLEDGE_KNUPDATE]} capabilitiesInDraft={[KNOWLEDGE_KNASKIMPORT]}>
                <StixCoreObjectForms entityType="Threat-Actor-Group" />
              </Security>,
            ]}
            emptyStateMessage={t_i18n('No indicators yet. Create one to start tracking threat patterns.')}
          />
        )}
      </Box>
    </div>
  );
};

export default Indicators;
