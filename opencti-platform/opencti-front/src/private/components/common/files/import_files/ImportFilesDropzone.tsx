import { CloudUpload as CloudUploadOutlined } from 'lucide-react';
import { Box, Typography } from '@mui/material';
import React, { useState } from 'react';
import Button from '@common/button/Button';
import { useImportFilesContext } from '@components/common/files/import_files/ImportFilesContext';
import { useFormatter } from '../../../../../components/i18n';

interface ImportFilesDropzoneProps {
  fullSize?: boolean;
  onChange: (files: File[]) => void;
  openFreeText?: (value: boolean) => void;
}

const ImportFilesDropzone = ({
  fullSize = true,
  onChange,
  openFreeText,
}: ImportFilesDropzoneProps) => {
  const { t_i18n } = useFormatter();
  const [isDragging, setIsDragging] = useState(false);
  const { guessMimeType } = useImportFilesContext();

  const processNewFiles = async (files: FileList) => {
    const newFiles = await Promise.all(Array.from(files).map(async (file) => {
      const guessedType = await guessMimeType(file.name);
      return new File([file], file.name, {
        type: guessedType || file.type,
        lastModified: file.lastModified,
      });
    }));
    onChange(newFiles);
  };

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      await processNewFiles(event.target.files);
    }
  };

  const handleDrop = async (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setIsDragging(false);
    if (event.dataTransfer.files) {
      await processNewFiles(event.dataTransfer.files);
    }
  };

  return (
    <Box
      onDragOver={(e) => {
        e.preventDefault();
        setIsDragging(true);
      }}
      onDragLeave={() => setIsDragging(false)}
      onDrop={handleDrop}
      sx={{
        height: fullSize ? 280 : 140,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        gap: 2,
        background: isDragging
          ? 'color-mix(in srgb, var(--ravin-primary) 10%, color-mix(in srgb, var(--ravin-surface-2) 12%, transparent))'
          : 'color-mix(in srgb, var(--ravin-surface-2) 12%, transparent)',
        borderRadius: '8px',
        borderColor: isDragging
          ? 'var(--ravin-primary)'
          : 'color-mix(in srgb, var(--ravin-border) 50%, transparent)',
        borderWidth: isDragging ? '2px' : '1px',
        borderStyle: 'dashed',
        boxSizing: 'border-box',
        padding: isDragging ? '19px' : '20px',
        textAlign: 'center',
        marginBottom: 2,
        cursor: 'default',
        transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
        position: 'relative',
        overflow: 'hidden',
        '&::before': isDragging ? {
          content: '""',
          position: 'absolute',
          inset: 0,
          background: 'radial-gradient(circle at center, color-mix(in srgb, var(--ravin-primary) 8%, transparent) 0%, transparent 70%)',
          pointerEvents: 'none',
        } : {},
        ...(isDragging ? {
          boxShadow: '0 0 0 1px var(--ravin-primary) inset, 0 0 20px color-mix(in srgb, var(--ravin-primary) 12%, transparent)',
        } : {}),
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
          background: isDragging
            ? 'color-mix(in srgb, var(--ravin-primary) 12%, transparent)'
            : 'color-mix(in srgb, var(--ravin-surface-2) 30%, transparent)',
          border: '1px solid',
          borderColor: isDragging
            ? 'color-mix(in srgb, var(--ravin-primary) 30%, transparent)'
            : 'color-mix(in srgb, var(--ravin-border) 40%, transparent)',
          transition: 'all 0.2s ease',
          ...(isDragging ? {
            transform: 'scale(1.08)',
          } : {}),
        }}
      >
        <CloudUploadOutlined
          style={{
            color: isDragging ? 'var(--ravin-primary)' : 'var(--ravin-text-muted)',
            transition: 'color 0.2s ease',
          }}
          size={24}
        />
      </Box>
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5, alignItems: 'center' }}>
        <Typography
          variant="h3"
          sx={{
            marginBlock: 0,
            color: isDragging ? 'var(--ravin-primary)' : 'var(--ravin-text)',
            transition: 'color 0.2s ease',
          }}
        >
          {isDragging ? t_i18n('Release to upload') : t_i18n('Drag and drop files to import')}
        </Typography>
        <Typography variant="body2" sx={{ color: 'var(--ravin-text-muted)' }}>
          {t_i18n('or')}
        </Typography>
      </Box>
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          gap: 1.5,
          paddingTop: 1,
        }}
      >
        <Button component="label" size="small">
          {t_i18n('Browse files')}
          <input type="file" hidden multiple onChange={handleFileChange} />
        </Button>
        {openFreeText && (
          <Button variant="secondary" color="primary" component="label" size="small" onClick={() => openFreeText?.(true)}>
            {t_i18n('Copy/paste mode')}
          </Button>
        )}
      </Box>
    </Box>
  );
};

export default ImportFilesDropzone;
