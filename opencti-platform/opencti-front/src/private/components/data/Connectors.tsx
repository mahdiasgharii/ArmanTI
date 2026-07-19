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

const Connectors = () => {
  const { t_i18n } = useFormatter();
  const { setTitle } = useConnectedDocumentModifier();

  setTitle(t_i18n('Monitoring | Ingestion | Data'));

  return (
    <div data-testid="connectors-page">
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
            marginBottom: 1,
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
            <Typography
              variant="h1"
              sx={{ margin: 0, fontSize: 24, fontWeight: 600 }}
            >
              {t_i18n('Monitoring')}
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
