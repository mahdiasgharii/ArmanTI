import { FunctionComponent } from 'react';
import { Box, Typography } from '@mui/material';
import { StixCyberObservablesLines_data$data } from '@components/observations/stix_cyber_observables/__generated__/StixCyberObservablesLines_data.graphql';
import { stixCyberObservableLineFragment } from '@components/observations/stix_cyber_observables/StixCyberObservableLine';
import { StixCyberObservablesLinesSearchQuery$data } from '@components/observations/stix_cyber_observables/__generated__/StixCyberObservablesLinesSearchQuery.graphql';
import { StixCyberObservableLine_node$data } from '@components/observations/stix_cyber_observables/__generated__/StixCyberObservableLine_node.graphql';
import StixCyberObservableCreation from './stix_cyber_observables/StixCyberObservableCreation';
import Security from '../../../utils/Security';
import { usePaginationLocalStorage } from '../../../utils/hooks/useLocalStorage';
import { stixCyberObservablesLinesFragment, stixCyberObservablesLinesQuery, stixCyberObservablesLinesSearchQuery } from './stix_cyber_observables/StixCyberObservablesLines';
import {
  StixCyberObservablesLinesPaginationQuery,
  StixCyberObservablesLinesPaginationQuery$variables,
} from './stix_cyber_observables/__generated__/StixCyberObservablesLinesPaginationQuery.graphql';
import useAuth from '../../../utils/hooks/useAuth';
import { KNOWLEDGE_KNUPDATE } from '../../../utils/hooks/useGranted';
import ExportContextProvider from '../../../utils/ExportContextProvider';
import { useBuildEntityTypeBasedFilterContext, emptyFilterGroup, useGetDefaultFilterObject } from '../../../utils/filters/filtersUtils';
import { useFormatter } from '../../../components/i18n';
import Breadcrumbs from '../../../components/Breadcrumbs';
import useQueryLoading from '../../../utils/hooks/useQueryLoading';
import { UsePreloadedPaginationFragment } from '../../../utils/hooks/usePreloadedPaginationFragment';
import DataTable from '../../../components/dataGrid/DataTable';
import useCopy from '../../../utils/hooks/useCopy';
import useEntityToggle from '../../../utils/hooks/useEntityToggle';
import useConnectedDocumentModifier from '../../../utils/hooks/useConnectedDocumentModifier';

const LOCAL_STORAGE_KEY = 'stixCyberObservables';

const lowercaseVoiceSx = {
  textTransform: 'lowercase',
  '&::first-letter': { textTransform: 'uppercase' },
} as const;

const StixCyberObservables: FunctionComponent = () => {
  const { t_i18n } = useFormatter();
  const { setTitle } = useConnectedDocumentModifier();
  setTitle(t_i18n('Observables | Observations'));
  const {
    platformModuleHelpers: { isRuntimeFieldEnable },
  } = useAuth();

  const isRuntimeSort = isRuntimeFieldEnable() ?? false;

  const initialValues = {
    filters: {
      ...emptyFilterGroup,
      filters: useGetDefaultFilterObject(['entity_type', 'sightedBy'], ['Stix-Cyber-Observable']),
    },
    searchTerm: '',
    sortBy: 'created_at',
    orderAsc: false,
    openExports: false,
  };

  const { viewStorage, paginationOptions, helpers: storageHelpers } = usePaginationLocalStorage<StixCyberObservablesLinesPaginationQuery$variables>(
    LOCAL_STORAGE_KEY,
    initialValues,
  );

  const contextFilters = useBuildEntityTypeBasedFilterContext('Stix-Cyber-Observable', viewStorage.filters);
  const queryPaginationOptions = {
    ...paginationOptions,
    filters: contextFilters,
  } as unknown as StixCyberObservablesLinesPaginationQuery$variables;

  const queryRef = useQueryLoading<StixCyberObservablesLinesPaginationQuery>(
    stixCyberObservablesLinesQuery,
    queryPaginationOptions,
  );

  const preloadedPaginationProps = {
    linesQuery: stixCyberObservablesLinesQuery,
    linesFragment: stixCyberObservablesLinesFragment,
    queryRef,
    nodePath: ['stixCyberObservables', 'pageInfo', 'globalCount'],
    setNumberOfElements: storageHelpers.handleSetNumberOfElements,
  } as UsePreloadedPaginationFragment<StixCyberObservablesLinesPaginationQuery>;

  const dataColumns = {
    entity_type: {
      percentWidth: 12,
    },
    observable_value: {
      label: 'Representation',
      percentWidth: 29,
      isSortable: isRuntimeSort,
    },
    createdBy: {
      percentWidth: 12,
      isSortable: isRuntimeSort,
    },
    creator: {
      percentWidth: 12,
      isSortable: isRuntimeSort,
    },
    objectLabel: {
      percentWidth: 15,
    },
    created_at: {
      percentWidth: 10,
    },
    objectMarking: {
      percentWidth: 10,
      isSortable: isRuntimeSort,
    },
  };

  const {
    selectedElements,
    deSelectedElements,
    selectAll,
  } = useEntityToggle<StixCyberObservableLine_node$data>(LOCAL_STORAGE_KEY);

  const getValuesForCopy = (
    data: StixCyberObservablesLinesSearchQuery$data,
  ) => {
    return (data.stixCyberObservables?.edges ?? []).map((o) => (o
      ? { id: o.node.id, value: o.node.observable_value }
      : { id: '', value: '' }));
  };

  const handleCopy = useCopy<StixCyberObservablesLinesSearchQuery$data>(
    {
      filters: contextFilters,
      searchTerm: viewStorage.searchTerm ?? '',
      query: stixCyberObservablesLinesSearchQuery,
      selectedValues: Object.values(selectedElements).map(
        ({ observable_value }) => observable_value,
      ),
      deselectedIds: Object.values(deSelectedElements).map((o) => o.id),
      getValuesForCopy,
    },
    selectAll,
  );

  return (
    <div data-testid="observables-page">
      <ExportContextProvider>
        <Breadcrumbs elements={[{ label: t_i18n('Observations') }, { label: t_i18n('Observables'), current: true }]} />
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
                  {t_i18n('Observables')}
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
                {t_i18n('Track and manage cyber observables — IPs, domains, hashes, files, and more')}
              </Typography>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, flexShrink: 0 }}>
              <Security needs={[KNOWLEDGE_KNUPDATE]}>
                <StixCyberObservableCreation
                  paginationKey="Pagination_stixCyberObservables"
                  paginationOptions={queryPaginationOptions}
                  contextual={false}
                  open={false}
                  speeddial={false}
                  controlledDialStyles={{ marginLeft: 1 }}
                  type={undefined}
                  defaultCreatedBy={undefined}
                  inputValue=""
                />
              </Security>
            </Box>
          </Box>
          {queryRef && (
            <DataTable
              storageKey={LOCAL_STORAGE_KEY}
              initialValues={initialValues}
              preloadedPaginationProps={preloadedPaginationProps}
              resolvePath={(data: StixCyberObservablesLines_data$data) => data.stixCyberObservables?.edges?.map?.((n) => n?.node)}
              dataColumns={dataColumns}
              lineFragment={stixCyberObservableLineFragment}
              contextFilters={contextFilters}
              handleCopy={handleCopy}
              exportContext={{ entity_type: 'Stix-Cyber-Observable' }}
              availableEntityTypes={['Stix-Cyber-Observable']}
              searchContextFinal={{ entityTypes: ['Stix-Cyber-Observable'] }}
              emptyStateMessage={t_i18n('No observables yet. Create one to start tracking a cyber observable.')}
            />
          )}
        </Box>
      </ExportContextProvider>
    </div>
  );
};

export default StixCyberObservables;
