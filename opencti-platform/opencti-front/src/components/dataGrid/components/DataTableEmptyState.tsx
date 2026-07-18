import Box from '@mui/material/Box';

type DataTableEmptyStateProps = {
  message: string;
};

const DataTableEmptyState = ({ message }: DataTableEmptyStateProps) => {
  return (
    <Box sx={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      width: '100%',
      minHeight: '200px',
      textAlign: 'center',
      color: 'var(--ravin-text-muted)',
      position: 'relative',
      zIndex: 2,
    }}
    >
      {message}
    </Box>
  );
};

export default DataTableEmptyState;
