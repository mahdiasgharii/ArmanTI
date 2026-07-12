import { useState } from 'react';
import { useFormatter } from '../../../../../components/i18n';
import { IconButton, Menu, MenuItem } from '@mui/material';
import { Plus as Add } from 'lucide-react';
import { FormikHelpers, useFormikContext } from 'formik';
import { WorkflowEditionFormValues } from './WorkflowEditionDrawer';

interface ActionMenuButtonProps {
  onAddObject: (
    type: string,
    actionName: string,
    setFieldValue: FormikHelpers<WorkflowEditionFormValues>['setFieldValue'],
    values: WorkflowEditionFormValues,
  ) => void;
  type: string;
}

const ActionMenuButton = ({ onAddObject, type }: ActionMenuButtonProps) => {
  const { t_i18n } = useFormatter();
  const { values, setFieldValue } = useFormikContext<WorkflowEditionFormValues>();

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  const onClickItem = (actionName: string) => {
    onAddObject(type, actionName, setFieldValue, values);
    handleClose();
  };

  return (
    <div>
      <IconButton
        style={{ color: 'var(--mui-palette-secondary-main)' }}
        aria-label="Add"
        onClick={handleClick}
      >
        <Add size={16} />
      </IconButton>
      <Menu
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
      >
        <MenuItem onClick={() => onClickItem('updateAuthorizedMembers')}>{t_i18n('Update authorized members')}</MenuItem>
        <MenuItem onClick={() => onClickItem('validateDraft')}>{t_i18n('Validate draft')}</MenuItem>
      </Menu>
    </div>
  );
};

export default ActionMenuButton;
