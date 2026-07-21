import React from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { useFormatter } from '../../../components/i18n';
import { QueryRenderer } from '../../../relay/environment';
import WorkersStatus, { workersStatusQuery } from './connectors/WorkersStatus';
import ConnectorsStatus from './connectors/ConnectorsStatus';
import Breadcrumbs from '../../../components/Breadcrumbs';
import useConnectedDocumentModifier from '../../../utils/hooks/useConnectedDocumentModifier';
import PageContainer from '../../../components/PageContainer';
import { WorkersStatusQuery$data } from './connectors/__generated__/WorkersStatusQuery.graphql';

const lowercaseVoiceSx = {
  textTransform: 'lowercase',
  '&::first-letter': { textTransform: 'uppercase' },
} as const;

const Connectors = () => {
  const { t_i18n } = useFormatter();
  const { setTitle } = useConnectedDocumentModifier();

  setTitle(t_i18n('Monitoring | Ingestion | Data'));

  return (
    <div data-testid="connectors-page" style={{ padding: '8px 12px 32px 12px' }}>
      <PageContainer withRightMenu withGap>
        <Breadcrumbs
          elements={[{ label: t_i18n('Data') }, { label: t_i18n('Ingestion') }, { label: t_i18n('Monitoring'), current: true }]}
          noMargin
        />
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: 2,
          }}
        >
          <Box>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
              <Typography
                variant="h1"
                sx={{
                  margin: 0,
                  fontSize: '22px',
                  fontWeight: 600,
                  color: 'var(--ravin-text)',
                  lineHeight: 1.3,
                  ...lowercaseVoiceSx,
                }}
              >
                {t_i18n('Monitoring')}
              </Typography>
            </Box>
            <Typography
              sx={{
                fontSize: '0.8125rem',
                color: 'var(--ravin-text-muted)',
                marginTop: '4px',
                ...lowercaseVoiceSx,
              }}
            >
              {t_i18n('Platform health, connector status and ingestion metrics')}
            </Typography>
          </Box>
        </Box>
        <QueryRenderer
          query={workersStatusQuery}
          render={({ props }: { props: WorkersStatusQuery$data }) => {
            return <WorkersStatus data={props} />;
          }}
        />
        <ConnectorsStatus />
      </PageContainer>
    </div>
  );
};

export default Connectors;
