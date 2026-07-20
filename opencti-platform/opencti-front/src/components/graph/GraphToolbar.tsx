import Drawer from '@mui/material/Drawer';
import React, { useEffect, useState } from 'react';
import Divider from '@mui/material/Divider';
import { useTheme } from '@mui/material/styles';
import LinearProgress from '@mui/material/LinearProgress';
import useGraphInteractions from './utils/useGraphInteractions';
import SearchInput from '../SearchInput';
import type { Theme } from '../Theme';
import GraphToolbarDisplayTools, { GraphToolbarDisplayToolsProps } from './components/GraphToolbarDisplayTools';
import GraphToolbarSelectTools from './components/GraphToolbarSelectTools';
import GraphToolbarFilterTools from './components/GraphToolbarFilterTools';
import GraphToolbarContentTools, { GraphToolbarContentToolsProps } from './components/GraphToolbarContentTools';
import GraphToolbarTimeRange from './components/GraphToolbarTimeRange';
import { useGraphContext } from './GraphContext';
import GraphToolbarCorrelationTools from './components/GraphToolbarCorrelationTools';
import GraphToolbarExpandTools, { GraphToolbarExpandToolsProps } from './components/GraphToolbarExpandTools';
import useAuth from '../../utils/hooks/useAuth';
import { OPEN_BAR_WIDTH, SMALL_BAR_WIDTH } from '@components/nav/LeftBar';
import useDraftContext, { DRAFT_TOOLBAR_HEIGHT } from '../../utils/hooks/useDraftContext';
import { MESSAGING$ } from '../../relay/environment';

// The LeftBar drawer reserves `width + 4` of horizontal space (see LeftBar `drawerWidth`).
// The toolbar must clear that full width, otherwise its content slips under the sidebar.
const LEFT_BAR_OFFSET = 4;

export type GraphToolbarProps = GraphToolbarContentToolsProps
& GraphToolbarExpandToolsProps
& GraphToolbarDisplayToolsProps
& {
  /**
   * When true, the toolbar renders as an in-flow element (a plain container)
   * instead of a viewport-fixed bottom Drawer. Used by the investigation page
   * so the toolbar lives inside its own section within the content frame
   * rather than overlaying the whole viewport.
   */
  inline?: boolean;
};

const GraphToolbar = ({
  onInvestigationExpand,
  onInvestigationRollback,
  onUnfixNodes,
  inline = false,
  ...props
}: GraphToolbarProps) => {
  const theme = useTheme<Theme>();
  const draftContext = useDraftContext();
  const { bannerSettings: { bannerHeightNumber } } = useAuth();
  const [navOpen, setNavOpen] = useState(
    localStorage.getItem('navOpen') === 'true',
  );
  const { selectBySearch } = useGraphInteractions();

  // Keep the sidebar offset in sync when the user collapses/expands the LeftBar,
  // matching the convention used by the other bottom toolbars (e.g. TopBar,
  // ContainertKnowledgeTimeLineBar). Reading localStorage only at render left the
  // padding stale, causing the toolbar to slide under the sidebar after a toggle.
  useEffect(() => {
    const sub = MESSAGING$.toggleNav.subscribe({
      next: () => setNavOpen(localStorage.getItem('navOpen') === 'true'),
    });
    return () => {
      sub.unsubscribe();
    };
  }, []);

  const posBottom = draftContext ? DRAFT_TOOLBAR_HEIGHT : 0;

  const {
    graphState: {
      showTimeRange,
      showLinearProgress,
      loadingCurrent,
      loadingTotal,
      search,
    },
    context,
  } = useGraphContext();

  const isLoadingData = (loadingCurrent ?? 0) < (loadingTotal ?? 0);

  const toolbarContent = (
    <>
      <LinearProgress
        sx={{
          width: '100%',
          height: 2,
          position: 'absolute',
          top: -1,
          visibility: showLinearProgress || isLoadingData ? 'visible' : 'hidden',
          backgroundColor: 'var(--ravin-surface-2)',
          '& .MuiLinearProgress-bar': {
            backgroundColor: 'var(--ravin-primary)',
          },
        }}
      />
      <div
        className="hide-scrollbar"
        style={{
          height: 54,
          flex: '0 0 auto',
          display: 'flex',
          alignItems: 'center',
          gap: theme.spacing(0.5),
          padding: `0 ${theme.spacing(2)}`,
          overflowX: 'scroll',
          overflowY: 'hidden',
        }}
      >
        <GraphToolbarDisplayTools onUnfixNodes={onUnfixNodes} />
        <Divider sx={{ margin: 1, height: '80%', borderColor: 'var(--ravin-border)' }} orientation="vertical" />

        <GraphToolbarSelectTools />
        <Divider sx={{ margin: 1, height: '80%', borderColor: 'var(--ravin-border)' }} orientation="vertical" />

        <GraphToolbarFilterTools />
        <Divider sx={{ margin: 1, height: '80%', borderColor: 'var(--ravin-border)' }} orientation="vertical" />

        {context === 'correlation' && (
          <>
            <GraphToolbarCorrelationTools />
            <Divider sx={{ margin: 1, marginRight: 2, height: '80%', borderColor: 'var(--ravin-border)' }} orientation="vertical" />
          </>
        )}

        <div style={{ flex: 1 }}>
          {context !== 'analyses' && (
            <SearchInput
              keyword={search ?? ''}
              variant="thin"
              onSubmit={selectBySearch}
            />
          )}
        </div>

        {context === 'investigation' && (
          <>
            <Divider sx={{ margin: 1, height: '80%', borderColor: 'var(--ravin-border)' }} orientation="vertical" />
            <GraphToolbarExpandTools
              onInvestigationExpand={onInvestigationExpand}
              onInvestigationRollback={onInvestigationRollback}
            />
            <Divider sx={{ margin: 1, height: '80%', borderColor: 'var(--ravin-border)' }} orientation="vertical" />
          </>
        )}

        {context !== 'analyses' && <GraphToolbarContentTools {...props} />}
      </div>

      <GraphToolbarTimeRange />
    </>
  );

  // Investigation pages embed the toolbar inside a dedicated card section
  // within the content frame, so it must not be a viewport-fixed drawer.
  // The parent section provides the card styling (border, radius, background).
  if (inline) {
    return (
      <div
        style={{
          position: 'relative',
          height: showTimeRange ? 134 : 54,
          overflow: 'hidden',
          transition: 'height 0.2s ease',
        }}
      >
        {toolbarContent}
      </div>
    );
  }

  return (
    <Drawer
      anchor="bottom"
      variant="permanent"
      PaperProps={{
        elevation: 0,
        style: {
          zIndex: 1,
          left: 0,
          right: 'var(--right-menu-width, 0px)',
          paddingLeft: (navOpen ? OPEN_BAR_WIDTH : SMALL_BAR_WIDTH) + LEFT_BAR_OFFSET,
          height: showTimeRange ? 134 : 54,
          overflow: 'hidden',
          backgroundColor: 'var(--ravin-elevated)',
          borderTop: '1px solid var(--ravin-border)',
          boxShadow: 'none',
          transition: 'height 0.2s ease, right 250ms cubic-bezier(0.25, 1, 0.5, 1)',
          marginBottom: bannerHeightNumber,
          bottom: posBottom,
        },
      }}
    >
      {toolbarContent}
    </Drawer>
  );
};

export default GraphToolbar;
