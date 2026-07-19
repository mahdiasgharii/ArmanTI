import Button from '@common/button/Button';
import Alert from '@mui/material/Alert';
import { FunctionComponent } from 'react';
import FormButtonContainer from '../../../../components/common/form/FormButtonContainer';
import { useFormatter } from '../../../../components/i18n';
import ItemCopy from '../../../../components/ItemCopy';
import { Box } from '@mui/material';

interface TokenResultViewProps {
  token: string;
  onClose: () => void;
}

const TokenResultView: FunctionComponent<TokenResultViewProps> = ({
  token,
  onClose,
}) => {
  const { t_i18n } = useFormatter();

  return (
    <div>
      <Alert
        severity="success"
        variant="outlined"
        sx={{
          mb: 2,
          borderColor: 'var(--ravin-success)',
          color: 'var(--ravin-text)',
          '& .MuiAlert-icon': {
            color: 'var(--ravin-success)',
          },
          '& .MuiTypography-root': {
            fontFamily: '"Peyda", sans-serif',
            fontSize: '0.8rem',
          },
        }}
      >
        <strong>{t_i18n('Token generated successfully')}</strong>
        <br />
        {t_i18n('Make sure to copy your new personal access token now. You won\'t be able to see it again!')}
      </Alert>

      <Box
        sx={{
          padding: 2,
          backgroundColor: 'var(--ravin-surface-2)',
          borderRadius: '4px',
          border: '1px solid var(--ravin-border)',
        }}
      >
        <ItemCopy content={token} focusOnMount={true} />
      </Box>

      <FormButtonContainer>
        <Button onClick={onClose}>
          {t_i18n('Close')}
        </Button>
      </FormButtonContainer>
    </div>
  );
};

export default TokenResultView;
