import Button from '@common/button/Button';
import Dialog from '@common/dialog/Dialog';
import Alert from '@mui/material/Alert';
import AlertTitle from '@mui/material/AlertTitle';
import DialogActions from '@mui/material/DialogActions';
import React, { useState } from 'react';
import Card from '../../../components/common/card/Card';
import { useFormatter } from '../../../components/i18n';

const ravinCardSx = {
  borderRadius: '8px',
  border: '1px solid var(--ravin-border)',
  borderColor: 'var(--ravin-border)',
  background: 'var(--ravin-bg)',
  padding: '16px',
  height: '100%',
  width: '100%',
} as const;

const ProfileLocalStorage: React.FC = () => {
  const { t_i18n } = useFormatter();

  const [displayConfirmation, setDisplayConfirmation] = useState(false);

  return (
    <>
      <Card sx={ravinCardSx} padding="none">
        <Alert
          severity="info"
          variant="outlined"
          sx={{
            borderColor: 'var(--ravin-primary)',
            color: 'var(--ravin-text)',
            '& .MuiAlert-icon': {
              color: 'var(--ravin-primary)',
            },
            '& .MuiTypography-root': {
              fontFamily: '"Peyda", sans-serif',
              fontSize: '0.8rem',
            },
          }}
        >
          {t_i18n('Your local storage contains the latest filters and searches used in most views of the platform. Clearing local storage might help to load a page crashing because of some filtering, searching or sorting issue.')}
        </Alert>
        <div style={{ display: 'flex', justifyContent: 'end', marginTop: 16 }}>
          <Button
            onClick={() => setDisplayConfirmation(true)}
          >
            {t_i18n('Clear local storage')}
          </Button>
        </div>
      </Card>

      {/* Confirmation dialog */}
      <Dialog
        open={displayConfirmation}
        onClose={() => setDisplayConfirmation(false)}
        title={t_i18n('Clear local storage')}
      >
        <Alert
          icon={false}
          severity="warning"
          variant="outlined"
          sx={{
            borderColor: 'var(--ravin-warning)',
            color: 'var(--ravin-text)',
            '& .MuiAlert-icon': {
              color: 'var(--ravin-warning)',
            },
            '& .MuiTypography-root': {
              fontFamily: '"Peyda", sans-serif',
            },
          }}
        >
          <AlertTitle style={{ marginBottom: 0, fontWeight: 400 }}>
            {t_i18n('This will erase all the views settings you have made. All these changes will be lost. Are you sure?')}
          </AlertTitle>
        </Alert>
        <DialogActions>
          <Button
            variant="secondary"
            onClick={() => setDisplayConfirmation(false)}
          >
            {t_i18n('Cancel')}
          </Button>
          <Button
            onClick={() => {
              localStorage.clear();
              setDisplayConfirmation(false);
            }}
          >
            {t_i18n('Validate')}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default ProfileLocalStorage;
