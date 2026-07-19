import Button from '@common/button/Button';
import Card from '@common/card/Card';
import { Lock as LockOutlined, Unlock as NoEncryptionOutlined } from 'lucide-react';
import { Box, ListItem, ListItemText, Stack, Switch, Typography } from '@mui/material';
import Alert from '@mui/material/Alert';
import Dialog from '@common/dialog/Dialog';
import MenuItem from '@mui/material/MenuItem';
import { useTheme } from '@mui/styles';
import { Field, Form, Formik } from 'formik';
import * as PropTypes from 'prop-types';
import qrcode from 'qrcode';
import { pick } from 'ramda';
import { useEffect, useState } from 'react';
import { createFragmentContainer, graphql } from 'react-relay';
import { Link } from 'react-router-dom';
import * as Yup from 'yup';
import { availableLanguage } from '../../../components/AppIntlProvider';
import Label from '../../../components/common/label/Label';
import SelectField from '../../../components/fields/SelectField';
import inject18n, { useFormatter } from '../../../components/i18n';
import Loader from '../../../components/Loader';
import TextField from '../../../components/TextField';
import OtpInputField, { OTP_CODE_SIZE } from '../../../public/components/login/OtpInputField';
import { commitMutation, QueryRenderer } from '../../../relay/environment';
import { convertOrganizations } from '../../../utils/edition';
import { fieldSpacingContainerStyle } from '../../../utils/field';
import useConnectedDocumentModifier from '../../../utils/hooks/useConnectedDocumentModifier';
import useGranted, { APIACCESS_USETOKEN, KNOWLEDGE } from '../../../utils/hooks/useGranted';
import useHelper from '../../../utils/hooks/useHelper';
import NotifierField from '../common/form/NotifierField';
import ObjectOrganizationField from '../common/form/ObjectOrganizationField';
import HomeDashboardSettings from '../HomeDashboardSettings';
import TokenCreationDrawer from './api_tokens/TokenCreationDrawer';
import TokenList from './api_tokens/TokenList';
import ProfileLocalStorage from './ProfileLocalStorage';
import ProfileOverviewNewsFeed from './ProfileOverviewNewsFeed';

const lowercaseVoiceSx = {
  textTransform: 'lowercase',
  '&::first-letter': { textTransform: 'uppercase' },
};

const ravinCardSx = {
  borderRadius: '8px',
  border: '1px solid var(--ravin-border)',
  borderColor: 'var(--ravin-border)',
  background: 'var(--ravin-bg)',
  padding: '16px',
  height: '100%',
  width: '100%',
};

const profileOverviewFieldPatch = graphql`
  mutation ProfileOverviewFieldPatchMutation(
    $input: [EditInput]!
    $password: String
  ) {
    meEdit(input: $input, password: $password) {
      ...ProfileOverview_me
    }
  }
`;

const generateOTP = graphql`
  query ProfileOverviewOTPQuery {
    otpGeneration {
      secret
      uri
    }
  }
`;

const validateOtpPatch = graphql`
  mutation ProfileOverviewOtpMutation($input: UserOTPActivationInput) {
    otpActivation(input: $input) {
      ...ProfileOverview_me
    }
  }
`;

const disableOtpPatch = graphql`
  mutation ProfileOverviewOtpDisableMutation {
    otpDeactivation {
      ...ProfileOverview_me
    }
  }
`;

const userValidation = (t) => Yup.object().shape({
  name: Yup.string().required(t('This field is required')),
  user_email: Yup.string()
    .required(t('This field is required'))
    .email(t('The value must be an email address')),
  personal_notifiers: Yup.array(),
  firstname: Yup.string().nullable(),
  lastname: Yup.string().nullable(),
  theme: Yup.string().nullable(),
  language: Yup.string().nullable(),
  description: Yup.string().nullable(),
  otp_activated: Yup.boolean(),
  unit_system: Yup.string().nullable(),
  submenu_show_icons: Yup.boolean(),
  submenu_auto_collapse: Yup.boolean(),
  monochrome_labels: Yup.boolean(),
  unsubscribed_news_feed_types: Yup.array().of(Yup.string()),
});

const Otp = ({ closeFunction, secret, uri }) => {
  const { t_i18n } = useFormatter();
  const theme = useTheme();
  const [otpQrImage, setOtpQrImage] = useState('');
  const [code, setCode] = useState('');
  const [error, setError] = useState(null);
  const [inputDisable, setInputDisable] = useState(false);
  const handleChange = (data) => setCode(data);
  if (code.length === OTP_CODE_SIZE && !inputDisable) {
    setInputDisable(true);
    commitMutation({
      mutation: validateOtpPatch,
      variables: { input: { secret, code } },
      onError: () => {
        setInputDisable(false);
        setCode('');
        return setError(t_i18n('The code is not correct.'));
      },
      onCompleted: () => {
        setError(null);
        return closeFunction();
      },
    });
  }
  useEffect(() => {
    qrcode.toDataURL(
      uri,
      (err, imageUrl) => {
        if (err) {
          setOtpQrImage('');
          return;
        }
        setOtpQrImage(imageUrl);
      },
    );
  }, [uri, theme]);
  return (
    <div style={{ textAlign: 'center' }}>
      <img src={otpQrImage} style={{ width: 265 }} alt="" />
      {error ? (
        <Alert
          severity="error"
          variant="outlined"
          sx={{
            margin: '15px 0',
            borderColor: 'var(--ravin-danger)',
            color: 'var(--ravin-text)',
            '& .MuiAlert-icon': {
              color: 'var(--ravin-danger)',
            },
            '& .MuiTypography-root': {
              fontFamily: '"Peyda", sans-serif',
              fontSize: '0.8rem',
            },
          }}
        >
          {error}
        </Alert>
      ) : (
        <Alert
          severity="info"
          variant="outlined"
          sx={{
            margin: '15px 0',
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
          {t_i18n('Type the code generated in your application')}
        </Alert>
      )}
      <OtpInputField
        value={code}
        onChange={handleChange}
        isDisabled={inputDisable}
      />
    </div>
  );
};

const OtpComponent = ({ closeFunction }) => (
  <QueryRenderer
    query={generateOTP}
    render={({ props }) => {
      if (props) {
        return (
          <Otp
            closeFunction={closeFunction}
            secret={props.otpGeneration.secret}
            uri={props.otpGeneration.uri}
          />
        );
      }
      return <Loader />;
    }}
  />
);

const ProfileOverviewComponent = (props) => {
  const { t, me, about, settings, themes } = props;
  const { external, otp_activated: useOtp } = me;
  const { t_i18n } = useFormatter();
  const { isPlaygroundEnable } = useHelper();
  const { setTitle } = useConnectedDocumentModifier();
  setTitle(t_i18n('Profile'));
  const objectOrganization = convertOrganizations(me);
  const [display2FA, setDisplay2FA] = useState(false);
  const hasKnowledgeAccess = useGranted([KNOWLEDGE]);
  const hasAccessTokenCapability = useGranted([APIACCESS_USETOKEN]);
  const [displayTokenCreation, setDisplayTokenCreation] = useState(false);

  const fieldNames = [
    'name',
    'description',
    'user_email',
    'firstname',
    'lastname',
    'theme',
    'language',
    'otp_activated',
    'unit_system',
    'submenu_show_icons',
    'submenu_auto_collapse',
    'monochrome_labels',
  ];

  const initialValues = {
    ...pick(fieldNames, me),
    objectOrganization,
    personal_notifiers: (me.personal_notifiers ?? []).map(({ id, name }) => ({ value: id, label: name })),
  };

  const disableOtp = () => {
    commitMutation({
      mutation: disableOtpPatch,
    });
  };

  const handleSubmitField = (name, value) => {
    userValidation(t)
      .validateAt(name, { [name]: value })
      .then(() => {
        commitMutation({
          mutation: profileOverviewFieldPatch,
          variables: { input: { key: name, value } },
          onCompleted: () => {
            // Theme changes affect the entire app shell (MUI theme + CSS variables).
            // The root query's me.theme is not refetched on mutation, so reload to apply.
            if (name === 'theme') {
              window.location.reload();
            }
          },
        });
      })
      .catch(() => false);
  };

  const themeList = themes?.edges
    ?.filter((node) => !!node)
    .map((node) => node.node)
    ?? [];

  return (
    <Box sx={{ padding: '24px 24px 24px 24px' }}>
      <TokenCreationDrawer
        userId={me.id}
        open={displayTokenCreation}
        onClose={() => setDisplayTokenCreation(false)}
      />
      <Dialog
        open={display2FA}
        onClose={() => setDisplay2FA(false)}
        title={t('Enable two-factor authentication')}
        size="small"
      >
        <OtpComponent closeFunction={() => setDisplay2FA(false)} />
      </Dialog>
      <Typography
        variant="h1"
        sx={{
          fontFamily: '"Peyda", sans-serif',
          fontSize: '22px',
          fontWeight: 600,
          color: 'var(--ravin-text)',
          lineHeight: 1.3,
          ...lowercaseVoiceSx,
          mb: 3,
        }}
      >
        {t('User profile')}
      </Typography>
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          gap: '16px',
        }}
      >
        <Box
          className="ravin-drawer-fields"
          sx={{
            display: 'grid',
            gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' },
            gap: '16px',
          }}
        >
          <Card sx={ravinCardSx} padding="none">
            <Formik
              enableReinitialize={true}
              initialValues={initialValues}
              validationSchema={userValidation(t)}
            >
              {() => (
                <Form>
                  <Field
                    component={TextField}
                    variant="standard"
                    name="name"
                    disabled={external}
                    label={t('Name')}
                    fullWidth={true}
                    style={{ marginTop: 8 }}
                    onSubmit={handleSubmitField}
                  />
                  <Field
                    component={TextField}
                    variant="standard"
                    name="user_email"
                    disabled={external}
                    label={t('Email address')}
                    fullWidth={true}
                    style={{ marginTop: 20 }}
                    onSubmit={handleSubmitField}
                  />
                  <ObjectOrganizationField
                    name="objectOrganization"
                    label="Organizations"
                    disabled={true}
                    style={{ ...fieldSpacingContainerStyle, marginTop: 20 }}
                    outlined={false}
                  />
                  <Field
                    component={TextField}
                    variant="standard"
                    name="firstname"
                    label={t('Firstname')}
                    fullWidth={true}
                    style={{ marginTop: 20 }}
                    onSubmit={handleSubmitField}
                  />
                  <Field
                    component={TextField}
                    variant="standard"
                    name="lastname"
                    label={t('Lastname')}
                    fullWidth={true}
                    style={{ marginTop: 20 }}
                    onSubmit={handleSubmitField}
                  />
                  <Field
                    component={TextField}
                    variant="standard"
                    name="description"
                    label={t('Description')}
                    fullWidth={true}
                    multiline={true}
                    rows={4}
                    style={{ marginTop: 20 }}
                    onSubmit={handleSubmitField}
                  />
                </Form>
              )}
            </Formik>
            <Stack direction="row" sx={{ mt: 2 }}>
              {useOtp && (
                <Button
                  type="button"
                  variant="secondary"
                  fullWidth
                  startIcon={<NoEncryptionOutlined />}
                  onClick={disableOtp}
                  disabled={settings.otp_mandatory}
                >
                  {t('Disable two-factor authentication')}
                </Button>
              )}
              {!useOtp && (
                <Button
                  type="button"
                  variant="secondary"
                  fullWidth
                  startIcon={<LockOutlined />}
                  onClick={() => setDisplay2FA(true)}
                >
                  {t('Enable two-factor authentication')}
                </Button>
              )}
            </Stack>
          </Card>
          <Card sx={ravinCardSx} padding="none">
            <Formik
              enableReinitialize={true}
              initialValues={initialValues}
              validationSchema={userValidation(t)}
            >
              {() => (
                <Form>
                  <Field
                    component={SelectField}
                    variant="standard"
                    name="theme"
                    label={t('Theme')}
                    fullWidth={true}
                    inputProps={{
                      name: 'theme',
                      id: 'theme',
                    }}
                    containerstyle={{ width: '100%', marginTop: 8 }}
                    onChange={handleSubmitField}
                    MenuProps={{ slotProps: { paper: { className: 'ravin-select-paper' } } }}
                  >
                    <MenuItem value="default">{t('Default')}</MenuItem>
                    {themeList.map(({ id, name }) => (
                      <MenuItem key={id} value={id}>{name}</MenuItem>
                    ))}
                  </Field>
                  <Field
                    component={SelectField}
                    variant="standard"
                    name="language"
                    label={t('Language')}
                    fullWidth={true}
                    inputProps={{
                      name: 'language',
                      id: 'language',
                    }}
                    containerstyle={fieldSpacingContainerStyle}
                    onChange={handleSubmitField}
                    MenuProps={{ slotProps: { paper: { className: 'ravin-select-paper' } } }}
                  >
                    <MenuItem value="auto"><em>{t('Automatic')}</em></MenuItem>
                    {
                      availableLanguage.map(({ value, label }) => <MenuItem key={value} value={value}>{label}</MenuItem>)
                    }
                  </Field>
                  <Field
                    component={SelectField}
                    variant="standard"
                    name="unit_system"
                    label={t('Unit system')}
                    fullWidth={true}
                    inputProps={{ name: 'unit_system', id: 'unit_system' }}
                    containerstyle={fieldSpacingContainerStyle}
                    onChange={handleSubmitField}
                    MenuProps={{ slotProps: { paper: { className: 'ravin-select-paper' } } }}
                  >
                    <MenuItem value="auto"><em>{t('Automatic')}</em></MenuItem>
                    <MenuItem value="Imperial">{t('Imperial')}</MenuItem>
                    <MenuItem value="Metric">{t('Metric')}</MenuItem>
                  </Field>
                  <ListItem sx={{ padding: '20px 0 0 0' }}>
                    <ListItemText
                      primary={t('Show left navigation submenu icons')}
                      sx={{
                        '& .MuiTypography-root': {
                          fontFamily: '"Peyda", sans-serif',
                          fontSize: '0.9rem',
                          color: 'var(--ravin-text)',
                        },
                      }}
                    />
                    <Field
                      component={Switch}
                      variant="standard"
                      name="submenu_show_icons"
                      checked={initialValues.submenu_show_icons}
                      onChange={(_, value) => handleSubmitField('submenu_show_icons', value)}
                      sx={{
                        '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': {
                          backgroundColor: 'var(--ravin-primary)',
                          opacity: 0.3,
                        },
                        '& .MuiSwitch-switchBase.Mui-checked .MuiSwitch-thumb': {
                          color: 'var(--ravin-primary)',
                        },
                      }}
                    />
                  </ListItem>
                  <ListItem sx={{ padding: '10px 0 0 0' }}>
                    <ListItemText
                      primary={t('Auto collapse submenus in left navigation')}
                      sx={{
                        '& .MuiTypography-root': {
                          fontFamily: '"Peyda", sans-serif',
                          fontSize: '0.9rem',
                          color: 'var(--ravin-text)',
                        },
                      }}
                    />
                    <Field
                      component={Switch}
                      variant="standard"
                      name="submenu_auto_collapse"
                      checked={initialValues.submenu_auto_collapse}
                      onChange={(_, value) => handleSubmitField('submenu_auto_collapse', value)}
                      sx={{
                        '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': {
                          backgroundColor: 'var(--ravin-primary)',
                          opacity: 0.3,
                        },
                        '& .MuiSwitch-switchBase.Mui-checked .MuiSwitch-thumb': {
                          color: 'var(--ravin-primary)',
                        },
                      }}
                    />
                  </ListItem>
                  {/* <ListItem sx={{ padding: '10px 0 0 0' }}>
                  <ListItemText
                    primary={t('Monochrome labels and entity types')}
                  />
                  <Field
                    component={Switch}
                    variant="standard"
                    name="monochrome_labels"
                    checked={initialValues.monochrome_labels}
                    onChange={(_, value) => handleSubmitField('monochrome_labels', value)}
                  />
                </ListItem> */}
                  <Alert
                    severity="info"
                    variant="outlined"
                    sx={{
                      mt: '10px',
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
                    {settings.platform_notifier_auto_trigger_assignee
                      ? t_i18n('When an event happens on a knowledge your participate, you will receive notification through your personal notifiers')
                      : t_i18n('Automatic notifications for assignees and participants have been disabled by your platform administrator')
                    }
                  </Alert>
                  {settings.platform_notifier_auto_trigger_assignee && (
                    <NotifierField
                      label={t('Personal notifiers')}
                      name="personal_notifiers"
                      onChange={(name, values) => handleSubmitField(name, values.map(({ value }) => value))}
                    />
                  )}
                </Form>
              )}
            </Formik>
          </Card>
          {hasKnowledgeAccess ? (
            <Card sx={ravinCardSx} padding="none">
              <HomeDashboardSettings />
            </Card>
          ) : null}
          <ProfileLocalStorage />
          <Box sx={{ gridColumn: '1 / -1' }}>
            <Card sx={ravinCardSx} padding="none">
              <Box>
                <Label>{t('ArmanCTI Platform version')}</Label>
                <Box
                  component="pre"
                  sx={{
                    fontFamily: 'Consolas, monaco, monospace',
                    fontSize: '12px',
                    color: 'var(--ravin-text-muted)',
                    margin: '8px 0 16px 0',
                    padding: '8px 12px',
                    backgroundColor: 'color-mix(in srgb, var(--ravin-surface-2) 30%, transparent)',
                    border: '1px solid var(--ravin-border)',
                    borderRadius: '4px',
                    overflow: 'auto',
                  }}
                >
                  {about.version}
                </Box>
              </Box>
              <Stack gap={2}>
                <Stack direction="row" justifyContent="flex-end" gap={1}>
                  {hasAccessTokenCapability && isPlaygroundEnable() && (
                    <Button
                      variant="secondary"
                      component={Link}
                      to="/public/graphql"
                      target="_blank"
                    >
                      {t('Playground')}
                    </Button>
                  )}
                  {hasAccessTokenCapability && (
                    <Button
                      onClick={() => setDisplayTokenCreation(true)}
                    >
                      {t('Generate Token')}
                    </Button>
                  )}
                </Stack>
                <TokenList node={me} />
              </Stack>
            </Card>
          </Box>
          {settings.xtm_hub_registration_status === 'registered' && settings.xtm_hub_available_news_feed_types?.length > 0 && (
            <ProfileOverviewNewsFeed
              availableNewsFeedTypes={settings.xtm_hub_available_news_feed_types}
              unsubscribedNewsFeedTypes={me.unsubscribed_news_feed_types}
              onSubmitField={handleSubmitField}
            />
          )}
        </Box>
      </Box>
    </Box>
  );
};

ProfileOverviewComponent.propTypes = {
  theme: PropTypes.object,
  t: PropTypes.func,
  me: PropTypes.object,
  about: PropTypes.object,
  settings: PropTypes.object,
  themes: PropTypes.object,
};

const ProfileOverview = createFragmentContainer(ProfileOverviewComponent, {
  me: graphql`
    fragment ProfileOverview_me on MeUser {
      id
      name
      user_email
      external
      firstname
      lastname
      language
      theme
      otp_activated
      otp_qr
      description
      unit_system
      submenu_show_icons
      submenu_auto_collapse
      monochrome_labels
      unsubscribed_news_feed_types
      personal_notifiers {
        id
        name
      }
      objectOrganization {
        edges {
          node {
            name
          }
        }
      }
      ...TokenList_node
    }
  `,
  about: graphql`
    fragment ProfileOverview_about on AppInfo {
      version
    }
  `,
  settings: graphql`
    fragment ProfileOverview_settings on Settings {
      otp_mandatory
      platform_notifier_auto_trigger_assignee
      xtm_hub_registration_status
      xtm_hub_available_news_feed_types
    }
  `,
});

export default inject18n(ProfileOverview);
