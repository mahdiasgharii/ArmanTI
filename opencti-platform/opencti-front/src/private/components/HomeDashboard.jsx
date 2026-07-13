import { assoc, head, last, map, pluck } from 'ramda';
import React, { Suspense, useMemo } from 'react';
import { graphql, useFragment, usePreloadedQuery } from 'react-relay';
import { Clock } from 'lucide-react';
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
import { computeLevel } from '../../utils/Number';
import Security from '../../utils/Security';
import { lastDayOfThePreviousMonth, monthsAgo, yearsAgo } from '../../utils/Time';
import LocationMiniMapTargets from './common/location/LocationMiniMapTargets';
import StixRelationshipsHorizontalBars from './common/stix_relationships/StixRelationshipsHorizontalBars';
import CustomDashboard from './workspaces/dashboards/CustomDashboard';
import useQueryLoading from '../../utils/hooks/useQueryLoading';
import useConnectedDocumentModifier from '../../utils/hooks/useConnectedDocumentModifier';
import MarkdownDisplay from '../../components/markdownDisplay/MarkdownDisplay';

// region styles
// endregion

// region inner components

// TargetedCountries
const dashboardStixCoreRelationshipsDistributionQuery = graphql`
  query HomeDashboardStixCoreRelationshipsDistributionQuery(
    $field: String!
    $operation: StatsOperation!
    $relationship_type: [String]
    $isTo: Boolean
    $toRole: String
    $toTypes: [String]
    $startDate: DateTime
    $endDate: DateTime
    $dateAttribute: String
    $limit: Int
  ) {
    stixCoreRelationshipsDistribution(
      field: $field
      operation: $operation
      relationship_type: $relationship_type
      isTo: $isTo
      toRole: $toRole
      toTypes: $toTypes
      startDate: $startDate
      endDate: $endDate
      dateAttribute: $dateAttribute
      limit: $limit
    ) {
      label
      value
      entity {
        ... on BasicObject {
          entity_type
        }
        ... on BasicRelationship {
          entity_type
        }
        ... on StixObject {
          representative {
            main
          }
        }
        ... on StixRelationship {
          representative {
            main
          }
        }
        ... on Country {
          # nullable fields, so it will work even if the Country is Restricted
          x_opencti_aliases
          latitude
          longitude
        }
      }
    }
  }
`;

const TargetedCountriesComponent = ({ queryRef }) => {
  const { t_i18n } = useFormatter();

  const data = usePreloadedQuery(
    dashboardStixCoreRelationshipsDistributionQuery,
    queryRef,
  );
  const values = pluck('value', data.stixCoreRelationshipsDistribution);
  const countries = map(
    (x) => assoc(
      'level',
      computeLevel(x.value, last(values), head(values) + 1),
      x.entity,
    ),
    data.stixCoreRelationshipsDistribution,
  );
  return (
    <LocationMiniMapTargets
      title={t_i18n('Targeted countries (Last 3 months)')}
      center={[48.8566969, 2.3514616]}
      countries={countries}
      zoom={2}
    />
  );
};

const TargetedCountries = ({ timeField }) => {
  const queryOptions = {
    field: 'internal_id',
    operation: 'count',
    relationship_type: 'targets',
    isTo: true,
    toRole: 'targets_to',
    toTypes: ['Country'],
    startDate: monthsAgo(3),
    dateAttribute: timeField === 'functional' ? 'start_time' : 'created_at',
    limit: 100,
  };
  const queryRef = useQueryLoading(
    dashboardStixCoreRelationshipsDistributionQuery,
    queryOptions,
  );
  return (
    <>
      {queryRef && (
        <React.Suspense fallback={<Loader variant={LoaderVariant.inElement} />}>
          <TargetedCountriesComponent queryRef={queryRef} />
        </React.Suspense>
      )}
    </>
  );
};
// endregion

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


      <div className="flex flex-col gap-8 pb-8">
        <div className="flex flex-col gap-2 pb-4 border-b border-border">
          <h1 className="font-display text-[22px] font-semibold lowercase first-letter:uppercase text-text-base">
            {t_i18n('Dashboard')}
          </h1>
          <div className="flex items-center gap-3 text-text-muted">
            <span className="flex items-center gap-1.5 font-body text-xs lowercase first-letter:uppercase">
              <Clock size={12} className="text-text-light" />
              {timeField === 'functional' ? t_i18n('Functional time') : t_i18n('Technical time')}
            </span>
            <span className="flex items-center gap-1.5 font-body text-xs lowercase first-letter:uppercase">
              <span className="ravin-pulse-dot w-1.5 h-1.5 rounded-full bg-success" />
              {t_i18n('Auto-refresh')}
            </span>
          </div>
        </div>

        <div className="flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <h2 className="font-display text-base font-semibold lowercase first-letter:uppercase text-text-muted">
                {t_i18n('Threat metrics')}
              </h2>
              <span className="font-body text-xs text-text-light lowercase first-letter:uppercase px-2 py-0.5 rounded-[4px] bg-surface-2 border border-border">
                {t_i18n('All time')}
              </span>
            </div>
          </div>
          <div className="grid grid-cols-12 gap-4">
            <div className="col-span-12 sm:col-span-6 md:col-span-3">
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
            </div>
            <div className="col-span-12 sm:col-span-6 md:col-span-3">
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
            </div>
            <div className="col-span-12 sm:col-span-6 md:col-span-3">
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
            </div>
            <div className="col-span-12 sm:col-span-6 md:col-span-3">
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
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-3 pt-8 border-t border-border">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <h2 className="font-display text-base font-semibold lowercase first-letter:uppercase text-text-muted">
                {t_i18n('Threat activity')}
              </h2>
              <span className="font-body text-xs text-text-light lowercase first-letter:uppercase px-2 py-0.5 rounded-[4px] bg-surface-2 border border-border">
                {t_i18n('Last 3 months')}
              </span>
            </div>
          </div>
          <div className="grid grid-cols-12 gap-4">
            <div className="col-span-12 md:col-span-3">
              <StixRelationshipsHorizontalBars
                height={300}
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
            </div>
            <div className="col-span-12 md:col-span-3">
              <StixRelationshipsHorizontalBars
                height={300}
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
            </div>
            <div className="col-span-12 md:col-span-6">
              <StixRelationshipsMultiAreaChart
                height={300}
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
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-3 pt-8 border-t border-border">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <h2 className="font-display text-base font-semibold lowercase first-letter:uppercase text-text-muted">
                {t_i18n('Intelligence overview')}
              </h2>
              <span className="font-body text-xs text-text-light lowercase first-letter:uppercase px-2 py-0.5 rounded-[4px] bg-surface-2 border border-border">
                {t_i18n('Last 3 months')}
              </span>
            </div>
          </div>
          <div className="grid grid-cols-12 gap-4">
            <div className="col-span-12 md:col-span-3">
              <StixRelationshipsPolarArea
                height={400}
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
            </div>
            <div className="col-span-12 md:col-span-3">
              <StixRelationshipsDistributionList
                overflow="hidden"
                parameters={{
                  title: t_i18n('Most active vulnerabilities (Last 3 months)'),
                }}
                height={400}
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
            </div>
            <div className="col-span-12 md:col-span-6">
              <Suspense
                fallback={(
                  <LocationMiniMapTargets
                    title={t_i18n('Targeted countries (Last 3 months)')}
                    center={[48.8566969, 2.3514616]}
                    zoom={2}
                  />
                )}
              >
                <TargetedCountries timeField={timeField} />
              </Suspense>
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-3 pt-8 border-t border-border">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <h2 className="font-display text-base font-semibold lowercase first-letter:uppercase text-text-muted">
                {t_i18n('Latest intelligence')}
              </h2>
              <span className="font-body text-xs text-text-light lowercase first-letter:uppercase px-2 py-0.5 rounded-[4px] bg-surface-2 border border-border">
                {t_i18n('Recent')}
              </span>
            </div>
          </div>
          <div className="grid grid-cols-12 gap-4">
            <div className="col-span-12 md:col-span-8">
              <StixCoreObjectsList
                title={t_i18n('Latest reports')}
                config={config}
                height={410}
                widgetId="default_latest_reports_widget"
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
            </div>
            <div className="col-span-12 md:col-span-4">
              <StixRelationshipsHorizontalBars
                height={410}
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
        </div>
      </div>

      <div className="ravin-blur-footer" />

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
      <div data-testid="dashboard-page">
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
