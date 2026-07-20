import React from 'react';
import { ErrorBoundary } from '@components/Error';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Tooltip from '@mui/material/Tooltip';
import { WorkspacesLinesPaginationQuery, WorkspacesLinesPaginationQuery$variables } from '@components/workspaces/__generated__/WorkspacesLinesPaginationQuery.graphql';
import { WorkspacesLines_data$data } from '@components/workspaces/__generated__/WorkspacesLines_data.graphql';
import { workspaceLineFragment, workspacesLinesQuery, workspacesLineFragment } from './Workspaces';
import WorkspacePopover from '@components/workspaces/WorkspacePopover';
import WorkspaceCreation from './WorkspaceCreation';
import Security from '../../../utils/Security';
import { INVESTIGATION_INUPDATE } from '../../../utils/hooks/useGranted';
import { usePaginationLocalStorage } from '../../../utils/hooks/useLocalStorage';
import useQueryLoading from '../../../utils/hooks/useQueryLoading';
import { emptyFilterGroup, useBuildEntityTypeBasedFilterContext } from '../../../utils/filters/filtersUtils';
import Breadcrumbs from '../../../components/Breadcrumbs';
import { useFormatter } from '../../../components/i18n';
import DataTable from '../../../components/dataGrid/DataTable';
import { DataTableProps } from '../../../components/dataGrid/dataTableTypes';
import { defaultRender, Truncate } from '../../../components/dataGrid/dataTableUtils';
import useConnectedDocumentModifier from '../../../utils/hooks/useConnectedDocumentModifier';
import { resolveLink } from '../../../utils/Entity';
import { EMPTY_VALUE } from '../../../utils/String';
import Tag from '../../../components/common/tag/Tag';
import TagsOverflow from '../../../components/common/tag/TagsOverflow';

const LOCAL_STORAGE_KEY = 'view-investigation-list';

const initialStorageValues = {
  searchTerm: '',
  sortBy: 'name',
  orderAsc: false,
  openExports: false,
  redirectionMode: 'overview',
  filters: emptyFilterGroup,
};

const lowercaseVoiceSx = {
  textTransform: 'lowercase',
  '&::first-letter': { textTransform: 'uppercase' },
} as const;

const Investigations = () => {
  const { t_i18n } = useFormatter();
  const { setTitle } = useConnectedDocumentModifier();
  setTitle(t_i18n('Investigations'));

  const {
    viewStorage,
    paginationOptions,
    helpers: storageHelpers,
  } = usePaginationLocalStorage<WorkspacesLinesPaginationQuery$variables>(
    LOCAL_STORAGE_KEY,
    initialStorageValues,
  );

  const filters = useBuildEntityTypeBasedFilterContext(
    'Workspace',
    {
      mode: 'and',
      filters: [{
        key: 'type',
        values: ['investigation'],
        mode: 'or',
        operator: 'eq',
      }],
      filterGroups: viewStorage.filters ? [viewStorage.filters] : [],
    },
  );

  const workspacePaginationOptions = {
    ...paginationOptions,
    filters,
  } as unknown as WorkspacesLinesPaginationQuery$variables;

  const queryRef = useQueryLoading<WorkspacesLinesPaginationQuery>(
    workspacesLinesQuery,
    workspacePaginationOptions,
  );

  const dataColumns: DataTableProps['dataColumns'] = {
    name: {
      id: 'name',
      percentWidth: 33,
      render: (data) => {
        const name = data.name || data.id;
        const link = `${resolveLink('Investigation')}/${data.id}`;
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
    tags: {
      id: 'tags',
      render: ({ tags }) => {
        if (!tags || tags.length === 0) return EMPTY_VALUE;
        return (
          <TagsOverflow
            items={tags}
            getKey={(tag: string) => tag}
            renderTag={(tag: string) => (
              <Tag label={tag} labelTextTransform="lowercase" />
            )}
          />
        );
      },
    },
    creator: {
      id: 'creator',
      isSortable: true,
      render: ({ owner }) => (
        <span style={{ color: 'var(--ravin-text-muted)' }}>
          {defaultRender(owner?.name)}
        </span>
      ),
    },
    created_at: {
      id: 'created_at',
      percentWidth: 16,
      render: ({ created_at }, { rd, nsdt }) => (
        <Tooltip title={nsdt(created_at)}>
          <span>{rd(created_at)}</span>
        </Tooltip>
      ),
    },
    updated_at: {
      id: 'updated_at',
      percentWidth: 20,
      render: ({ updated_at }, { rd, nsdt }) => (
        <Tooltip title={nsdt(updated_at)}>
          <span>{rd(updated_at)}</span>
        </Tooltip>
      ),
    },
  };

  const createButton = (
    <Security needs={[INVESTIGATION_INUPDATE]}>
      <WorkspaceCreation
        paginationOptions={workspacePaginationOptions}
        type="investigation"
      />
    </Security>
  );

  return (
    <>
      <Breadcrumbs
        elements={[{ label: t_i18n('Investigations'), current: true }]}
      />

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
                {t_i18n('Investigations')}
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
              {t_i18n('Graph and analyze threat relationships across entities')}
            </Typography>
          </Box>
          {createButton}
        </Box>

        {queryRef && (
          <DataTable
            dataColumns={dataColumns}
            resolvePath={(data: WorkspacesLines_data$data) => {
              return data.workspaces?.edges?.map((n) => n?.node);
            }}
            storageKey={LOCAL_STORAGE_KEY}
            initialValues={initialStorageValues}
            contextFilters={filters}
            preloadedPaginationProps={{
              linesQuery: workspacesLinesQuery,
              linesFragment: workspacesLineFragment,
              queryRef,
              nodePath: ['workspaces', 'pageInfo', 'globalCount'],
              setNumberOfElements: storageHelpers.handleSetNumberOfElements,
            }}
            lineFragment={workspaceLineFragment}
            entityTypes={['Workspace']}
            searchContextFinal={{ entityTypes: ['Workspace'] }}
            emptyStateMessage={t_i18n('No investigations yet. Create one to start graphing threat relationships.')}
            taskScope="INVESTIGATION"
            actions={(row) => (
              <Security needs={[INVESTIGATION_INUPDATE]}>
                <ErrorBoundary display={() => null}>
                  <WorkspacePopover
                    data={row}
                    paginationOptions={workspacePaginationOptions}
                  />
                </ErrorBoundary>
              </Security>
            )}
          />
        )}
      </Box>
    </>
  );
};

export default Investigations;
