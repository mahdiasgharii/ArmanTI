import React from 'react';
import { Box, Typography, Tooltip } from '@mui/material';
import {
  EntitiesStixDomainObjectsLinesPaginationQuery,
  EntitiesStixDomainObjectsLinesPaginationQuery$variables,
} from '@components/data/entities/__generated__/EntitiesStixDomainObjectsLinesPaginationQuery.graphql';
import { EntitiesStixDomainObjectsLines_data$data } from '@components/data/entities/__generated__/EntitiesStixDomainObjectsLines_data.graphql';
import { entitiesFragment } from '@components/data/entities/EntitiesStixDomainObjectLine';
import { entitiesStixDomainObjectsLinesFragment, entitiesStixDomainObjectsLinesQuery } from './entities/EntitiesStixDomainObjectsLines';
import useAuth from '../../../utils/hooks/useAuth';
import { usePaginationLocalStorage } from '../../../utils/hooks/useLocalStorage';
import useQueryLoading from '../../../utils/hooks/useQueryLoading';
import { useBuildEntityTypeBasedFilterContext, emptyFilterGroup, useGetDefaultFilterObject } from '../../../utils/filters/filtersUtils';
import { useFormatter } from '../../../components/i18n';
import Breadcrumbs from '../../../components/Breadcrumbs';
import DataTable from '../../../components/dataGrid/DataTable';
import { UsePreloadedPaginationFragment } from '../../../utils/hooks/usePreloadedPaginationFragment';
import { DataTableProps } from '../../../components/dataGrid/dataTableTypes';
import useConnectedDocumentModifier from '../../../utils/hooks/useConnectedDocumentModifier';
import ExportContextProvider from '../../../utils/ExportContextProvider';
import { resolveLink } from '../../../utils/Entity';
import { getMainRepresentative } from '../../../utils/defaultRepresentatives';
import { EMPTY_VALUE } from '../../../utils/String';
import { Truncate } from '../../../components/dataGrid/dataTableUtils';
import ItemMarkings from '../../../components/ItemMarkings';
import ItemEntityType from '../../../components/ItemEntityType';
import StixCoreObjectLabels from '../common/stix_core_objects/StixCoreObjectLabels';
import { DraftChip } from '@components/common/draft/DraftChip';

const lowercaseVoiceSx = {
  textTransform: 'lowercase',
  '&::first-letter': { textTransform: 'uppercase' },
} as const;

const LOCAL_STORAGE_KEY = 'entities';

const Entities = () => {
  const { t_i18n } = useFormatter();
  const { setTitle } = useConnectedDocumentModifier();
  setTitle(t_i18n('Entities | Data'));
  const {
    platformModuleHelpers: { isRuntimeFieldEnable },
  } = useAuth();

  const initialValues = {
    filters: {
      ...emptyFilterGroup,
      filters: useGetDefaultFilterObject(['entity_type'], ['Stix-Core-Object']),
    },
    sortBy: 'created_at',
    orderAsc: false,
    openExports: false,
  };
  const {
    viewStorage,
    paginationOptions,
    helpers: storageHelpers,
  } = usePaginationLocalStorage<EntitiesStixDomainObjectsLinesPaginationQuery$variables>(LOCAL_STORAGE_KEY, initialValues);

  const contextFilters = useBuildEntityTypeBasedFilterContext('Stix-Domain-Object', viewStorage.filters);
  const queryPaginationOptions = {
    ...paginationOptions,
    filters: contextFilters,
  } as unknown as EntitiesStixDomainObjectsLinesPaginationQuery$variables;
  const queryRef = useQueryLoading<EntitiesStixDomainObjectsLinesPaginationQuery>(
    entitiesStixDomainObjectsLinesQuery,
    queryPaginationOptions,
  );

  const isRuntimeSort = isRuntimeFieldEnable() ?? false;

  const dataColumns: DataTableProps['dataColumns'] = {
    entity_type: {
      percentWidth: 13,
      isSortable: isRuntimeSort,
      render: (data) => (
        <ItemEntityType entityType={data.entity_type} />
      ),
    },
    name: {
      percentWidth: 22,
      isSortable: isRuntimeSort,
      render: (data) => {
        const value = getMainRepresentative(data);
        const link = `${resolveLink(data.entity_type)}/${data.id}`;
        return (
          <Tooltip title={value}>
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
              <a
                href={link}
                style={{
                  color: 'var(--ravin-primary)',
                  textDecoration: 'none',
                  fontWeight: 500,
                }}
              >
                <Truncate>{value}</Truncate>
              </a>
              {data.draftVersion && <DraftChip />}
            </span>
          </Tooltip>
        );
      },
    },
    createdBy: {
      percentWidth: 13,
      isSortable: isRuntimeSort,
      render: ({ createdBy }) => (
        <span style={{ color: 'var(--ravin-text-muted)' }}>
          {createdBy?.name ?? EMPTY_VALUE}
        </span>
      ),
    },
    creator: {
      percentWidth: 13,
      isSortable: isRuntimeSort,
      render: ({ creators }) => {
        if (!creators || creators.length === 0) return EMPTY_VALUE;
        const value = creators.map((c: { name: string }) => c.name).join(', ');
        return (
          <span style={{ color: 'var(--ravin-text-muted)' }}>
            {value}
          </span>
        );
      },
    },
    objectLabel: {
      percentWidth: 15,
      render: ({ objectLabel }, { storageHelpers: { handleAddFilter } }) => (
        <StixCoreObjectLabels
          variant="inList"
          labels={objectLabel}
          onClick={handleAddFilter}
        />
      ),
    },
    created_at: {
      percentWidth: 14,
      isSortable: isRuntimeSort,
      render: ({ created_at }, { fd, nsdt }) => (
        <Tooltip title={nsdt(created_at)}>
          <span>{fd(created_at)}</span>
        </Tooltip>
      ),
    },
    objectMarking: {
      percentWidth: 10,
      isSortable: isRuntimeSort,
      render: ({ objectMarking }, { storageHelpers: { handleAddFilter } }) => (
        <ItemMarkings
          markingDefinitions={objectMarking ?? []}
          limit={1}
          onClick={(m) => handleAddFilter('objectMarking', m.id, 'eq')}
        />
      ),
    },
  };

  const preloadedPaginationProps = {
    linesQuery: entitiesStixDomainObjectsLinesQuery,
    linesFragment: entitiesStixDomainObjectsLinesFragment,
    queryRef,
    nodePath: ['stixDomainObjects', 'pageInfo', 'globalCount'],
    setNumberOfElements: storageHelpers.handleSetNumberOfElements,
  } as UsePreloadedPaginationFragment<EntitiesStixDomainObjectsLinesPaginationQuery>;

  return (
    <div data-testid="data-entities-page">
      <ExportContextProvider>
        <Breadcrumbs elements={[{ label: t_i18n('Data') }, { label: t_i18n('Entities'), current: true }]} />
        <Box sx={{ padding: '24px 24px 0 24px' }}>
          <Box sx={{ marginBottom: 2 }}>
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
                {t_i18n('Entities')}
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
              {t_i18n('All STIX domain objects in the intelligence workspace')}
            </Typography>
          </Box>
          {queryRef && (
            <DataTable
              storageKey={LOCAL_STORAGE_KEY}
              initialValues={initialValues}
              preloadedPaginationProps={preloadedPaginationProps}
              resolvePath={(data: EntitiesStixDomainObjectsLines_data$data) => data.stixDomainObjects?.edges?.map((n) => n?.node)}
              dataColumns={dataColumns}
              lineFragment={entitiesFragment}
              contextFilters={contextFilters}
              exportContext={{ entity_type: 'Stix-Domain-Object' }}
              availableEntityTypes={['Stix-Domain-Object']}
              emptyStateMessage={t_i18n('No entities found. Adjust your filters or create a new entity.')}
            />
          )}
        </Box>
      </ExportContextProvider>
    </div>
  );
};

export default Entities;
