import React, { FunctionComponent, MouseEvent, RefObject, useRef } from 'react';
import { ChevronDown, ChevronUp, ChevronsUpDown, MoreVertical } from 'lucide-react';
import IconButton from '@common/button/IconButton';
import SimpleDraggrable from 'react-draggable';
import makeStyles from '@mui/styles/makeStyles';
import { createStyles } from '@mui/styles';
import { Theme as MuiTheme } from '@mui/material/styles/createTheme';
import Tooltip from '@mui/material/Tooltip';
import { DataTableColumn, DataTableHeaderProps, DataTableVariant } from '../dataTableTypes';
import { useDataTableContext } from './DataTableContext';

export const SELECT_COLUMN_SIZE = 42;
export const ICON_COLUMN_SIZE = 56;

// Deprecated - https://mui.com/system/styles/basics/
// Do not use it for new code.
const useStyles = makeStyles<MuiTheme, { column: DataTableColumn }>((theme) => createStyles({
  headerContainer: {
    flex: '1 1 auto',
    position: 'relative',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderRight: '1px solid var(--ravin-border)',
    '&:last-of-type': {
      borderRight: 'none',
    },
    '&:hover': {
      '& $icon': {
        visibility: 'visible',
      },
    },
  },
  label: {
    paddingLeft: theme.spacing(1),
    paddingRight: theme.spacing(1),
    display: 'flex',
    alignItems: 'center',
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    fontSize: '12px',
    fontWeight: 600,
    fontFamily: '"Peyda", sans-serif',
    color: 'var(--ravin-text)',
    flexGrow: 1,
    cursor: ({ column: { isSortable } }) => (isSortable ? 'pointer' : 'unset'),
  },
  draggable: {
    position: 'absolute',
    top: '50%',
    transform: 'translateY(-50%)',
    right: 0,
    height: theme.spacing(5),
    width: 2,
    backgroundClip: 'content-box',
    borderRadius: 1,
    cursor: 'col-resize',
    backgroundColor: 'transparent',
    transition: 'background-color 0.15s ease',
  },
  icon: {
    visibility: 'hidden',
  },
}));

const DataTableHeader: FunctionComponent<DataTableHeaderProps> = ({
  column,
  setAnchorEl,
  isActive,
  setActiveColumn,
  containerRef,
  sortBy,
  orderAsc,
}) => {
  const draggableRef = useRef<HTMLDivElement>(null);
  const classes = useStyles({ column });

  const {
    columns,
    setColumns,
    availableFilterKeys,
    onSort,
    disableColumnMenu,
    variant,
    formatter: { t_i18n },
    tableWidthState: [tableWidth],
  } = useDataTableContext();

  // To avoid spamming sorting (and calling API)
  const throttleSortColumn = (e: MouseEvent) => {
    const el = e.target as HTMLDivElement;
    el.style.setProperty('pointer-events', 'none');
    setTimeout(() => el.style.setProperty('pointer-events', 'auto'), 800);
    if (column.isSortable) onSort(column.id, !orderAsc);
  };

  const openColumnMenu = (e: MouseEvent) => {
    setActiveColumn(column);
    setAnchorEl(e.currentTarget);
  };

  const hasColumnMenu = !disableColumnMenu && (column.isSortable || (availableFilterKeys ?? []).includes(column.id));
  const cellWidth = Math.round(tableWidth * (column.percentWidth / 100));

  return (
    <div
      key={column.id}
      className={classes.headerContainer}
      style={{ width: cellWidth }}
    >
      <div className={classes.label} onClick={throttleSortColumn}>
        <Tooltip title={t_i18n(column.label)}>
          <span>{t_i18n(column.label)}</span>
        </Tooltip>
        {column.isSortable && (sortBy
          ? (orderAsc
              ? <ChevronUp size={12} color="var(--ravin-primary)" />
              : <ChevronDown size={12} color="var(--ravin-primary)" />)
          : <ChevronsUpDown size={11} color="var(--ravin-text-muted)" style={{ opacity: 0.5 }} />)}
      </div>

      {hasColumnMenu && (
        <IconButton
          disableRipple
          className={classes.icon}
          onClick={openColumnMenu}
          style={{
            visibility: isActive ? 'visible' : undefined,
          }}
          sx={{
            marginRight: 1,
            width: 24,
            '&:hover': {
              background: 'transparent',
            },
          }}
        >
          <MoreVertical size={16} />
        </IconButton>
      )}

      <div style={{ flex: '0 0 auto' }} />

      {variant !== DataTableVariant.inline && variant !== DataTableVariant.widget && (
        <SimpleDraggrable
          nodeRef={draggableRef as unknown as RefObject<HTMLDivElement>}
          position={{ x: 0, y: 0 }}
          axis="x"
          onStop={(_, { lastX }) => {
            if (containerRef?.current) {
              // Compute new width in percentage of the column.
              const containerWidth = containerRef.current.clientWidth;
              const columnWidth = (column.percentWidth * containerWidth) / 100;
              const newColumnWidth = columnWidth + lastX;
              const newPercentage = (newColumnWidth / containerWidth) * 100;
              if (newPercentage < 0) return;

              // Override the new percent width.
              let newColumns = columns.map((c) => {
                if (c.id === column.id) return { ...c, percentWidth: newPercentage };
                return c;
              });

              // Total width should be at least 100% so extend neighbor column if necessary.
              const sumPercentage = newColumns.reduce((acc, col) => acc + (col.percentWidth ?? 0), 0);
              if (sumPercentage < 100) {
                const maxOrder = Math.max(...newColumns.flatMap((c) => c.order ?? []));
                const neighborOrder = column.order < maxOrder ? column.order + 1 : column.order - 1;
                newColumns = newColumns.map((c) => {
                  if (c.order === neighborOrder) {
                    const percentWidth = c.percentWidth + (100 - sumPercentage);
                    return { ...c, percentWidth };
                  }
                  return c;
                });
              }

              setColumns(newColumns);
            }
          }}
        >
          <div ref={draggableRef} className={classes.draggable} />
        </SimpleDraggrable>
      )}
    </div>
  );
};

export default DataTableHeader;
