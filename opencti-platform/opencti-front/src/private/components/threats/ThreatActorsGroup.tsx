import React from 'react';
import Grid from '@mui/material/Grid';
import { Box, Typography } from '@mui/material';
import { GenericAttackCardDummy } from '@components/common/cards/GenericAttackCard';
import {
  ThreatActorsGroupCardsPaginationQuery,
  ThreatActorsGroupCardsPaginationQuery$variables,
} from '@components/threats/threat_actors_group/__generated__/ThreatActorsGroupCardsPaginationQuery.graphql';
import { ThreatActorGroupCardFragment } from '@components/threats/threat_actors_group/ThreatActorGroupCard';
import { ThreatActorsGroupCards_data$data } from '@components/threats/threat_actors_group/__generated__/ThreatActorsGroupCards_data.graphql';
import Tooltip from '@mui/material/Tooltip';
import { List as ViewListOutlined, LayoutGrid as ViewModuleOutlined } from 'lucide-react';
import ToggleButton from '@mui/material/ToggleButton';
import StixCoreObjectForms from '@components/common/stix_core_objects/StixCoreObjectForms';
import ListCards from '../../../components/list_cards/ListCards';
import ThreatActorsGroupCards, { ThreatActorsGroupCardsFragment, threatActorsGroupCardsQuery } from './threat_actors_group/ThreatActorsGroupCards';
import ThreatActorGroupCreation from './threat_actors_group/ThreatActorGroupCreation';
import { usePaginationLocalStorage } from '../../../utils/hooks/useLocalStorage';
import useQueryLoading from '../../../utils/hooks/useQueryLoading';
import { emptyFilterGroup, useBuildEntityTypeBasedFilterContext } from '../../../utils/filters/filtersUtils';
import Breadcrumbs from '../../../components/Breadcrumbs';
import { useFormatter } from '../../../components/i18n';
import DataTable from '../../../components/dataGrid/DataTable';
import { UsePreloadedPaginationFragment } from '../../../utils/hooks/usePreloadedPaginationFragment';
import useConnectedDocumentModifier from '../../../utils/hooks/useConnectedDocumentModifier';
import { KNOWLEDGE_KNUPDATE } from '../../../utils/hooks/useGranted';
import Security from '../../../utils/Security';

const lowercaseVoiceSx = {
  textTransform: 'lowercase',
  '&::first-letter': { textTransform: 'uppercase' },
} as const;

const LOCAL_STORAGE_KEY = 'threatActorsGroups';

const ThreatActorsGroup = () => {
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
  setTitle(t_i18n('Threat Actors (Group) | Threats'));
  const { viewStorage, helpers, paginationOptions } = usePaginationLocalStorage<ThreatActorsGroupCardsPaginationQuery$variables>(
    LOCAL_STORAGE_KEY,
    initialValues,
  );

  const contextFilters = useBuildEntityTypeBasedFilterContext('Threat-Actor-Group', viewStorage.filters);
  const queryPaginationOptions = {
    ...paginationOptions,
    filters: contextFilters,
  } as unknown as ThreatActorsGroupCardsPaginationQuery$variables;

  const queryRef = useQueryLoading<ThreatActorsGroupCardsPaginationQuery>(
    threatActorsGroupCardsQuery,
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
        exportContext={{ entity_type: 'Threat-Actor-Group' }}
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
            <ThreatActorsGroupCards
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
      linesQuery: threatActorsGroupCardsQuery,
      linesFragment: ThreatActorsGroupCardsFragment,
      queryRef,
      nodePath: ['threatActorsGroup', 'pageInfo', 'globalCount'],
      setNumberOfElements: helpers.handleSetNumberOfElements,
    } as UsePreloadedPaginationFragment<ThreatActorsGroupCardsPaginationQuery>;

    return (
      <>
        {queryRef && (
          <DataTable
            dataColumns={dataColumns}
            resolvePath={(data: ThreatActorsGroupCards_data$data) => data.threatActorsGroup?.edges?.map((n) => n?.node)}
            storageKey={LOCAL_STORAGE_KEY}
            initialValues={initialValues}
            contextFilters={contextFilters}
            preloadedPaginationProps={preloadedPaginationProps}
            lineFragment={ThreatActorGroupCardFragment}
            exportContext={{ entity_type: 'Threat-Actor-Group' }}
            additionalHeaderToggleButtons={[
              <Tooltip key="cards" title={t_i18n('Cards view')}>
                <ToggleButton value="cards" aria-label="cards">
                  <ViewModuleOutlined size={16} />
                </ToggleButton>
              </Tooltip>,
              <Tooltip key="lines" title={t_i18n('Lines view')}>
                <ToggleButton value="lines" aria-label="lines">
                  <ViewListOutlined size={16} />
                </ToggleButton>
              </Tooltip>,
            ]}
            emptyStateMessage={t_i18n('No threat actors (group) yet. Create one to start tracking a threat actor group.')}
          />
        )}
      </>
    );
  };

  return (
    <div data-testid="threat-actor-group-page">
      <Breadcrumbs elements={[{ label: t_i18n('Threats') }, { label: t_i18n('Threat actors (group)'), current: true }]} />
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
                {t_i18n('Threat actors (group)')}
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
              {t_i18n('Track and manage threat actor groups targeting organizations and individuals')}
            </Typography>
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, flexShrink: 0 }}>
            <Security key="form-intake" needs={[KNOWLEDGE_KNUPDATE]}>
              <StixCoreObjectForms entityType="Threat-Actor-Group" />
            </Security>
            <Security needs={[KNOWLEDGE_KNUPDATE]}>
              <ThreatActorGroupCreation paginationOptions={queryPaginationOptions} />
            </Security>
          </Box>
        </Box>
        {viewStorage.view !== 'lines' ? renderCards() : renderList()}
      </Box>
    </div>
  );
};

export default ThreatActorsGroup;
