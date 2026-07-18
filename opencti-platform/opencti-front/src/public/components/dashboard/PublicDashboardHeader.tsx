import Typography from '@mui/material/Typography';
import InputLabel from '@mui/material/InputLabel';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { useFormatter } from '../../../components/i18n';
import type { DashboardConfig } from '../../../components/dashboard/dashboard-types';
import { buildDate } from '../../../utils/Time';
import { TOP_BAR_HEIGHT } from '../PublicTopBar';

interface PublicDashboardHeaderProps {
  title: string;
  manifestConfig: DashboardConfig;
  onChangeRelativeDate: (value: string) => void;
  onChangeStartDate: (value: string | null) => void;
  onChangeEndDate: (value: string | null) => void;
}

const PublicDashboardHeader = ({
  title,
  manifestConfig,
  onChangeRelativeDate,
  onChangeStartDate,
  onChangeEndDate,
}: PublicDashboardHeaderProps) => {
  const { t_i18n } = useFormatter();
  const { relativeDate, startDate, endDate } = manifestConfig;

  return (
    <header
      style={{
        paddingTop: `${TOP_BAR_HEIGHT + 24}px`,
        paddingInline: '24px',
        paddingBottom: '20px',
        display: 'flex',
        flexWrap: 'wrap',
        gap: '16px',
        alignItems: 'center',
        borderBottom: '1px solid var(--ravin-border)',
      }}
    >
      <Typography
        variant="h1"
        sx={{
          marginRight: '8px',
          fontFamily: '"Peyda", sans-serif',
          fontWeight: 600,
          fontSize: '22px',
          lineHeight: '1.3',
          color: 'var(--ravin-text)',
          textTransform: 'lowercase',
          '&::first-letter': { textTransform: 'uppercase' },
        }}
      >
        {title}
      </Typography>

      <FormControl
        variant="outlined"
        size="small"
        sx={{
          minWidth: 200,
          flex: '1 1 200px',
          '& .MuiOutlinedInput-root': {
            backgroundColor: 'var(--ravin-elevated)',
            borderRadius: '4px',
            '& fieldset': {
              borderColor: 'var(--ravin-border)',
            },
            '&:hover fieldset': {
              borderColor: 'var(--ravin-border-strong)',
            },
            '&.Mui-focused fieldset': {
              borderColor: 'var(--ravin-primary)',
              borderWidth: '2px',
            },
          },
          '& .MuiInputLabel-root': {
            color: 'var(--ravin-text-muted)',
            fontSize: '12px',
            fontWeight: 500,
          },
        }}
      >
        <InputLabel id="relative" variant="outlined">
          {t_i18n('Relative time')}
        </InputLabel>
        <Select
          labelId="relative"
          label={t_i18n('Relative time')}
          value={relativeDate ?? ''}
          onChange={(event) => onChangeRelativeDate(event.target.value)}
          variant="outlined"
          disabled
        >
          <MenuItem value="none">{t_i18n('None')}</MenuItem>
          <MenuItem value="days-1">{t_i18n('Last 24 hours')}</MenuItem>
          <MenuItem value="days-7">{t_i18n('Last 7 days')}</MenuItem>
          <MenuItem value="months-1">{t_i18n('Last month')}</MenuItem>
          <MenuItem value="months-3">{t_i18n('Last 3 months')}</MenuItem>
          <MenuItem value="months-6">{t_i18n('Last 6 months')}</MenuItem>
          <MenuItem value="years-1">{t_i18n('Last year')}</MenuItem>
        </Select>
      </FormControl>
      <DatePicker
        disabled
        value={buildDate(startDate)}
        label={t_i18n('Start date')}
        sx={{
          minWidth: 200,
          flex: '1 1 200px',
          '& .MuiOutlinedInput-root': {
            backgroundColor: 'var(--ravin-elevated)',
            borderRadius: '4px',
            '& fieldset': {
              borderColor: 'var(--ravin-border)',
            },
            '&:hover fieldset': {
              borderColor: 'var(--ravin-border-strong)',
            },
            '&.Mui-focused fieldset': {
              borderColor: 'var(--ravin-primary)',
              borderWidth: '2px',
            },
          },
          '& .MuiInputLabel-root': {
            color: 'var(--ravin-text-muted)',
            fontSize: '12px',
            fontWeight: 500,
          },
        }}
        disableFuture
        onChange={(value, context) => !context.validationError && onChangeStartDate(value?.toString() ?? null)}
        slotProps={{
          field: {
            clearable: true,
          },
          textField: {
            variant: 'outlined',
            size: 'small',
          },
          toolbar: {
            hidden: true,
          },
        }}
      />
      <DatePicker
        disabled
        value={buildDate(endDate)}
        label={t_i18n('End date')}
        disableFuture
        onChange={(value, context) => !context.validationError && onChangeEndDate(value?.toString() ?? null)}
        sx={{
          minWidth: 200,
          flex: '1 1 200px',
          '& .MuiOutlinedInput-root': {
            backgroundColor: 'var(--ravin-elevated)',
            borderRadius: '4px',
            '& fieldset': {
              borderColor: 'var(--ravin-border)',
            },
            '&:hover fieldset': {
              borderColor: 'var(--ravin-border-strong)',
            },
            '&.Mui-focused fieldset': {
              borderColor: 'var(--ravin-primary)',
              borderWidth: '2px',
            },
          },
          '& .MuiInputLabel-root': {
            color: 'var(--ravin-text-muted)',
            fontSize: '12px',
            fontWeight: 500,
          },
        }}
        slotProps={{
          field: {
            clearable: true,
          },
          textField: {
            variant: 'outlined',
            size: 'small',
          },
          toolbar: {
            hidden: true,
          },
        }}
      />
    </header>
  );
};

export default PublicDashboardHeader;
