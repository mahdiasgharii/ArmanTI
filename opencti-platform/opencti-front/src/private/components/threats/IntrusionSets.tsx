import React from 'react';
import Grid from '@mui/material/Grid';
import { Box, Typography } from '@mui/material';
import { GenericAttackCardDummy } from '@components/common/cards/GenericAttackCard';
import ToggleButton from '@mui/material/ToggleButton';
import Tooltip from '@mui/material/Tooltip';
import { List as ViewListOutlined, LayoutGrid as ViewModuleOutlined } from 'lucide-react';
import { IntrusionSetCardFragment } from '@components/threats/intrusion_sets/IntrusionSetCard';
import { IntrusionSetsCards_data$data } from '@components/threats/intrusion_sets/__generated__/IntrusionSetsCards_data.graphql';
import StixCoreObjectForms from '@components/common/stix_core_objects/StixCoreObjectForms';
import { IntrusionSetsCardsPaginationQuery, IntrusionSetsCardsPaginationQuery$variables } from './intrusion_sets/__generated__/IntrusionSetsCardsPaginationQuery.graphql';
import ListCards from '../../../components/list_cards/ListCards';
import IntrusionSetsCards, { intrusionSetsCardsFragment, intrusionSetsCardsQuery } from './intrusion_sets/IntrusionSetsCards';
import IntrusionSetCreation from './intrusion_sets/IntrusionSetCreation';
import { usePaginationLocalStorage } from '../../../utils/hooks/useLocalStorage';
import useQueryLoading from '../../../utils/hooks/useQueryLoading';
import { emptyFilterGroup, useBuildEntityTypeBasedFilterContext } from '../../../utils/filters/filtersUtils';
import Breadcrumbs from '../../../components/Breadcrumbs';
import { useFormatter } from '../../../components/i18n';
import { UsePreloadedPaginationFragment } from '../../../utils/hooks/usePreloadedPaginationFragment';
import DataTable from '../../../components/dataGrid/DataTable';
import useConnectedDocumentModifier from '../../../utils/hooks/useConnectedDocumentModifier';
import { KNOWLEDGE_KNUPDATE } from '../../../utils/hooks/useGranted';
import Security from '../../../utils/Security';

const lowercaseVoiceSx = {
  textTransform: 'lowercase',
  '&::first-letter': { textTransform: 'uppercase' },
} as const;

const LOCAL_STORAGE_KEY = 'intrusionSets';

const IntrusionSets = () => {
  const { t_i18n } = useFormatter();
  const initialValues = {
    searchTerm: '',
    sortBy: 'name',
    orderAsc: true,
    openExports: false,
    filters: emptyFilterGroup,
    view: 'cards',
  };
  const { setTitle } = useConnectedDocumentModifier();
  setTitle(t_i18n('Intrusion Sets | Threats'));
  const { viewStorage, helpers, paginationOptions } = usePaginationLocalStorage<IntrusionSetsCardsPaginationQuery$variables>(
    LOCAL_STORAGE_KEY,
    initialValues,
  );

  const contextFilters = useBuildEntityTypeBasedFilterContext('Intrusion-Set', viewStorage.filters);
  const queryPaginationOptions = {
    ...paginationOptions,
    filters: contextFilters,
  } as unknown as IntrusionSetsCardsPaginationQuery$variables;

  const {
    sortBy,
    orderAsc,
    searchTerm,
    filters,
    openExports,
    numberOfElements,
  } = viewStorage;

  const queryRef = useQueryLoading<IntrusionSetsCardsPaginationQuery>(
    intrusionSetsCardsQuery,
    queryPaginationOptions,
  );

  const renderCards = () => {
    const dataColumns = {
      name: {
        label: 'Name',
      },
      created: {
        label: 'Original creation date',
      },
      modified: {
        label: 'Modification date',
      },
    };
    return (
      <ListCards
        helpers={helpers}
        sortBy={sortBy}
        orderAsc={orderAsc}
        dataColumns={dataColumns}
        handleSort={helpers.handleSort}
        handleSearch={helpers.handleSearch}
        handleAddFilter={helpers.handleAddFilter}
        handleRemoveFilter={helpers.handleRemoveFilter}
        handleSwitchGlobalMode={helpers.handleSwitchGlobalMode}
        handleSwitchLocalMode={helpers.handleSwitchLocalMode}
        handleToggleExports={helpers.handleToggleExports}
        openExports={openExports}
        exportContext={{ entity_type: 'Intrusion-Set' }}
        keyword={searchTerm}
        filters={filters}
        paginationOptions={queryPaginationOptions}
        numberOfElements={numberOfElements}
        handleChangeView={helpers.handleChangeView}
      >
        {queryRef && (
          <React.Suspense
            fallback={(
              <Grid container={true} spacing={3} style={{ paddingLeft: 17 }}>
                {Array(20)
                  .fill(0)
                  .map((_, idx) => (
                    <Grid
                      item
                      xs={3}
                      key={idx}
                    >
                      <GenericAttackCardDummy />
                    </Grid>
                  ))}
              </Grid>
            )}
          >
            <IntrusionSetsCards
              queryRef={queryRef}
              setNumberOfElements={helpers.handleSetNumberOfElements}
              onLabelClick={helpers.handleAddFilter}
            />
          </React.Suspense>
        )}
      </ListCards>
    );
  };

  const renderList = () => {
    const dataColumns = {
      name: {
        percentWidth: 15,
      },
      resource_level: {},
      primary_motivation: {},
      secondary_motivations: {},
      creator: { percentWidth: 15 },
      objectLabel: {},
      modified: {},
      objectMarking: { percentWidth: 10 },
    };

    const preloadedPaginationProps = {
      linesQuery: intrusionSetsCardsQuery,
      linesFragment: intrusionSetsCardsFragment,
      queryRef,
      nodePath: ['intrusionSets', 'pageInfo', 'globalCount'],
      setNumberOfElements: helpers.handleSetNumberOfElements,
    } as UsePreloadedPaginationFragment<IntrusionSetsCardsPaginationQuery>;

    return (
      <>
        {queryRef && (
          <DataTable
            dataColumns={dataColumns}
            resolvePath={(data: IntrusionSetsCards_data$data) => data.intrusionSets?.edges?.map((n) => n?.node)}
            storageKey={LOCAL_STORAGE_KEY}
            initialValues={initialValues}
            contextFilters={contextFilters}
            preloadedPaginationProps={preloadedPaginationProps}
            lineFragment={IntrusionSetCardFragment}
            exportContext={{ entity_type: 'Intrusion-Set' }}
            additionalHeaderToggleButtons={[
              <ToggleButton key="cards" value="cards" aria-label="cards">
                <Tooltip title={t_i18n('Cards view')}>
                  <ViewModuleOutlined size={16} />
                </Tooltip>
              </ToggleButton>,
              <ToggleButton key="lines" value="lines" aria-label="lines">
                <Tooltip title={t_i18n('Lines view')}>
                  <ViewListOutlined size={16} />
                </Tooltip>
              </ToggleButton>,
            ]}
            emptyStateMessage={t_i18n('No intrusion sets yet. Create one to start tracking an intrusion set.')}
          />
        )}
      </>
    );
  };

  return (
    <div data-testid="instrusion-set-page">
      <Breadcrumbs elements={[{ label: t_i18n('Threats') }, { label: t_i18n('Intrusion sets'), current: true }]} />
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
                {t_i18n('Intrusion sets')}
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
              {t_i18n('Track and manage intrusion sets and their campaign activities')}
            </Typography>
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, flexShrink: 0 }}>
            <Security key="form-intake" needs={[KNOWLEDGE_KNUPDATE]}>
              <StixCoreObjectForms entityType="Intrusion-Set" />
            </Security>
            <Security needs={[KNOWLEDGE_KNUPDATE]}>
              <IntrusionSetCreation paginationOptions={queryPaginationOptions} />
            </Security>
          </Box>
        </Box>
        {viewStorage.view !== 'lines' ? renderCards() : renderList()}
      </Box>
    </div>
  );
};

export default IntrusionSets;
