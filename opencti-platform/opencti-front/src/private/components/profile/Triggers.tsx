import React, { Suspense } from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Tooltip from '@mui/material/Tooltip';
import { TriggersLinesPaginationQuery, TriggersLinesPaginationQuery$variables } from './triggers/__generated__/TriggersLinesPaginationQuery.graphql';
import { TriggersLines_data$data } from './triggers/__generated__/TriggersLines_data.graphql';
import { triggersLinesQuery, triggersLinesFragment } from './triggers/TriggersLines';
import { triggerLineFragment } from './triggers/TriggerLine';
import TriggerCreation from './triggers/TriggerCreation';
import TriggerPopover from './triggers/TriggerPopover';
import Loader, { LoaderVariant } from '../../../components/Loader';
import { usePaginationLocalStorage } from '../../../utils/hooks/useLocalStorage';
import useQueryLoading from '../../../utils/hooks/useQueryLoading';
import { emptyFilterGroup, useBuildEntityTypeBasedFilterContext, useGetDefaultFilterObject } from '../../../utils/filters/filtersUtils';
import Breadcrumbs from '../../../components/Breadcrumbs';
import { useFormatter } from '../../../components/i18n';
import DataTable from '../../../components/dataGrid/DataTable';
import { DataTableProps } from '../../../components/dataGrid/dataTableTypes';
import { UsePreloadedPaginationFragment } from '../../../utils/hooks/usePreloadedPaginationFragment';
import useConnectedDocumentModifier from '../../../utils/hooks/useConnectedDocumentModifier';
import { EMPTY_VALUE } from '../../../utils/String';
import Tag from '../../../components/common/tag/Tag';
import { dayStartDate, formatTimeForToday } from '../../../utils/Time';
import { deserializeFilterGroupForFrontend, isFilterGroupNotEmpty } from '../../../utils/filters/filtersUtils';
import FilterIconButton from '../../../components/FilterIconButton';
import { AlarmClock, Table as BackupTable } from 'lucide-react';

export const LOCAL_STORAGE_KEY_TRIGGERS = 'triggers';

const lowercaseVoiceSx = {
  textTransform: 'lowercase',
  '&::first-letter': { textTransform: 'uppercase' },
} as const;

const Triggers = () => {
  const { t_i18n, nt } = useFormatter();
  const { setTitle } = useConnectedDocumentModifier();
  setTitle(t_i18n('Triggers'));

  const initialValues = {
    searchTerm: '',
    sortBy: 'name',
    orderAsc: true,
    filters: {
      ...emptyFilterGroup,
      filters: useGetDefaultFilterObject(['trigger_type', 'instance_trigger'], ['Trigger']),
    },
    numberOfElements: {
      number: 0,
      symbol: '',
    },
  };

  const {
    viewStorage,
    paginationOptions,
    helpers: storageHelpers,
  } = usePaginationLocalStorage<TriggersLinesPaginationQuery$variables>(
    LOCAL_STORAGE_KEY_TRIGGERS,
    initialValues,
  );

  const contextFilters = useBuildEntityTypeBasedFilterContext('Trigger', viewStorage.filters);
  const triggerPaginationOptions = {
    ...paginationOptions,
    filters: contextFilters,
  } as unknown as TriggersLinesPaginationQuery$variables;

  const queryRef = useQueryLoading<TriggersLinesPaginationQuery>(
    triggersLinesQuery,
    triggerPaginationOptions,
  );

  const dataColumns: DataTableProps['dataColumns'] = {
    trigger_type: {
      id: 'trigger_type',
      label: 'Type',
      percentWidth: 10,
      isSortable: true,
      render: ({ trigger_type }) => {
        const isLive = trigger_type === 'live';
        return (
          <Box
            component="span"
            sx={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              fontSize: 12,
              fontWeight: 500,
              color: isLive ? 'var(--ravin-warning)' : 'var(--ravin-text-muted)',
              backgroundColor: isLive
                ? 'color-mix(in srgb, var(--ravin-warning) 15%, transparent)'
                : 'var(--ravin-surface-2)',
              borderRadius: '4px',
              padding: '2px 8px',
              lineHeight: '20px',
              ...lowercaseVoiceSx,
            }}
          >
            {isLive
              ? <AlarmClock size={12} />
              : <BackupTable size={12} />}
            {isLive ? t_i18n('Live trigger') : t_i18n('Regular digest')}
          </Box>
        );
      },
    },
    name: {
      id: 'name',
      percentWidth: 15,
      isSortable: true,
      render: ({ name }) => (
        <Tooltip title={name}>
          <span style={{ fontWeight: 500, color: 'var(--ravin-text)' }}>{name}</span>
        </Tooltip>
      ),
    },
    notifiers: {
      id: 'notifiers',
      label: 'Notifiers',
      percentWidth: 20,
      render: ({ notifiers }) => {
        if (!notifiers || notifiers.length === 0) return EMPTY_VALUE;
        return (
          <Box sx={{ display: 'flex', gap: '4px', flexWrap: 'wrap', alignItems: 'center' }}>
            {notifiers.map((n: { id: string; name: string }) => (
              <Tag
                key={n.id}
                label={n.name}
                labelTextTransform="lowercase"
              />
            ))}
          </Box>
        );
      },
    },
    event_types: {
      id: 'event_types',
      percentWidth: 20,
      render: ({ event_types, triggers }) => {
        if ((!event_types || event_types.length === 0) && (!triggers || triggers.length === 0)) {
          return EMPTY_VALUE;
        }
        return (
          <Box sx={{ display: 'flex', gap: '4px', flexWrap: 'wrap', alignItems: 'center' }}>
            {event_types?.map((n: string) => (
              <Tag key={n} label={t_i18n(n)} labelTextTransform="lowercase" />
            ))}
            {triggers?.map((n: { id: string; name: string }) => (
              <Tag
                key={n?.id}
                label={n?.name}
                color="var(--ravin-warning)"
                labelTextTransform="lowercase"
              />
            ))}
          </Box>
        );
      },
    },
    filters: {
      id: 'filters',
      label: 'Filters',
      percentWidth: 35,
      render: (data) => {
        if (data.trigger_type === 'live') {
          const deserializedFilters = deserializeFilterGroupForFrontend(data.filters);
          if (!isFilterGroupNotEmpty(deserializedFilters)) return EMPTY_VALUE;
          return (
            <FilterIconButton
              filters={deserializedFilters}
              variant="small"
              redirection
              entityTypes={data.instance_trigger ? ['Instance'] : ['Stix-Core-Object', 'Stix-Filtering']}
            />
          );
        }
        const currentTime = data.trigger_time?.split('-') ?? [dayStartDate().toISOString()];
        const day = currentTime.length > 1 ? currentTime[0] : '1';
        const time = currentTime.length > 1
          ? formatTimeForToday(currentTime[1])
          : formatTimeForToday(currentTime[0]);
        return (
          <Box sx={{ display: 'flex', gap: '4px', flexWrap: 'wrap', alignItems: 'center' }}>
            <Tag
              label={(
                <span>
                  <strong>{t_i18n('Period: ')}</strong>
                  {data.period}
                </span>
              )}
              labelTextTransform="lowercase"
            />
            {currentTime.length > 1 && (
              <Tag
                label={(
                  <span>
                    <strong>{t_i18n('Day: ')}</strong>
                    {day}
                  </span>
                )}
                labelTextTransform="lowercase"
              />
            )}
            {data.trigger_time && data.trigger_time.length > 0 && (
              <Tag
                label={(
                  <span>
                    <strong>{t_i18n('Time: ')}</strong>
                    {nt(time)}
                  </span>
                )}
                labelTextTransform="lowercase"
              />
            )}
          </Box>
        );
      },
    },
  };

  const preloadedPaginationProps = {
    linesQuery: triggersLinesQuery,
    linesFragment: triggersLinesFragment,
    queryRef,
    nodePath: ['triggersKnowledge', 'pageInfo', 'globalCount'],
    setNumberOfElements: storageHelpers.handleSetNumberOfElements,
  } as UsePreloadedPaginationFragment<TriggersLinesPaginationQuery>;

  const createButton = (
    <TriggerCreation paginationOptions={triggerPaginationOptions} />
  );

  return (
    <>
      <Breadcrumbs elements={[{ label: t_i18n('Triggers'), current: true }]} />
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
                {t_i18n('Triggers')}
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
              {t_i18n('Get notified on threat intelligence changes')}
            </Typography>
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            {createButton}
          </Box>
        </Box>

        {queryRef && (
          <Suspense fallback={<Loader variant={LoaderVariant.inElement} />}>
            <DataTable
              dataColumns={dataColumns}
              resolvePath={(data: TriggersLines_data$data) => {
                return data.triggersKnowledge?.edges?.map((n) => n?.node);
              }}
              storageKey={LOCAL_STORAGE_KEY_TRIGGERS}
              initialValues={initialValues}
              lineFragment={triggerLineFragment}
              preloadedPaginationProps={preloadedPaginationProps}
              entityTypes={['Trigger']}
              contextFilters={contextFilters}
              searchContextFinal={{ entityTypes: ['Trigger'] }}
              disableNavigation
              emptyStateMessage={t_i18n('No triggers yet. Create one to start monitoring threat intelligence changes.')}
              icon={({ trigger_type }) => (
                trigger_type === 'live'
                  ? <AlarmClock size={18} style={{ color: 'var(--ravin-warning)' }} />
                  : <BackupTable size={18} style={{ color: 'var(--ravin-text-muted)' }} />
              )}
              actions={(row) => (
                <TriggerPopover
                  id={row.id}
                  paginationOptions={triggerPaginationOptions}
                  disabled={!row.isDirectAdministrator}
                />
              )}
            />
          </Suspense>
        )}
      </Box>
    </>
  );
};

export default Triggers;
