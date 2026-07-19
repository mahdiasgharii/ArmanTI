import React, { CSSProperties, FunctionComponent, useMemo, useRef, useState } from 'react';
import Checkbox from '@mui/material/Checkbox';
import { GripVertical as DragIndicatorOutlined, ArrowUpNarrowWide, ArrowDownWideNarrow, Filter } from 'lucide-react';
import Menu from '@mui/material/Menu';
import { DragDropContext, Draggable, DraggableLocation, Droppable } from '@hello-pangea/dnd';
import MenuItem from '@mui/material/MenuItem';
import { PopoverProps } from '@mui/material/Popover/Popover';
import Box from '@mui/material/Box';
import Divider from '@mui/material/Divider';
import { UNKNOWN_ENTITIES_LOCAL_STORAGE_KEY } from '@components/SearchBulkUnknownEntities';
import { DataTableColumn, DataTableColumns, DataTableHeadersProps } from '../dataTableTypes';
import DataTableHeader, { SELECT_COLUMN_SIZE } from './DataTableHeader';
import { useDataTableContext } from './DataTableContext';

const DataTableHeaders: FunctionComponent<DataTableHeadersProps> = ({
  dataTableToolBarComponent,
}) => {
  const {
    columns,
    setColumns,
    useDataTableToggle: {
      selectAll,
      numberOfSelectedElements,
      handleToggleSelectAll,
    },
    formatter: { t_i18n },
    availableFilterKeys,
    onAddFilter,
    onSort,
    disableToolBar,
    removeSelectAll,
    startsWithAction,
    startsWithIcon,
    endsWithAction,
    actionsColumnWidth,
    startColumnWidth,
    useDataTablePaginationLocalStorage: {
      viewStorage: { sortBy, orderAsc },
    },
    storageKey,
  } = useDataTableContext();
  const containerRef = useRef<HTMLDivElement | null>(null);

  const [activeColumn, setActiveColumn] = useState<DataTableColumn | undefined>();
  const [anchorEl, setAnchorEl] = useState<PopoverProps['anchorEl']>(null);
  const handleClose = () => {
    setAnchorEl(null);
    setActiveColumn(undefined);
  };

  const handleToggleVisibility = (columnId: string) => {
    const newColumns = [...columns];
    const currentColumn = newColumns.find(({ id }) => id === columnId);
    if (!currentColumn) {
      return;
    }
    currentColumn.visible = currentColumn.visible ?? true;
    setColumns(newColumns);
  };

  const draggableColumns = useMemo(() => columns.filter(({ id }) => !['select', 'navigate', 'icon'].includes(id)), [columns]);

  const hasSelectedElements = numberOfSelectedElements > 0 || selectAll;
  const checkboxStyle: CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    height: '100%',
    paddingLeft: '8px',
    flex: '0 0 auto',
    background: hasSelectedElements && !removeSelectAll
      ? 'color-mix(in srgb, var(--ravin-primary) 10%, var(--ravin-elevated))'
      : 'transparent',
    minWidth: startColumnWidth,
  };

  const showToolbar = (numberOfSelectedElements > 0 && !disableToolBar)
    || (storageKey === UNKNOWN_ENTITIES_LOCAL_STORAGE_KEY && selectAll); // case of DataTableWithoutFragment

  return (
    <div ref={containerRef} style={{ display: 'flex', height: 42, alignItems: 'center', borderBottom: '1px solid var(--ravin-border)', width: '100%' }}>
      {(startsWithAction || startsWithIcon) && (
        <div data-testid="dataTableCheckAll" style={checkboxStyle}>
          {(startsWithAction && !removeSelectAll) && (
            <Checkbox
              checked={selectAll}
              sx={{
                marginRight: 1,
                flex: '0 0 auto',
              }}
              onChange={handleToggleSelectAll}
              disabled={!handleToggleSelectAll}
            />
          )}
          {startsWithIcon && (
            <Box sx={{
              marginRight: 1,
              flex: '0 0 auto',
              paddingLeft: 0,
            }}
            />
          ) }
        </div>
      )}

      {showToolbar ? dataTableToolBarComponent : (
        <>
          {anchorEl && (
            <Menu
              anchorEl={anchorEl}
              open={Boolean(anchorEl)}
              onClose={handleClose}
              PaperProps={{
                className: 'ravin-column-menu-paper',
                sx: {
                  '& .MuiMenuItem-root': {
                    fontFamily: '"Peyda", sans-serif',
                    fontSize: '13px',
                    color: 'var(--ravin-text)',
                    borderRadius: '4px',
                    padding: '8px 12px',
                    minHeight: '36px',
                    margin: '2px 4px',
                    transition: 'background-color 100ms ease',
                    '&:hover': {
                      backgroundColor: 'color-mix(in srgb, var(--ravin-primary) 12%, transparent)',
                    },
                  },
                  '& .MuiDivider-root': {
                    borderColor: 'var(--ravin-border)',
                  },
                },
              }}
              MenuListProps={{
                className: 'ravin-column-menu-list',
                sx: {
                  padding: '4px',
                  fontFamily: '"Peyda", sans-serif',
                },
              }}
            >
              {columns.some(({ id }) => id === 'todo-navigate') && (
                <DragDropContext
                  key={(new Date()).toString()}
                  onDragEnd={({ source, destination }) => {
                    const result = Array.from(draggableColumns);
                    const [removed] = result.splice(source.index, 1);
                    result.splice((destination as DraggableLocation).index, 0, removed);

                    const newColumns: DataTableColumns = [
                      columns.at(0),
                      ...(result.map((c, index) => {
                        const currentColumn = columns.find(({ id }) => id === c.id);
                        return ({ ...currentColumn, order: index });
                      })),
                      columns.at(-1),
                    ] as DataTableColumns;

                    setColumns(newColumns);
                  }}
                >
                  <Droppable droppableId="droppable-list">
                    {(provided) => (
                      <div ref={provided.innerRef} {...provided.droppableProps}>
                        {draggableColumns.map((c, index) => (
                          <Draggable
                            key={index}
                            draggableId={c.id}
                            index={index}
                          >
                            {(item) => (
                              <MenuItem
                                ref={item.innerRef}
                                {...item.draggableProps}
                                {...item.dragHandleProps}
                                sx={{ gap: 1 }}
                              >
                                <DragIndicatorOutlined size={14} color="var(--ravin-text-muted)" />
                                <Checkbox
                                  onClick={() => handleToggleVisibility(c.id)}
                                  checked={c.visible}
                                  size="small"
                                />
                                {c.label}
                              </MenuItem>
                            )}
                          </Draggable>
                        ))}
                        {provided.placeholder}
                      </div>
                    )}
                  </Droppable>
                </DragDropContext>
              )}
              {activeColumn?.isSortable && (<Divider sx={{ borderColor: 'var(--ravin-border)', margin: '4px 8px' }} />)}
              {activeColumn?.isSortable && (
                <MenuItem
                  onClick={() => onSort(activeColumn.id, true)}
                  sx={{ gap: 1.5 }}
                >
                  <ArrowUpNarrowWide size={14} color="var(--ravin-text-muted)" />
                  {t_i18n('Sort Asc')}
                </MenuItem>
              )}
              {activeColumn?.isSortable && (
                <MenuItem
                  onClick={() => onSort(activeColumn.id, false)}
                  sx={{ gap: 1.5 }}
                >
                  <ArrowDownWideNarrow size={14} color="var(--ravin-text-muted)" />
                  {t_i18n('Sort Desc')}
                </MenuItem>
              )}
              {(activeColumn && availableFilterKeys?.includes(activeColumn.id)) && (
                <MenuItem
                  onClick={() => {
                    onAddFilter(activeColumn.id);
                    handleClose();
                  }}
                  sx={{ gap: 1.5 }}
                >
                  <Filter size={14} color="var(--ravin-text-muted)" />
                  {t_i18n('Add filtering')}
                </MenuItem>
              )}
            </Menu>
          )}

          {columns
            .filter(({ id }) => !['select', 'navigate', 'icon'].includes(id))
            .map((column) => (
              <DataTableHeader
                key={column.id}
                column={column}
                setAnchorEl={setAnchorEl}
                isActive={activeColumn?.id === column.id}
                setActiveColumn={setActiveColumn}
                containerRef={containerRef}
                sortBy={sortBy === column.id}
                orderAsc={!!orderAsc}
              />
            ))}

          {(endsWithAction) && <div style={{ width: actionsColumnWidth ?? SELECT_COLUMN_SIZE, flex: '0 0 auto', paddingLeft: 8, paddingRight: 8 }} />}
        </>
      )}
    </div>
  );
};

export default DataTableHeaders;
