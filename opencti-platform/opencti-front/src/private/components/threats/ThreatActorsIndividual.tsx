import React from 'react';
import Grid from '@mui/material/Grid';
import { Box, Typography } from '@mui/material';
import ToggleButton from '@mui/material/ToggleButton';
import Tooltip from '@mui/material/Tooltip';
import { List as ViewListOutlined, LayoutGrid as ViewModuleOutlined } from 'lucide-react';
import { ThreatActorIndividualCardFragment } from '@components/threats/threat_actors_individual/ThreatActorIndividualCard';
import { ThreatActorsIndividualCards_data$data } from '@components/threats/threat_actors_individual/__generated__/ThreatActorsIndividualCards_data.graphql';
import StixCoreObjectForms from '@components/common/stix_core_objects/StixCoreObjectForms';
import { usePaginationLocalStorage } from '../../../utils/hooks/useLocalStorage';
import ListCards from '../../../components/list_cards/ListCards';
import useQueryLoading from '../../../utils/hooks/useQueryLoading';
import { GenericAttackCardDummy } from '../common/cards/GenericAttackCard';
import ThreatActorsIndividualCards, {
  ThreatActorsIndividualCardsFragment,
  threatActorsIndividualCardsPaginationQuery,
} from './threat_actors_individual/ThreatActorsIndividualCards';
import {
  ThreatActorsIndividualCardsPaginationQuery,
  ThreatActorsIndividualCardsPaginationQuery$variables,
} from './threat_actors_individual/__generated__/ThreatActorsIndividualCardsPaginationQuery.graphql';
import ThreatActorIndividualCreation from './threat_actors_individual/ThreatActorIndividualCreation';
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

const LOCAL_STORAGE_KEY_THREAT_ACTORS_INDIVIDUAL = 'threatActorsIndividuals';

const ThreatActorsIndividual = () => {
  const { t_i18n } = useFormatter();
  const initialValues = {
    filters: emptyFilterGroup,
    searchTerm: '',
    sortBy: 'name',
    orderAsc: true,
    openExports: false,
    view: 'cards',
  };
  const { setTitle } = useConnectedDocumentModifier();
  setTitle(t_i18n('Threat Actors (Individual) | Threats'));
  const { viewStorage, helpers, paginationOptions } = usePaginationLocalStorage<ThreatActorsIndividualCardsPaginationQuery$variables>(
    LOCAL_STORAGE_KEY_THREAT_ACTORS_INDIVIDUAL,
    initialValues,
  );

  const contextFilters = useBuildEntityTypeBasedFilterContext('Threat-Actor-Individual', viewStorage.filters);
  const queryPaginationOptions = {
    ...paginationOptions,
    filters: contextFilters,
  } as unknown as ThreatActorsIndividualCardsPaginationQuery$variables;

  const queryRef = useQueryLoading<ThreatActorsIndividualCardsPaginationQuery>(
    threatActorsIndividualCardsPaginationQuery,
    queryPaginationOptions,
  );

  const renderCards = () => {
    const {
      numberOfElements,
      filters,
      searchTerm,
      sortBy,
      orderAsc,
      openExports,
    } = viewStorage;
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
        exportContext={{ entity_type: 'Threat-Actor-Individual' }}
        keyword={searchTerm}
        filters={filters}
        paginationOptions={paginationOptions}
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
            <ThreatActorsIndividualCards
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
      threat_actor_types: {
        label: 'Type',
        percentWidth: 13,
      },
      sophistication: {},
      resource_level: {},
      creator: {},
      objectLabel: {},
      modified: {},
      objectMarking: { percentWidth: 10 },
    };

    const preloadedPaginationProps = {
      linesQuery: threatActorsIndividualCardsPaginationQuery,
      linesFragment: ThreatActorsIndividualCardsFragment,
      queryRef,
      nodePath: ['threatActorsIndividuals', 'pageInfo', 'globalCount'],
      setNumberOfElements: helpers.handleSetNumberOfElements,
    } as UsePreloadedPaginationFragment<ThreatActorsIndividualCardsPaginationQuery>;

    return (
      <>
        {queryRef && (
          <DataTable
            dataColumns={dataColumns}
            resolvePath={(data: ThreatActorsIndividualCards_data$data) => data.threatActorsIndividuals?.edges?.map((n) => n?.node)}
            storageKey={LOCAL_STORAGE_KEY_THREAT_ACTORS_INDIVIDUAL}
            initialValues={initialValues}
            contextFilters={contextFilters}
            preloadedPaginationProps={preloadedPaginationProps}
            lineFragment={ThreatActorIndividualCardFragment}
            exportContext={{ entity_type: 'Threat-Actor-Individual' }}
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
            emptyStateMessage={t_i18n('No threat actors (individual) yet. Create one to start tracking a threat actor individual.')}
          />
        )}
      </>
    );
  };

  return (
    <div data-testid="threat-actors-individual-page">
      <Breadcrumbs elements={[{ label: t_i18n('Threats') }, { label: t_i18n('Threat actors (individual)'), current: true }]} />
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
                {t_i18n('Threat actors (individual)')}
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
              {t_i18n('Track and manage individual threat actors and their activities')}
            </Typography>
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, flexShrink: 0 }}>
            <Security key="form-intake" needs={[KNOWLEDGE_KNUPDATE]}>
              <StixCoreObjectForms entityType="Threat-Actor-Individual" />
            </Security>
            <Security needs={[KNOWLEDGE_KNUPDATE]}>
              <ThreatActorIndividualCreation paginationOptions={queryPaginationOptions} />
            </Security>
          </Box>
        </Box>
        {viewStorage.view !== 'lines' ? renderCards() : renderList()}
      </Box>
    </div>
  );
};

export default ThreatActorsIndividual;
