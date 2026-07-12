import { Pencil as Edit } from 'lucide-react';
import IconButton from '@common/button/IconButton';
import React, { FunctionComponent, useState } from 'react';
import RequestAccessConfigurationEdition from '@components/settings/sub_types/global_workflow_request_access/RequestAccessConfigurationEdition';
import { RequestAccessConfigurationEdition_requestAccess$key } from './__generated__/RequestAccessConfigurationEdition_requestAccess.graphql';

interface RequestAccessWorkflowEditionProps {
  data: RequestAccessConfigurationEdition_requestAccess$key;
  requestAccessWorkflowDisabled: boolean;
}
const RequestAccessConfigurationPopover: FunctionComponent<RequestAccessWorkflowEditionProps> = ({
  data,
  requestAccessWorkflowDisabled,
}) => {
  const [displayUpdate, setDisplayUpdate] = useState<boolean>(false);
  const handleOpenUpdate = () => setDisplayUpdate(true);
  const handleCloseUpdate = () => setDisplayUpdate(false);
  return (
    <>
      <IconButton
        style={{ color: 'var(--mui-palette-primary-main)' }}
        aria-label="Workflow"
        aria-haspopup="true"
        onClick={handleOpenUpdate}
        disabled={requestAccessWorkflowDisabled}
      >
        <Edit size={16} />
      </IconButton>

      <RequestAccessConfigurationEdition
        data={data}
        handleClose={handleCloseUpdate}
        open={displayUpdate}
      />
    </>
  );
};

export default RequestAccessConfigurationPopover;
