import ApexCharts from 'apexcharts';
import { CSSProperties, FunctionComponent, ReactNode } from 'react';
import { Card as ShadcnCard, CardTitle } from '../ui/card';
import Label from '../common/label/Label';
import ChartExportPopover from '../../private/components/common/charts/ChartExportPopover';
import { ErrorBoundary } from '@components/Error';
import WidgetNoData from './WidgetNoData';
import Stack from '@mui/material/Stack';
import { useTheme } from '@mui/styles';
import type { Theme } from '../Theme';
import { hexToRGB } from '../../utils/Colors';
import { useFormatter } from '../i18n';
import Tag from '@common/tag/Tag';
import { AlertTriangle } from 'lucide-react';
import { Tooltip } from '@mui/material';
interface WidgetContainerProps {
  children: ReactNode;
  height?: CSSProperties['height'];
  title?: string;
  variant?: string;
  padding?: 'none' | 'small' | 'medium' | 'horizontal' | 'default';
  chart?: ApexCharts;
  action?: ReactNode;
  showPreviewTag?: boolean;
  warning?: string;
}

const WidgetContainer: FunctionComponent<WidgetContainerProps> = ({
  children,
  height,
  title,
  variant,
  padding,
  chart,
  action,
  showPreviewTag,
  warning,
}) => {
  const theme = useTheme<Theme>();
  const { t_i18n } = useFormatter();
  const previewColor = theme.palette.designSystem.tertiary.orange['400'];
  const formattedTitle = warning
    ? (
        <div style={{ display: 'flex', alignItems: 'center', gap: theme.spacing(0.5) }}>
          {title}
          <Tooltip
            title={warning}
          >
            <AlertTriangle
              size={15}
              color={theme.palette.designSystem.alert.warning.primary}
            />
          </Tooltip>
        </div>
      )
    : title;
  const paddingClass = padding === 'none' ? '' : padding === 'small' ? 'p-2' : padding === 'horizontal' ? 'px-4 py-1' : padding === 'medium' ? 'px-4 py-3' : 'p-4';
  return (
    <div style={{ height: height || '100%' }}>
      {variant !== 'inLine' && variant !== 'inEntity'
        ? (
            <ShadcnCard className="flex h-full flex-col p-4">
              {(title || action) && (
                <div className="flex flex-row items-center justify-between pb-2">
                  <CardTitle>
                    {showPreviewTag ? (
                      <Stack direction="row" alignItems="center" gap={1}>
                        {formattedTitle}
                        <Tag
                          label={t_i18n('Preview data')}
                          size="small"
                          sx={{
                            backgroundColor: hexToRGB(previewColor, 0.1),
                            color: previewColor,
                            border: `1px solid ${previewColor}`,
                            fontWeight: 700,
                            fontSize: '0.65rem',
                          }}
                        />
                      </Stack>
                    ) : formattedTitle}
                  </CardTitle>
                  <div className="flex items-center gap-1">
                    {chart && <ChartExportPopover chart={chart} />}
                    {action}
                  </div>
                </div>
              )}
              <div className={`flex-1 ${paddingClass}`}>
                <ErrorBoundary resNotFoundDisplay={<WidgetNoData />}>
                  {children}
                </ErrorBoundary>
              </div>
            </ShadcnCard>
        )
        : (
            <>
              {title && <Label>{title}</Label>}
              <ErrorBoundary resNotFoundDisplay={<WidgetNoData />}>
                {children}
              </ErrorBoundary>
            </>
        )
      }
    </div>
  );
};

export default WidgetContainer;
