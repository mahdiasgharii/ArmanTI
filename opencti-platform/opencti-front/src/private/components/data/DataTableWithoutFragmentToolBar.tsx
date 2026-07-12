import React, { useState } from 'react';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Tooltip from '@mui/material/Tooltip';
import IconButton from '@common/button/IconButton';
import { SquarePlus as AddBoxOutlined, X as ClearOutlined } from 'lucide-react';
import ImportFilesDialog from '../common/files/import_files/ImportFilesDialog';
import { useFormatter } from '../../../components/i18n';

interface DataTableWithoutFragmentToolBarProps {
  taskScope: string;
  selectedValues: string[];
  handleClearSelectedElements: () => void;
}

const DataTableWithoutFragmentToolBar = ({
  taskScope,
  selectedValues,
  handleClearSelectedElements,
}: DataTableWithoutFragmentToolBarProps) => {
  const { t_i18n } = useFormatter();
  const [unknownValues, setUnkownValues] = useState<string[]>([]);
  const handleLaunchCreateUnknownEntities = () => {
    setUnkownValues(selectedValues);
  };
  const handleCloseCreateUnknownEntities = () => {
    setUnkownValues([]);
  };
  const numberOfElements = selectedValues.length;
  return (
    <>
      <Toolbar style={{ minHeight: 40, display: 'flex', justifyContent: 'space-between', height: '100%', paddingRight: 12, paddingLeft: 8 }} data-testid="opencti-toolbar">
        <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
          <Typography
            style={{
              flex: '1 1 100%',
              fontSize: '12px',
              marginBottom: '1px',
            }}
            style={{ color: 'currentColor' }}
            variant="subtitle1"
          >
            <strong>{numberOfElements}</strong> {t_i18n('selected')}{' '}
          </Typography>
          <IconButton
            aria-label="clear"
            disabled={numberOfElements === 0}
            onClick={handleClearSelectedElements}
            size="small"
            style={{ color: 'var(--mui-palette-primary-main)' }}
          >
            <ClearOutlined size={16} />
          </IconButton>
        </div>
        {taskScope === 'UNKNOWN_ENTITIES'
          && (
            <Tooltip title={t_i18n('Create unknown entities')}>
              <span>
                <IconButton
                  aria-label={t_i18n('Create unknown entities')}
                  disabled={numberOfElements === 0}
                  onClick={handleLaunchCreateUnknownEntities}
                  style={{ color: 'var(--mui-palette-primary-main)' }}
                  size="small"
                >
                  <AddBoxOutlined size={16} />
                </IconButton>
              </span>
            </Tooltip>
          )
        }
      </Toolbar>
      <ImportFilesDialog
        open={unknownValues.length > 0}
        handleClose={handleCloseCreateUnknownEntities}
        initialFreeTextContent={(unknownValues ?? []).join('\n')}
      />
    </>
  );
};

export default DataTableWithoutFragmentToolBar;
