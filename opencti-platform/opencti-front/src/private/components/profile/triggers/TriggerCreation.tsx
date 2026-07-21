import React, { FunctionComponent, useState } from 'react';
import { Zap, Mail } from 'lucide-react';
import Button from '@common/button/Button';
import { useFormatter } from '../../../../components/i18n';
import { TriggersLinesPaginationQuery$variables } from './__generated__/TriggersLinesPaginationQuery.graphql';
import TriggerDigestCreation from './TriggerDigestCreation';
import TriggerLiveCreation from './TriggerLiveCreation';
import { TriggerLiveCreationKnowledgeMutation$data } from './__generated__/TriggerLiveCreationKnowledgeMutation.graphql';

interface TriggerCreationProps {
  contextual?: boolean;
  hideSpeedDial?: boolean;
  open?: boolean;
  handleClose?: () => void;
  inputValue?: string;
  paginationOptions?: TriggersLinesPaginationQuery$variables;
  creationCallback?: (data: TriggerLiveCreationKnowledgeMutation$data) => void;
}

const TriggerCreation: FunctionComponent<TriggerCreationProps> = ({
  contextual,
  inputValue,
  paginationOptions,
  creationCallback,
  handleClose,
  open,
}) => {
  const { t_i18n } = useFormatter();
  // Live
  const [openLive, setOpenLive] = useState(false);
  const handleOpenCreateLive = () => {
    setOpenLive(true);
  };
  // Digest
  const [openDigest, setOpenDigest] = useState(false);
  const handleOpenCreateDigest = () => {
    setOpenDigest(true);
  };
  return (
    <>
      <Button
        sx={{ textTransform: 'lowercase', '&::first-letter': { textTransform: 'uppercase' } }}
        onClick={handleOpenCreateLive}
        startIcon={<Zap size={16} />}
      >
        {t_i18n('', {
          id: 'Create ...',
          values: { entity_type: t_i18n('Live trigger') },
        })}
      </Button>
      <Button
        onClick={handleOpenCreateDigest}
        startIcon={<Mail size={16} />}
        sx={{ textTransform: 'lowercase', '&::first-letter': { textTransform: 'uppercase' } }}
      >
        {t_i18n('', {
          id: 'Create ...',
          values: { entity_type: t_i18n('Regular digest') },
        })}
      </Button>
      <TriggerLiveCreation
        contextual={contextual}
        inputValue={inputValue}
        paginationOptions={paginationOptions}
        open={open ?? openLive}
        handleClose={() => {
          if (handleClose) {
            handleClose();
          } else {
            setOpenLive(false);
          }
        }}
        creationCallback={creationCallback}
      />
      <TriggerDigestCreation
        contextual={contextual}
        inputValue={inputValue}
        paginationOptions={paginationOptions}
        open={openDigest}
        handleClose={() => setOpenDigest(false)}
      />
    </>
  );
};

export default TriggerCreation;
