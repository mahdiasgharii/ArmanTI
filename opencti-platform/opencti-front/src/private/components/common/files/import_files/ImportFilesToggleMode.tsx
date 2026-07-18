import { ImportMode, useImportFilesContext } from '@components/common/files/import_files/ImportFilesContext';
import { FileText as DescriptionOutlined, Route as RouteOutlined, FileUp as UploadFileOutlined } from 'lucide-react';
import { Box, CardContent } from '@mui/material';
import Typography from '@mui/material/Typography';
import React from 'react';
import Card from '../../../../../components/common/card/Card';
import { useFormatter } from '../../../../../components/i18n';

const ImportFilesToggleMode = () => {
  const { t_i18n } = useFormatter();
  const { setActiveStep, importMode, setImportMode, entityId, isForcedImportToDraft } = useImportFilesContext();

  const modes: { mode: ImportMode; title: string; description: string; icon: React.ReactElement }[] = [
    {
      mode: 'manual',
      title: t_i18n('Step-by-Step Import'),
      description: t_i18n('A guided workflow that streamlines files import, selection of connectors and allows the creation of a workbench or draft for review before final import'),
      icon: <RouteOutlined size={40} style={{ transform: 'rotate(90deg)' }} className="text-primary" />,
    },
  ];

  if (!isForcedImportToDraft) {
    modes.unshift({
      mode: 'auto',
      title: t_i18n('Direct/Automatic Import'),
      description: t_i18n('Quick import with no configuration needed. Just upload your files and the platform takes care of the rest. Perfect if your file follows a standard format (STIX2.1, MISP).'),
      icon: <UploadFileOutlined size={40} className="text-primary" />,
    });
  }

  // Add form mode only when entityId is not defined (global usage)
  if (!entityId) {
    modes.push({
      mode: 'form',
      title: t_i18n('Import using a Form'),
      description: t_i18n('Use a structured form to create and import data. Select from available forms and fill in the required information to generate properly formatted entities.'),
      icon: <DescriptionOutlined size={40} className="text-primary" />,
    });
  }

  const onSelectMode = (mode: ImportMode) => {
    setImportMode(mode);
    setActiveStep(1);
  };

  return (
    <Box
      sx={{
        display: 'grid',
        gridTemplateColumns: `repeat(${modes.length}, 1fr)`,
        gap: 2,
      }}
    >
      {modes.map(({ mode, title, description, icon }) => {
        const isSelected = importMode === mode;
        return (
          <Card
            aria-label={title}
            variant="outlined"
            onClick={() => onSelectMode(mode)}
            key={mode}
            sx={{
              minWidth: 0,
              textAlign: 'center',
              borderRadius: '8px',
              backgroundColor: isSelected
                ? 'color-mix(in srgb, var(--ravin-primary) 6%, color-mix(in srgb, var(--ravin-surface-2) 15%, transparent))'
                : 'color-mix(in srgb, var(--ravin-surface-2) 12%, transparent)',
              borderColor: isSelected
                ? 'var(--ravin-primary)'
                : 'color-mix(in srgb, var(--ravin-border) 50%, transparent)',
              transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
              '&:hover': {
                borderColor: 'var(--ravin-border-strong)',
                backgroundColor: 'color-mix(in srgb, var(--ravin-surface-2) 25%, transparent)',
              },
              ...(isSelected ? {
                boxShadow: '0 0 0 1px var(--ravin-primary), 0 0 20px color-mix(in srgb, var(--ravin-primary) 12%, transparent)',
              } : {}),
            }}
          >
            <CardContent
              sx={{
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: 1.5,
              }}
            >
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  width: 48,
                  height: 48,
                  borderRadius: '8px',
                  background: isSelected
                    ? 'color-mix(in srgb, var(--ravin-primary) 12%, transparent)'
                    : 'color-mix(in srgb, var(--ravin-surface-2) 30%, transparent)',
                  border: '1px solid',
                  borderColor: isSelected
                    ? 'color-mix(in srgb, var(--ravin-primary) 30%, transparent)'
                    : 'color-mix(in srgb, var(--ravin-border) 40%, transparent)',
                  transition: 'all 0.2s ease',
                }}
              >
                {icon}
              </Box>
              <Typography
                gutterBottom
                variant="h2"
                sx={{
                  marginBlock: 0,
                  color: isSelected ? 'var(--ravin-primary)' : 'var(--ravin-text)',
                }}
              >
                {title}
              </Typography>
              <Typography
                variant="body1"
                sx={{
                  color: 'var(--ravin-text-muted)',
                  fontSize: '0.85rem',
                  lineHeight: 1.5,
                }}
              >
                {description}
              </Typography>
            </CardContent>
          </Card>
        );
      })}
    </Box>
  );
};

export default ImportFilesToggleMode;
