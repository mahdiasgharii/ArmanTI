import React, { Suspense, useMemo } from 'react';
import { graphql, useFragment, usePreloadedQuery } from 'react-relay';
import { PLATFORM_DASHBOARD } from './HomeDashboardSettings';
import StixRelationshipsDistributionList from './common/stix_relationships/StixRelationshipsDistributionList';
import StixRelationshipsPolarArea from './common/stix_relationships/StixRelationshipsPolarArea';
import StixCoreObjectsList from './common/stix_core_objects/StixCoreObjectsList';
import StixRelationshipsMultiAreaChart from './common/stix_relationships/StixRelationshipsMultiAreaChart';
import StixCoreObjectsNumber from './common/stix_core_objects/StixCoreObjectsNumber';
import { useFormatter } from '../../components/i18n';
import Loader, { LoaderVariant } from '../../components/Loader';
import useAuth, { UserContext } from '../../utils/hooks/useAuth';
import { EXPLORE, KNOWLEDGE } from '../../utils/hooks/useGranted';
import { usePaginationLocalStorage } from '../../utils/hooks/useLocalStorage';
import Security from '../../utils/Security';
import { lastDayOfThePreviousMonth, monthsAgo, yearsAgo } from '../../utils/Time';
import StixRelationshipsHorizontalBars from './common/stix_relationships/StixRelationshipsHorizontalBars';
import CustomDashboard from './workspaces/dashboards/CustomDashboard';
import useQueryLoading from '../../utils/hooks/useQueryLoading';
import useConnectedDocumentModifier from '../../utils/hooks/useConnectedDocumentModifier';
import MarkdownDisplay from '../../components/markdownDisplay/MarkdownDisplay';

// region styles
// endregion

// region inner components

const DefaultDashboard = ({ timeField }) => {
  const { t_i18n } = useFormatter();
  const { settings } = useAuth();

  const noAccessMessage = settings.platform_no_access_message
    ?? t_i18n('You do not have any access to the knowledge of this OpenCTI instance.');

  const config = {
    startDate: null,
    endDate: null,
  };

  return (
    <Security
      needs={[KNOWLEDGE]}
      placeholder={<MarkdownDisplay content={noAccessMessage} />}
    >


      <div className="flex flex-1 flex-col gap-4 p-4 md:p-6">
        <div className="grid grid-cols-2 gap-4 lg:grid-cols-5">
            <StixCoreObjectsNumber
              entityType="Intrusion-Set"
              config={config}
              parameters={{
                title: 'Intrusion-Set',
              }}
              dataSelection={[{
                filters: {
                  mode: 'and',
                  filters: [
                    {
                      key: 'entity_type',
                      values: ['Intrusion-Set'],
                    },
                  ],
                  filterGroups: [],
                },
                date_attribute: timeField === 'functional' ? 'start_time' : 'created_at',
              }]}
            />
            <StixCoreObjectsNumber
              entityType="Malware"
              config={config}
              parameters={{
                title: 'Malware',
              }}
              dataSelection={[{
                filters: {
                  mode: 'and',
                  filters: [
                    {
                      key: 'entity_type',
                      values: ['Malware'],
                    },
                  ],
                  filterGroups: [],
                },
                date_attribute: timeField === 'functional' ? 'start_time' : 'created_at',
              }]}
            />
            <StixCoreObjectsNumber
              entityType="Report"
              config={config}
              parameters={{
                title: 'Report',
              }}
              dataSelection={[{
                filters: {
                  mode: 'and',
                  filters: [
                    {
                      key: 'entity_type',
                      values: ['Report'],
                    },
                  ],
                  filterGroups: [],
                },
                date_attribute: timeField === 'functional' ? 'start_time' : 'created_at',
              }]}
            />
            <StixCoreObjectsNumber
              entityType="Indicator"
              config={config}
              parameters={{
                title: 'Indicator',
              }}
              dataSelection={[{
                filters: {
                  mode: 'and',
                  filters: [
                    {
                      key: 'entity_type',
                      values: ['Indicator'],
                    },
                  ],
                  filterGroups: [],
                },
                date_attribute: timeField === 'functional' ? 'created' : 'created_at',
              }]}
            />
            <StixCoreObjectsNumber
              entityType="Campaign"
              config={config}
              parameters={{
                title: 'Campaign',
              }}
              dataSelection={[{
                filters: {
                  mode: 'and',
                  filters: [
                    {
                      key: 'entity_type',
                      values: ['Campaign'],
                    },
                  ],
                  filterGroups: [],
                },
                date_attribute: timeField === 'functional' ? 'start_time' : 'created_at',
              }]}
            />

        </div>

        <div className="grid grid-cols-1 gap-4 lg:grid-cols-4">
            <StixRelationshipsMultiAreaChart
              height={380}
              config={{
                startDate: yearsAgo(1),
                endDate: lastDayOfThePreviousMonth(),
              }}
              parameters={{
                title: t_i18n('Relationships created'),
                interval: 'month',
              }}
              dataSelection={[{
                attribute: 'internal_id',
                isTo: true,
                filters: {
                  mode: 'and',
                  filters: [
                    {
                      key: 'entity_type',
                      values: ['stix-core-relationship'],
                    },
                  ],
                  filterGroups: [],
                },
                date_attribute: timeField === 'functional' ? 'start_time' : 'created_at',
              }]}
            />

            <StixRelationshipsHorizontalBars
              height={320}
              config={{
                startDate: monthsAgo(3),
                endDate: null,
              }}
              parameters={{
                title: t_i18n('Most active threats (Last 3 months)'),
              }}
              dataSelection={[{
                attribute: 'internal_id',
                isTo: false,
                filters: {
                  mode: 'and',
                  filters: [
                    {
                      key: 'fromTypes',
                      mode: 'or',
                      values: ['Threat-Actor', 'Intrusion-Set', 'Campaign'],
                    },
                    {
                      key: 'entity_type',
                      values: ['stix-core-relationship'],
                    },
                  ],
                  filterGroups: [],
                },
                date_attribute: timeField === 'functional' ? 'start_time' : 'created_at',
              }]}
            />
            <StixRelationshipsHorizontalBars
              height={320}
              config={{
                startDate: monthsAgo(3),
                endDate: null,
              }}
              parameters={{
                title: t_i18n('Most targeted victims (Last 3 months)'),
              }}
              dataSelection={[{
                attribute: 'internal_id',
                isTo: true,
                filters: {
                  mode: 'and',
                  filters: [
                    {
                      key: 'toTypes',
                      mode: 'or',
                      values: ['Identity', 'Location', 'Event'],
                    },
                    {
                      key: 'relationship_type',
                      values: ['targets'],
                    },
                  ],
                  filterGroups: [],
                },
                date_attribute: timeField === 'functional' ? 'start_time' : 'created_at',
              }]}
            />

            <StixRelationshipsPolarArea
              height={360}
              config={{
                startDate: monthsAgo(3),
                endDate: null,
              }}
              parameters={{
                title: t_i18n('Most active malware (Last 3 months)'),
              }}
              dataSelection={[{
                attribute: 'internal_id',
                isTo: false,
                filters: {
                  mode: 'and',
                  filters: [
                    {
                      key: 'fromTypes',
                      values: ['Malware'],
                    },
                    {
                      key: 'entity_type',
                      values: ['uses'],
                    },
                  ],
                  filterGroups: [],
                },
                date_attribute: timeField === 'functional' ? 'start_time' : 'created_at',
              }]}
            />
            <StixRelationshipsDistributionList
              overflow="hidden"
              parameters={{
                title: t_i18n('Most active vulnerabilities (Last 3 months)'),
              }}
              height={360}
              config={{
                startDate: monthsAgo(3),
                endDate: null,
              }}
              dataSelection={[{
                attribute: 'internal_id',
                isTo: true,
                number: 8,
                filters: {
                  mode: 'and',
                  filters: [
                    {
                      key: 'entity_type',
                      values: ['targets'],
                    },
                    {
                      key: 'toTypes',
                      values: ['Vulnerability'],
                    },
                  ],
                  filterGroups: [],
                },
                date_attribute: timeField === 'functional' ? 'start_time' : 'created_at',
              }]}
            />

            <StixCoreObjectsList
              title={t_i18n('Latest reports')}
              config={config}
              height={400}
              widgetId="default_latest_reports_widget"
              className="lg:col-span-3"
              dataSelection={[{
                filters: {
                  mode: 'and',
                  filters: [
                    {
                      key: 'entity_type',
                      values: ['Report'],
                    },
                  ],
                  filterGroups: [],
                },
                date_attribute: timeField === 'functional' ? 'start_time' : 'created_at',
                sort_mode: 'desc',
                columns: [
                  { attribute: 'name', label: 'Name' },
                  { attribute: 'created', label: 'Original creation date' },
                  { attribute: 'createdBy' },
                  { attribute: 'creators', label: 'Creators' },
                  { attribute: 'x_opencti_workflow_id' },
                  { attribute: 'objectLabel' },
                  { attribute: 'objectMarking' },
                ],
              }]}
            />
            <StixRelationshipsHorizontalBars
              height={400}
              config={{
                startDate: monthsAgo(3),
                endDate: null,
              }}
              parameters={{
                title: t_i18n('Most active labels (Last 3 months)'),
                number: 15,
              }}
              dataSelection={[{
                attribute: 'internal_id',
                isTo: true,
                filters: {
                  mode: 'and',
                  filters: [
                    {
                      key: 'toTypes',
                      mode: 'or',
                      values: ['Label'],
                    },
                  ],
                  filterGroups: [],
                },
                date_attribute: timeField === 'functional' ? 'start_time' : 'created_at',
              }]}
            />
        </div>
      </div>

    </Security>
  );
};

const dashboardCustomDashboardQuery = graphql`
  query HomeDashboardCustomDashboardQuery($id: String!) {
    workspace(id: $id) {
      id
      name
      ...CustomDashboard_workspace
    }
  }
`;
const WorkspaceDashboardComponent = ({ queryRef, timeField }) => {
  const data = usePreloadedQuery(dashboardCustomDashboardQuery, queryRef);
  if (data.workspace) {
    return <CustomDashboard data={data.workspace} noToolbar={true} />;
  }
  return <DefaultDashboard timeField={timeField} />;
};
const WorkspaceDashboard = ({ dashboard, timeField }) => {
  const queryRef = useQueryLoading(dashboardCustomDashboardQuery, {
    id: dashboard,
  });
  return (
    <>
      {queryRef && (
        <React.Suspense fallback={<Loader variant={LoaderVariant.inElement} />}>
          <WorkspaceDashboardComponent
            timeField={timeField}
            queryRef={queryRef}
          />
        </React.Suspense>
      )}
    </>
  );
};
const CustomHomeDashboard = ({ dashboard, timeField }) => {
  const { t_i18n } = useFormatter();
  return (
    <Security
      needs={[EXPLORE]}
      placeholder={t_i18n(
        'You do not have any access to the explore part of this OpenCTI instance.',
      )}
    >
      <Suspense fallback={<Loader />}>
        <WorkspaceDashboard dashboard={dashboard} timeField={timeField} />
      </Suspense>
    </Security>
  );
};

const dashboardQuery = graphql`
  query HomeDashboardQuery {
    me {
      ...HomeDashboardMeFragment
    }
  }
`;

const dashboardMeFragment = graphql`
  fragment HomeDashboardMeFragment on MeUser {
    id
    default_dashboard {
      id
    }
    default_time_field
  }
`;

const LOCAL_STORAGE_KEY = 'dashboard';

const HomeDashboardComponent = ({ queryRef }) => {
  const { t_i18n } = useFormatter();
  const authContext = useAuth();
  const currentMe = authContext.me;
  const data = usePreloadedQuery(dashboardQuery, queryRef);
  const me = useFragment(dashboardMeFragment, data.me);
  const { default_dashboards: dashboards } = currentMe;
  const { default_time_field, default_dashboard } = me;
  const { viewStorage: localTimeFieldPreferences } = usePaginationLocalStorage(
    LOCAL_STORAGE_KEY,
    {},
  );
  const { setTitle } = useConnectedDocumentModifier();
  setTitle(t_i18n('Dashboard'));
  const { dashboard } = localTimeFieldPreferences;
  let defaultDashboard = default_dashboard?.id;
  if (!defaultDashboard) {
    defaultDashboard = dashboards[0]?.id ?? PLATFORM_DASHBOARD;
  } else if (dashboard && dashboard !== 'default') {
    // Handle old conf
    defaultDashboard = dashboard;
  }
  const dashboardContextValue = useMemo(
    () => ({ ...authContext, me: { ...currentMe, ...me } }),
    [authContext, currentMe, me],
  );

  return (
    <UserContext.Provider value={dashboardContextValue}>
      <div data-testid="dashboard-page" className="flex flex-col h-full">
        {defaultDashboard !== PLATFORM_DASHBOARD ? (
          <CustomHomeDashboard
            dashboard={defaultDashboard}
            timeField={default_time_field}
          />
        ) : (
          <DefaultDashboard timeField={default_time_field} />
        )}
      </div>
    </UserContext.Provider>
  );
};

const HomeDashboard = () => {
  const queryRef = useQueryLoading(dashboardQuery, {});
  return (
    <>
      {queryRef && (
        <React.Suspense fallback={<div />}>
          <HomeDashboardComponent queryRef={queryRef} />
        </React.Suspense>
      )}
    </>
  );
};

export default HomeDashboard;
