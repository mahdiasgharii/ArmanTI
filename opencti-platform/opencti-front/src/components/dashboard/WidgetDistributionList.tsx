import React from 'react';
import { ListItemButton } from '@mui/material';
import List from '@mui/material/List';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import { useTheme } from '@mui/styles';
import { Link } from 'react-router-dom';
import { getMainRepresentative } from '../../utils/defaultRepresentatives';
import ItemIcon from '../ItemIcon';
import type { Theme } from '../Theme';
import { useFormatter } from '../i18n';
import { useComputeLink } from '../../utils/hooks/useAppData';

interface WidgetDistributionListProps {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  data: any[];
  hasSettingAccess?: boolean;
  overflow?: string;
  publicWidget?: boolean;
}

const WidgetDistributionList = ({
  data,
  hasSettingAccess = false,
  overflow = 'auto',
  publicWidget = false,
}: WidgetDistributionListProps) => {
  const theme = useTheme<Theme>();
  const { n } = useFormatter();
  const computeLink = useComputeLink();
  const maxValue = data.length > 0 ? Math.max(...data.map((d) => d.value)) : 0;

  return (
    <div
      id="container"
      style={{
        width: '100%',
        height: '100%',
        paddingBottom: 10,
        marginBottom: 10,
        overflow,
      }}
    >
      <List style={{ marginTop: -10 }}>
        {data.map((entry, key) => {
          const label = getMainRepresentative(entry.entity) || entry.label;

          let link: string | undefined;
          if (!publicWidget && (entry.type !== 'User' || hasSettingAccess)) {
            const node: {
              id: string;
              entity_type: string;
              relationship_type?: string;
              from?: { entity_type: string; id: string };
            } = {
              id: entry.id,
              entity_type: entry.type,
            };
            link = entry.id && entry.label !== 'Restricted' ? computeLink(node) : undefined;
          }
          let linkProps = {};
          if (link) {
            linkProps = {
              component: Link,
              to: link,
            };
          }
          const cursorStyle = link ? 'pointer' : 'default';
          const hoverStyle = !link ? { '&.MuiListItemButton-root:hover': { backgroundColor: 'transparent' } } : {};

          return (
            <ListItemButton
              key={entry.id ?? entry.label}
              dense={true}
              className="noDrag"
              divider={true}
              disableRipple={publicWidget || !link}
              {...linkProps}
              sx={{
                height: 50,
                minHeight: 50,
                maxHeight: 50,
                paddingRight: 0,
                position: 'relative',
                cursor: cursorStyle,
                fontFamily: '"Peyda", sans-serif',
                '& .MuiListItemText-primary': {
                  fontSize: '0.875rem',
                  color: 'var(--ravin-text)',
                },
                '&.MuiListItemButton-root': {
                  borderBottom: '1px solid var(--ravin-border)',
                },
                '&.MuiListItemButton-root:hover': {
                  backgroundColor: 'var(--ravin-surface-2)',
                },
                ...hoverStyle,
              }}
              style={overflow === 'hidden' && key === data.length - 1 ? { borderBottom: 0 } : {}}
            >
              <ListItemIcon>
                <ItemIcon
                  color={
                    theme.palette.mode === 'light'
                    && entry.color === '#ffffff'
                      ? '#000000'
                      : entry.color
                  }
                  type={entry.id ? entry.type : 'default'}
                />
              </ListItemIcon>
              <ListItemText
                primary={(
                  <div
                    style={{
                      whiteSpace: 'nowrap',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      paddingRight: 10,
                    }}
                  >
                    {label}
                  </div>
                )}
              />
              <div
                style={{
                  float: 'right',
                  marginRight: 20,
                  fontSize: theme.typography.subtitle2.fontSize,
                  fontWeight: 500,
                  color: 'var(--ravin-text)',
                  fontVariantNumeric: 'tabular-nums',
                }}
              >
                {n(entry.value)}
              </div>
              {maxValue > 0 && (
                <div
                  style={{
                    position: 'absolute',
                    bottom: 0,
                    left: 0,
                    height: 1,
                    width: `${(entry.value / maxValue) * 100}%`,
                    backgroundColor: 'var(--ravin-border-strong)',
                  }}
                />
              )}
            </ListItemButton>
          );
        })}
      </List>
    </div>
  );
};

export default WidgetDistributionList;
