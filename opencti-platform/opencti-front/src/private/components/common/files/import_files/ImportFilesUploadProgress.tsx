import React from 'react';
import { Alert, Box, LinearProgress, List, ListItem, Typography } from '@mui/material';
import { XCircle as CancelOutlined, CheckCircle as CheckCircleOutlined, FileUp as UploadFileOutlined } from 'lucide-react';
import { useImportFilesContext } from '@components/common/files/import_files/ImportFilesContext';
import { useFormatter } from '../../../../../components/i18n';

interface ImportFilesUploadProgressProps {
  currentCount: number;
  totalCount: number;
  uploadedFiles: { name: string; status?: 'success' | 'error' }[];
  BulkResult: React.FC<{ variablesToString: (variables: { file: File }) => string }>;
}

const ImportFilesUploadProgress: React.FC<ImportFilesUploadProgressProps> = ({
  currentCount,
  totalCount,
  uploadedFiles,
  BulkResult,
}) => {
  const { uploadStatus } = useImportFilesContext();
  const { t_i18n } = useFormatter();
  const hasError = uploadStatus === 'error';
  const errorCount = uploadedFiles.filter((f) => f.status === 'error').length;
  const successCount = uploadedFiles.filter((f) => f.status === 'success').length;

  return (
    <div style={{ display: 'flex', height: '100%', justifyContent: 'center', flexDirection: 'column' }}>
      {hasError && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {t_i18n('Some files failed to upload ({errorCount} of {totalCount})', { values: { errorCount, totalCount } })}
        </Alert>
      )}
      <Box sx={{ display: 'flex', gap: '12px', alignItems: 'center', mb: 3 }}>
        <LinearProgress
          variant="buffer"
          sx={{
            flex: 1,
            backgroundColor: 'color-mix(in srgb, var(--ravin-surface-2) 40%, transparent)',
            borderRadius: '4px',
            '& .MuiLinearProgress-bar': {
              backgroundColor: hasError ? 'var(--ravin-error)' : 'var(--ravin-primary)',
            },
          }}
          value={(currentCount / totalCount) * 100}
          valueBuffer={((currentCount / totalCount) * 100) + 10}
        />
        <Typography style={{ flexShrink: 0 }}>{`${currentCount}/${totalCount}`}</Typography>
      </Box>
      <List
        sx={{
          '& .MuiListItem-root': {
            backgroundColor: 'color-mix(in srgb, var(--ravin-surface-2) 15%, transparent)',
            borderRadius: '4px',
            marginBottom: 1,
            paddingInline: 2,
            border: '1px solid color-mix(in srgb, var(--ravin-border) 30%, transparent)',
            '&:hover': {
              backgroundColor: 'color-mix(in srgb, var(--ravin-surface-2) 25%, transparent)',
            },
          },
        }}
      >
        {uploadedFiles.map((file) => (
          <ListItem
            key={file.name}
            divider
            secondaryAction={(
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                {
                  file.status === 'error' ? (
                    <CancelOutlined size={16} className="text-error" />
                  ) : (
                    <CheckCircleOutlined size={16} className={file.status === 'success' ? 'text-success' : ''} />
                  )
                }
              </Box>
            )}
          >
            <UploadFileOutlined className="text-primary" style={{ marginRight: 8 }} />
            {file.name}
          </ListItem>
        ))}
      </List>
      {(uploadStatus === 'success' || (hasError && successCount > 0)) && <BulkResult variablesToString={(v) => v.file.name} />}
    </div>
  );
};

export default ImportFilesUploadProgress;
