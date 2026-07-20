import React from 'react';
import Grid from '@mui/material/Grid';
import { Box, Stack, Typography } from '@mui/material';
import { GenericAttackCardDummy } from '@components/common/cards/GenericAttackCard';
import ToggleButton from '@mui/material/ToggleButton';
import Tooltip from '@mui/material/Tooltip';
import { List as ViewListOutlined, LayoutGrid as ViewModuleOutlined } from 'lucide-react';
import { CampaignsCards_data$data } from '@components/threats/campaigns/__generated__/CampaignsCards_data.graphql';
import { CampaignCardFragment } from '@components/threats/campaigns/CampaignCard';
import StixCoreObjectForms from '@components/common/stix_core_objects/StixCoreObjectForms';
import { CampaignsCardsPaginationQuery, CampaignsCardsPaginationQuery$variables } from './campaigns/__generated__/CampaignsCardsPaginationQuery.graphql';
import ListCards from '../../../components/list_cards/ListCards';
import CampaignsCards, { campaignsCardsFragment, campaignsCardsQuery } from './campaigns/CampaignsCards';
import CampaignCreation from './campaigns/CampaignCreation';
import { usePaginationLocalStorage } from '../../../utils/hooks/useLocalStorage';
import useQueryLoading from '../../../utils/hooks/useQueryLoading';
import { emptyFilterGroup, useBuildEntityTypeBasedFilterContext } from '../../../utils/filters/filtersUtils';
import Breadcrumbs from '../../../components/Breadcrumbs';
import { useFormatter } from '../../../components/i18n';
import { UsePreloadedPaginationFragment } from '../../../utils/hooks/usePreloadedPaginationFragment';
import DataTable from '../../../components/dataGrid/DataTable';
import { defaultRender, Truncate } from '../../../components/dataGrid/dataTableUtils';
import { DraftChip } from '@components/common/draft/DraftChip';
import { getMainRepresentative } from '../../../utils/defaultRepresentatives';
import useConnectedDocumentModifier from '../../../utils/hooks/useConnectedDocumentModifier';
import { KNOWLEDGE_KNUPDATE } from '../../../utils/hooks/useGranted';
import Security from '../../../utils/Security';

const LOCAL_STORAGE_KEY = 'campaigns';

const lowercaseVoiceSx = {
  textTransform: 'lowercase',
  '&::first-letter': { textTransform: 'uppercase' },
} as const;

const Campaigns = () => {
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
  setTitle(t_i18n('Campaigns | Threats'));
  const { viewStorage, helpers, paginationOptions } = usePaginationLocalStorage<CampaignsCardsPaginationQuery$variables>(
    LOCAL_STORAGE_KEY,
    initialValues,
  );

  const contextFilters = useBuildEntityTypeBasedFilterContext('Campaign', viewStorage.filters);
  const queryPaginationOptions = {
    ...paginationOptions,
    filters: contextFilters,
  } as unknown as CampaignsCardsPaginationQuery$variables;

  const queryRef = useQueryLoading<CampaignsCardsPaginationQuery>(
    campaignsCardsQuery,
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
        exportContext={{ entity_type: 'Campaign' }}
        keyword={searchTerm}
        filters={filters}
        paginationOptions={queryPaginationOptions}
        numberOfElements={numberOfElements}
        handleChangeView={helpers.handleChangeView}
      >
        {queryRef && (
          <React.Suspense
            fallback={(
              <Grid
                container={true}
                spacing={3}
                style={{ paddingLeft: 17 }}
              >
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
            <CampaignsCards
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
        render: (data: { name?: string; id: string; draftVersion?: { draft_id: string } | null }) => {
          const name = getMainRepresentative(data);
          const link = `/dashboard/threats/campaigns/${data.id}`;
          const displayDraftChip = !!data.draftVersion;
          return (
            <Tooltip title={name}>
              <Stack direction="row" gap={1} alignItems="center" sx={{ maxWidth: '100%' }}>
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
                {displayDraftChip && <DraftChip />}
              </Stack>
            </Tooltip>
          );
        },
      },
      creator: {
        percentWidth: 13,
        render: ({ creators }) => {
          const value = creators?.map((c: { name: string }) => c.name);
          return (
            <span style={{ color: 'var(--ravin-text-muted)' }}>
              {defaultRender(value)}
            </span>
          );
        },
      },
      created: {
        percentWidth: 10,
        render: ({ created }, { rd, nsdt }) => (
          <Tooltip title={nsdt(created)}>
            <span>{rd(created)}</span>
          </Tooltip>
        ),
      },
      modified: {
        percentWidth: 15,
        render: ({ modified }, { rd, nsdt }) => (
          <Tooltip title={nsdt(modified)}>
            <span>{rd(modified)}</span>
          </Tooltip>
        ),
      },
      createdBy: {}, // 12
      objectLabel: {}, // 15
      x_opencti_workflow_id: {
        label: 'Processing status',
        percentWidth: 10,
      },
      objectMarking: { percentWidth: 10 },
    };

    const preloadedPaginationProps = {
      linesQuery: campaignsCardsQuery,
      linesFragment: campaignsCardsFragment,
      queryRef,
      nodePath: ['campaigns', 'pageInfo', 'globalCount'],
      setNumberOfElements: helpers.handleSetNumberOfElements,
    } as UsePreloadedPaginationFragment<CampaignsCardsPaginationQuery>;

    return (
      <>
        {queryRef && (
          <DataTable
            dataColumns={dataColumns}
            resolvePath={(data: CampaignsCards_data$data) => data.campaigns?.edges?.map((n) => n?.node)}
            storageKey={LOCAL_STORAGE_KEY}
            initialValues={initialValues}
            contextFilters={contextFilters}
            preloadedPaginationProps={preloadedPaginationProps}
            lineFragment={CampaignCardFragment}
            exportContext={{ entity_type: 'Campaign' }}
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
            emptyStateMessage={t_i18n('No campaigns yet. Create one to start tracking threat campaign activities.')}
          />
        )}
      </>
    );
  };

  return (
    <div data-testid="campaign-page">
      <Breadcrumbs elements={[{ label: t_i18n('Threats') }, { label: t_i18n('Campaigns'), current: true }]} />
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
                {t_i18n('Campaigns')}
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
              {t_i18n('Track and manage threat campaigns and their attack activities')}
            </Typography>
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, flexShrink: 0 }}>
            <Security key="form-intake" needs={[KNOWLEDGE_KNUPDATE]}>
              <StixCoreObjectForms entityType="Campaign" />
            </Security>
            <Security needs={[KNOWLEDGE_KNUPDATE]}>
              <CampaignCreation paginationOptions={queryPaginationOptions} />
            </Security>
          </Box>
        </Box>
        {viewStorage.view !== 'lines' ? renderCards() : renderList()}
      </Box>
    </div>
  );
};

export default Campaigns;
