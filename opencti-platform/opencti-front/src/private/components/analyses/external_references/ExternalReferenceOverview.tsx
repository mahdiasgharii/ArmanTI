import React, { FunctionComponent } from 'react';
import { createFragmentContainer, graphql } from 'react-relay';
import Grid from '@mui/material/Grid';
import { useFormatter } from '../../../../components/i18n';
import ExpandableMarkdown from '../../../../components/ExpandableMarkdown';
import { truncate } from '../../../../utils/String';
import { ExternalReferenceOverview_externalReference$data } from './__generated__/ExternalReferenceOverview_externalReference.graphql';
import Card from '../../../../components/common/card/Card';
import Label from '../../../../components/common/label/Label';

interface ExternalReferenceOverviewComponentProps {
  externalReference: ExternalReferenceOverview_externalReference$data;
}

const ExternalReferenceOverviewComponent: FunctionComponent<
  ExternalReferenceOverviewComponentProps
> = ({ externalReference }) => {
  const { t_i18n, fldt } = useFormatter();

  return (
    <div style={{ height: '100%' }}>
      <Card
        title={t_i18n('Overview')}
        sx={{
          display: 'flex',
          flexDirection: 'column',
          gap: 2,
        }}
      >
        <div>
          <Label>{t_i18n('Source name')}</Label>
          <span>{truncate(externalReference.source_name, 40)}</span>
        </div>
        <div>
          <Label>{t_i18n('Description')}</Label>
          <ExpandableMarkdown
            source={externalReference.description}
            limit={400}
          />
        </div>
        <Grid container spacing={2}>
          <Grid item xs={6}>
            <Label>{t_i18n('Original creation date')}</Label>
            <span>{fldt(externalReference.created)}</span>
          </Grid>
          <Grid item xs={6}>
            <Label>{t_i18n('Modification date')}</Label>
            <span>{fldt(externalReference.modified)}</span>
          </Grid>
        </Grid>
      </Card>
    </div>
  );
};

const ExternalReferenceOverview = createFragmentContainer(
  ExternalReferenceOverviewComponent,
  {
    externalReference: graphql`
      fragment ExternalReferenceOverview_externalReference on ExternalReference {
        id
        source_name
        description
        url
        created
        modified
      }
    `,
  },
);

export default ExternalReferenceOverview;
