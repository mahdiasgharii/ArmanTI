import React from 'react';
import { compose, includes, map } from 'ramda';
import * as PropTypes from 'prop-types';
import Alert from '@mui/material/Alert';
import AlertTitle from '@mui/material/AlertTitle';
import { graphql } from 'react-relay';
import { Link } from 'react-router-dom';
import ErrorNotFound from '../../components/ErrorNotFound';
import { useFormatter } from '../../components/i18n';
import { commitMutation } from '../../relay/environment';
import withRouter from '../../utils/compat_router/withRouter';

// --- Region UI errors components
// -------------------------------

// Highest level of error catching, do not rely on any tierce (intl, theme, ...) pure fallback
export const HighLevelError = () => (
  <div data-impeccable-variants="00d6c9a4" data-impeccable-variant-count="3" style={{ display: "contents" }}>
    {/* impeccable-variants-start 00d6c9a4 */}
    {/* Original */}
    <div data-impeccable-variant="original">
      <Alert severity="error">An unknown error occurred. Please contact your administrator or OpenCTI maintainers</Alert>
    </div>
    {/* Variants: insert below this line */}
    {/* Variant 1: Terminal diagnostic strip */}
    <div data-impeccable-variant="1">
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
        padding: '12px 16px',
        backgroundColor: '#141414',
        borderRadius: '4px',
        borderBottom: '2px solid #F20F0F',
        fontFamily: 'Consolas, monaco, monospace',
        fontSize: '13px',
        color: '#FFFFFF',
      }}>
        <span style={{
          width: '8px',
          height: '8px',
          borderRadius: '50%',
          backgroundColor: '#F20F0F',
          flexShrink: 0,
          boxShadow: '0 0 8px rgba(242, 15, 15, 0.6)',
        }} />
        <span style={{ fontWeight: 400, lineHeight: 1.5 }}>
          <span style={{ color: '#F20F0F', fontWeight: 600 }}>System error</span>
          <span style={{ color: '#848592', margin: '0 8px' }}>—</span>
          An unknown error occurred. Please contact your administrator or OpenCTI maintainers
        </span>
      </div>
    </div>
    {/* Variant 2: Structured error panel */}
    <div data-impeccable-variant="2">
      <div style={{
        padding: '16px 20px',
        backgroundColor: '#141414',
        borderRadius: '4px',
        borderTop: '1px solid #F20F0F',
        borderLeft: '1px solid #262626',
        borderRight: '1px solid #262626',
        borderBottom: '1px solid #262626',
      }}>
        <div style={{
          display: 'flex',
          alignItems: 'flex-start',
          gap: '12px',
        }}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" style={{ flexShrink: 0, marginTop: 2 }}>
            <path d="M12 2L1 21h22L12 2z" stroke="#F20F0F" strokeWidth="2" strokeLinejoin="round" />
            <path d="M12 9v5" stroke="#F20F0F" strokeWidth="2" strokeLinecap="round" />
            <circle cx="12" cy="17.5" r="1.2" fill="#F20F0F" />
          </svg>
          <div>
            <div style={{
              fontFamily: '"Geologica", sans-serif',
              fontSize: '14px',
              fontWeight: 600,
              color: '#F20F0F',
              marginBottom: '4px',
              textTransform: 'lowercase',
            }}>
              System error
            </div>
            <div style={{
              fontFamily: '"IBM Plex Sans", sans-serif',
              fontSize: '14px',
              fontWeight: 400,
              color: '#FFFFFF',
              lineHeight: 1.5,
            }}>
              An unknown error occurred. Please contact your administrator or OpenCTI maintainers
            </div>
          </div>
        </div>
      </div>
    </div>
    {/* Variant 3: Compact alert bar */}
    <div data-impeccable-variant="3">
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: '10px',
        padding: '10px 16px',
        backgroundColor: 'rgba(242, 15, 15, 0.08)',
        borderRadius: '4px',
        border: '1px solid rgba(242, 15, 15, 0.3)',
      }}>
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" style={{ flexShrink: 0 }}>
          <circle cx="12" cy="12" r="10" stroke="#F20F0F" strokeWidth="2" />
          <path d="M12 7v6" stroke="#F20F0F" strokeWidth="2" strokeLinecap="round" />
          <circle cx="12" cy="16.5" r="1" fill="#F20F0F" />
        </svg>
        <span style={{
          fontFamily: '"IBM Plex Sans", sans-serif',
          fontSize: '14px',
          fontWeight: 400,
          color: '#FFFFFF',
          lineHeight: 1.4,
        }}>
          An unknown error occurred. Please contact your administrator or OpenCTI maintainers
        </span>
      </div>
    </div>
    {/* impeccable-variants-end 00d6c9a4 */}
  </div>
);

// Really simple error display
export const SimpleError = () => {
  const { t_i18n } = useFormatter();

  return (
    <div style={{ paddingTop: 10 }}>
      <Alert severity="error">
        <span style={{ marginRight: 10 }}>
          {t_i18n(
            '',
            {
              id: 'An unknown error occurred. Please provide a support package to your administrator or OpenCTI maintainers',
              values: { link_support_package: <Link to="/dashboard/settings/experience">{t_i18n('support package')}</Link> },
            },
          )}
        </span>
      </Alert>
    </div>
  );
};

// Custom warning message display
export const DedicatedWarning = ({ title, description }) => (
  <Alert severity="warning">
    <AlertTitle>{title}</AlertTitle>
    {description}
  </Alert>
);

// 404
export const NoMatch = () => <ErrorNotFound />;

// --- End region
// --------------

// Mutation to send the frontend error to the backend.
const frontendErrorLogMutation = graphql`
  mutation ErrorFrontendLogMutation($message: String!, $codeStack: String, $componentStack: String) {
    frontendErrorLog(message: $message, codeStack: $codeStack, componentStack: $componentStack)
  }
`;

class ErrorBoundaryComponent extends React.Component {
  state = { error: null };

  static getDerivedStateFromError(error) {
    // Update state so the next render will show the fallback UI.
    return { error };
  }

  componentDidCatch(error, errorInfo) {
    try {
      const isNetworkError = this.state.error?.res;
      if (!isNetworkError) {
        // If direct javascript error, sent the error for back logging
        commitMutation({
          mutation: frontendErrorLogMutation,
          variables: {
            message: String(error),
            codeStack: error.stack,
            componentStack: errorInfo.componentStack,
          },
        });
      }
    } catch {
      // If error fail to be reported, do nothing
    }
  }

  componentDidUpdate(prevProps, _prevState) {
    // Reset the error state when browsing
    if (prevProps.location.pathname !== this.props.location.pathname) {
      this.setState({ error: null });
    }
  }

  render() {
    if (this.state.error) {
      const baseErrors = this.state.error.res?.errors ?? [];
      const retroErrors = this.state.error.data?.res?.errors ?? [];
      const types = map((e) => e.extensions.code, [...baseErrors, ...retroErrors]);
      // Specific error catching
      if (includes('COMPLEX_SEARCH_ERROR', types)) {
        return <DedicatedWarning title="Complex search" description="Your search have too much terms to be executed. Please limit the number of words or the complexity" />;
      }
      // IP whitelist block must redirect to login page
      if (includes('IP_FORBIDDEN', types)) {
        throw this.state.error;
      }
      // Access error must be forwarded
      if (includes('FORBIDDEN_ACCESS', types)) {
        return <ErrorNotFound />;
      }
      if (includes('RESOURCE_NOT_FOUND', types)) {
        return this.props.resNotFoundDisplay || <ErrorNotFound />;
      }
      if (includes('AUTH_REQUIRED', types)) {
        throw this.state.error;
      }
      const DisplayComponent = this.props.display || SimpleError;
      return <DisplayComponent />;
    }
    return this.props.children;
  }
}

ErrorBoundaryComponent.propTypes = {
  resNotFoundDisplay: PropTypes.object,
  display: PropTypes.object,
  children: PropTypes.node,
};
export const ErrorBoundary = compose(withRouter)(ErrorBoundaryComponent);

export const boundaryWrapper = (Component) => {
  return (
    <ErrorBoundary>
      <Component />
    </ErrorBoundary>
  );
};
