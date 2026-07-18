import React, { Suspense, useMemo, useState, useRef, useCallback, useEffect } from 'react';
import { usePreloadedQuery, usePaginationFragment } from 'react-relay';
import { useNavigate } from 'react-router-dom';
import { LayoutDashboard, Table as TableIcon, Search } from 'lucide-react';
import { KeyboardArrowRightOutlined } from '@mui/icons-material';
import IconButton from '@common/button/IconButton';
import { ErrorBoundary } from '@components/Error';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';
import Chip from '@mui/material/Chip';
import Tooltip from '@mui/material/Tooltip';
import Skeleton from '@mui/material/Skeleton';
import TextField from '@mui/material/TextField';
import InputAdornment from '@mui/material/InputAdornment';
import Button from '@common/button/Button';
import { PreloadedQuery } from 'react-relay';
import { WorkspacesLinesPaginationQuery } from '@components/workspaces/__generated__/WorkspacesLinesPaginationQuery.graphql';
import { WorkspacesLines_data$data } from '@components/workspaces/__generated__/WorkspacesLines_data.graphql';
import { workspaceLineFragment, workspacesLinesQuery, workspacesLineFragment } from './Workspaces';
import WorkspacePopover from '@components/workspaces/WorkspacePopover';
import WorkspaceCreation from './WorkspaceCreation';
import Security from '../../../utils/Security';
import { EXPLORE, EXPLORE_EXUPDATE } from '../../../utils/hooks/useGranted';
import { usePaginationLocalStorage } from '../../../utils/hooks/useLocalStorage';
import useQueryLoading from '../../../utils/hooks/useQueryLoading';
import { emptyFilterGroup, useBuildEntityTypeBasedFilterContext } from '../../../utils/filters/filtersUtils';
import Breadcrumbs from '../../../components/Breadcrumbs';
import { useFormatter } from '../../../components/i18n';
import DataTable from '../../../components/dataGrid/DataTable';
import { DataTableProps } from '../../../components/dataGrid/dataTableTypes';
import { defaultRender } from '../../../components/dataGrid/dataTableUtils';
import useConnectedDocumentModifier from '../../../utils/hooks/useConnectedDocumentModifier';
import { WorkspacesLinesPaginationQuery$variables } from './__generated__/WorkspacesLinesPaginationQuery.graphql';
import type { WorkspacesLine_node$data } from './__generated__/WorkspacesLine_node.graphql';

type ViewMode = 'table' | 'grid';

const LOCAL_STORAGE_KEY = 'view-custom-dashboards';
const VIEW_MODE_KEY = 'custom-dashboards-view-mode';

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

const DashboardCard = ({
  workspace,
  paginationOptions,
}: {
  workspace: WorkspacesLine_node$data;
  paginationOptions: WorkspacesLinesPaginationQuery$variables;
}) => {
  const navigate = useNavigate();
  const { t_i18n, fd, rd } = useFormatter();

  const handleClick = () => {
    navigate(`/dashboard/workspaces/dashboards/${workspace.id}`);
  };

  const tags = workspace.tags ?? [];
  const manifest = workspace.manifest;
  let description: string | null = null;
  if (manifest) {
    try {
      const parsed = JSON.parse(manifest);
      description = parsed?.description ?? null;
    } catch {
      // manifest is not valid JSON, skip
    }
  }

  return (
    <Box
      onClick={handleClick}
      role="link"
      aria-label={workspace.name}
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          handleClick();
        }
      }}
      sx={{
        position: 'relative',
        backgroundColor: 'var(--ravin-bg)',
        border: '1px solid var(--ravin-border)',
        borderRadius: '8px',
        padding: '16px',
        cursor: 'pointer',
        display: 'flex',
        flexDirection: 'column',
        gap: '12px',
        minHeight: '180px',
        transition: 'background-color 150ms ease, border-color 150ms ease',
        '&:hover': {
          backgroundColor: 'color-mix(in srgb, var(--ravin-primary) 8%, var(--ravin-bg))',
          borderColor: 'var(--ravin-border-strong)',
        },
        '&:focus-visible': {
          outline: '2px solid var(--ravin-primary)',
          outlineOffset: '2px',
        },
      }}
    >
      <Stack direction="row" justifyContent="space-between" alignItems="flex-start">
        <Typography
          variant="h2"
          sx={{
            fontSize: '1rem',
            fontWeight: 600,
            color: 'var(--ravin-text)',
            lineHeight: 1.3,
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
            maxWidth: 'calc(100% - 40px)',
          }}
        >
          {workspace.name}
        </Typography>
        <Box onClick={(e) => e.stopPropagation()} sx={{ flexShrink: 0 }}>
          <Security needs={[EXPLORE]}>
            <IconButton
              onClick={handleClick}
              title={t_i18n('Open dashboard')}
            >
              <KeyboardArrowRightOutlined fontSize="small" />
            </IconButton>
          </Security>
        </Box>
      </Stack>

      {description && (
        <Typography
          sx={{
            fontSize: '0.8125rem',
            color: 'var(--ravin-text-muted)',
            lineHeight: 1.5,
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden',
            flex: 1,
          }}
        >
          {description}
        </Typography>
      )}

      {tags.length > 0 && (
        <Stack direction="row" gap={0.5} sx={{ flexWrap: 'nowrap', overflow: 'hidden' }}>
          {tags.slice(0, 3).map((tag) => (
            <Chip
              key={tag}
              label={tag}
              size="small"
              sx={{
                fontSize: '0.6875rem',
                height: 22,
                borderRadius: '4px',
                backgroundColor: 'var(--ravin-surface-2)',
                color: 'var(--ravin-text)',
                ...lowercaseVoiceSx,
                '& .MuiChip-label': { padding: '0 8px' },
              }}
            />
          ))}
          {tags.length > 3 && (
            <Tooltip title={tags.slice(3).join(', ')}>
              <Chip
                label={`+${tags.length - 3}`}
                size="small"
                sx={{
                  fontSize: '0.6875rem',
                  height: 22,
                  borderRadius: '4px',
                  backgroundColor: 'var(--ravin-surface-2)',
                  color: 'var(--ravin-text)',
                  ...lowercaseVoiceSx,
                  '& .MuiChip-label': { padding: '0 8px' },
                }}
              />
            </Tooltip>
          )}
        </Stack>
      )}

      <Stack
        direction="row"
        justifyContent="space-between"
        alignItems="center"
        sx={{
          marginTop: 'auto',
          paddingTop: '8px',
          borderTop: '1px solid var(--ravin-border)',
        }}
      >
        <Typography
          sx={{
            fontSize: '0.75rem',
            color: 'var(--ravin-text-muted)',
          }}
        >
          {workspace.owner?.name ?? '—'}
        </Typography>
        <Tooltip title={fd(workspace.updated_at)}>
          <Typography
            sx={{
              fontSize: '0.75rem',
              color: 'var(--ravin-text-muted)',
            }}
          >
            {rd(workspace.updated_at)}
          </Typography>
        </Tooltip>
      </Stack>
    </Box>
  );
};

const DashboardCardSkeleton = () => (
  <Box
    sx={{
      backgroundColor: 'var(--ravin-bg)',
      border: '1px solid var(--ravin-border)',
      borderRadius: '8px',
      padding: '16px',
      minHeight: '180px',
      display: 'flex',
      flexDirection: 'column',
      gap: '12px',
    }}
  >
    <Skeleton variant="text" width="60%" height={24} />
    <Skeleton variant="text" width="90%" height={20} />
    <Skeleton variant="text" width="80%" height={20} />
    <Box sx={{ marginTop: 'auto', paddingTop: '8px' }}>
      <Stack direction="row" justifyContent="space-between">
        <Skeleton variant="text" width={80} height={16} />
        <Skeleton variant="text" width={60} height={16} />
      </Stack>
    </Box>
  </Box>
);

const EmptyState = ({ paginationOptions }: { paginationOptions: WorkspacesLinesPaginationQuery$variables }) => {
  const { t_i18n } = useFormatter();
  return (
    <Stack
      alignItems="center"
      justifyContent="center"
      spacing={2}
      sx={{
        padding: '80px 24px',
        textAlign: 'center',
      }}
    >
      <Box
        sx={{
          width: 48,
          height: 48,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          borderRadius: '4px',
          backgroundColor: 'var(--ravin-surface-2)',
          color: 'var(--ravin-text-muted)',
        }}
      >
        <LayoutDashboard size={24} />
      </Box>
      <Typography
        sx={{
          fontSize: '0.9375rem',
          fontWeight: 600,
          color: 'var(--ravin-text)',
          ...lowercaseVoiceSx,
        }}
      >
        {t_i18n('No custom dashboards')}
      </Typography>
      <Typography
        sx={{
          fontSize: '0.8125rem',
          color: 'var(--ravin-text-muted)',
          maxWidth: '400px',
          lineHeight: 1.5,
          ...lowercaseVoiceSx,
        }}
      >
        {t_i18n('Create your first dashboard to visualize threat intelligence data')}
      </Typography>
      <Security needs={[EXPLORE_EXUPDATE]}>
        <WorkspaceCreation
          paginationOptions={paginationOptions}
          type="dashboard"
        />
      </Security>
    </Stack>
  );
};

const GridView = ({
  queryRef,
  paginationOptions,
}: {
  queryRef: PreloadedQuery<WorkspacesLinesPaginationQuery>;
  paginationOptions: WorkspacesLinesPaginationQuery$variables;
}) => {
  const { t_i18n } = useFormatter();
  const queryData = usePreloadedQuery(workspacesLinesQuery, queryRef);
  const { data, hasNext, isLoadingNext, loadNext } = usePaginationFragment(workspacesLineFragment, queryData);

  const edges = (data as WorkspacesLines_data$data)?.workspaces?.edges ?? [];
  const nodes = edges
    .map((n) => n?.node)
    .filter((n): n is NonNullable<typeof n> => n !== null);

  if (nodes.length === 0) {
    return <EmptyState paginationOptions={paginationOptions} />;
  }

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        gap: '16px',
        padding: '8px 0',
      }}
    >
      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
          gap: '16px',
        }}
      >
        {nodes.map((node) => (
          <DashboardCard
            key={node.id}
            workspace={node as unknown as WorkspacesLine_node$data}
            paginationOptions={paginationOptions}
          />
        ))}
      </Box>
      {hasNext && (
        <Stack alignItems="center" sx={{ py: 2 }}>
          <Button
            variant="secondary"
            onClick={() => loadNext(25)}
            disabled={isLoadingNext}
          >
            {isLoadingNext ? t_i18n('Loading...') : t_i18n('Load more')}
          </Button>
        </Stack>
      )}
    </Box>
  );
};

const GridViewSkeleton = () => (
  <Box
    sx={{
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
      gap: '16px',
      padding: '8px 0',
    }}
  >
    {Array.from({ length: 6 }).map((_, i) => (
      <DashboardCardSkeleton key={i} />
    ))}
  </Box>
);

const CustomDashboards = () => {
  const { t_i18n } = useFormatter();
  const { setTitle } = useConnectedDocumentModifier();
  setTitle(t_i18n('Custom dashboards | Dashboards'));

  const [viewMode, setViewMode] = useState<ViewMode>(() => {
    try {
      return (localStorage.getItem(VIEW_MODE_KEY) as ViewMode) || 'table';
    } catch {
      return 'table';
    }
  });

  const handleViewModeChange = (_: React.MouseEvent, value: ViewMode | null) => {
    if (value) {
      setViewMode(value);
      try {
        localStorage.setItem(VIEW_MODE_KEY, value);
      } catch {
        // ignore storage errors
      }
    }
  };

  const {
    viewStorage,
    paginationOptions,
    helpers: storageHelpers,
  } = usePaginationLocalStorage<WorkspacesLinesPaginationQuery$variables>(
    LOCAL_STORAGE_KEY,
    initialStorageValues,
  );

  const { handleSearch } = storageHelpers;
  const searchTimerRef = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  const handleGridSearch = useCallback((value: string) => {
    if (searchTimerRef.current) {
      clearTimeout(searchTimerRef.current);
    }
    searchTimerRef.current = setTimeout(() => {
      handleSearch(value);
    }, 300);
  }, [handleSearch]);

  useEffect(() => () => {
    if (searchTimerRef.current) {
      clearTimeout(searchTimerRef.current);
    }
  }, []);

  const filters = useBuildEntityTypeBasedFilterContext(
    'Workspace',
    {
      mode: 'and',
      filters: [{
        key: 'type',
        values: ['dashboard'],
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

  const dataColumns: DataTableProps['dataColumns'] = useMemo(() => ({
    name: {
      id: 'name',
      percentWidth: 33,
    },
    tags: {
      id: 'tags',
    },
    creator: {
      id: 'creator',
      isSortable: true,
      render: ({ owner }) => defaultRender(owner?.name),
    },
    created_at: {
      id: 'created_at',
      percentWidth: 16,
    },
    updated_at: {
      id: 'updated_at',
      percentWidth: 16,
    },
    isShared: {
      id: 'isShared',
    },
  }), []);

  return (
    <>
      <Breadcrumbs
        elements={[
          { label: t_i18n('Dashboards') },
          { label: t_i18n('Custom dashboards'), current: true },
        ]}
      />

      <Box sx={{ padding: '24px 24px 24px 24px' }}>

      <Stack
        direction="row"
        justifyContent="space-between"
        alignItems="center"
        flexWrap="wrap"
        gap={2}
      >
        <Box>
          <Typography
            variant="h1"
            sx={{
              fontSize: '22px',
              fontWeight: 600,
              color: 'var(--ravin-text)',
              lineHeight: 1.3,
              ...lowercaseVoiceSx,
            }}
          >
            {t_i18n('Custom dashboards')}
          </Typography>
          <Typography
            sx={{
              fontSize: '0.8125rem',
              color: 'var(--ravin-text-muted)',
              marginTop: '4px',
              ...lowercaseVoiceSx,
            }}
          >
            {t_i18n('Build and manage visual dashboards for threat intelligence analysis')}
          </Typography>
        </Box>

        <Stack direction="row" gap={1} alignItems="center">
          <ToggleButtonGroup
            value={viewMode}
            exclusive
            onChange={handleViewModeChange}
            size="small"
            sx={{
              '& .MuiToggleButton-root': {
                border: '1px solid var(--ravin-border-strong)',
                borderRadius: '4px',
                color: 'var(--ravin-text-muted)',
                padding: '8px 12px',
                minHeight: 36,
                '&.Mui-selected': {
                  backgroundColor: 'color-mix(in srgb, var(--ravin-primary) 25%, transparent)',
                  color: 'var(--ravin-text)',
                  borderColor: 'var(--ravin-border-strong)',
                },
                '&:hover': {
                  backgroundColor: 'color-mix(in srgb, var(--ravin-primary) 15%, transparent)',
                },
                '&.Mui-selected:hover': {
                  backgroundColor: 'color-mix(in srgb, var(--ravin-primary) 25%, transparent)',
                },
              },
            }}
          >
            <ToggleButton value="table" aria-label={t_i18n('Table view')}>
              <TableIcon size={16} />
            </ToggleButton>
            <ToggleButton value="grid" aria-label={t_i18n('Grid view')}>
              <LayoutDashboard size={16} />
            </ToggleButton>
          </ToggleButtonGroup>

          <Security needs={[EXPLORE_EXUPDATE]}>
            <WorkspaceCreation
              paginationOptions={workspacePaginationOptions}
              type="dashboard"
            />
          </Security>
        </Stack>
      </Stack>

      {viewMode === 'table' && queryRef && (
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
          taskScope="DASHBOARD"
          actions={(row) => (
            <Security needs={[EXPLORE]}>
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

      {viewMode === 'grid' && (
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <TextField
            placeholder={t_i18n('Search dashboards...')}
            defaultValue={viewStorage.searchTerm ?? ''}
            onChange={(e) => handleGridSearch(e.target.value)}
            size="small"
            aria-label={t_i18n('Search dashboards')}
            sx={{
              maxWidth: 400,
              '& .MuiOutlinedInput-root': {
                backgroundColor: 'var(--ravin-elevated)',
                borderRadius: '4px',
              },
            }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Search size={16} style={{ color: 'var(--ravin-text-muted)' }} />
                </InputAdornment>
              ),
            }}
          />
          <Suspense fallback={<GridViewSkeleton />}>
            {queryRef && (
              <GridView
                queryRef={queryRef}
                paginationOptions={workspacePaginationOptions}
              />
            )}
          </Suspense>
        </Box>
      )}
      </Box>
    </>
  );
};

export default CustomDashboards;
