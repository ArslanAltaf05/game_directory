import React from 'react';
import {
  Box,
  Paper,
  Typography,
  LinearProgress,
  IconButton,
  Button,
  CircularProgress,
} from '@mui/material';
import { Close, Download, CheckCircle, Error } from '@mui/icons-material';

interface DownloadProgressProps {
  open: boolean;
  progress: number;
  speed?: string;
  fileName?: string;
  fileSize?: string;
  status: 'downloading' | 'complete' | 'error' | 'idle';
  onClose: () => void;
  onCancel?: () => void;
}

const DownloadProgress: React.FC<DownloadProgressProps> = ({
  open,
  progress,
  speed = '0 MB/s',
  fileName = 'game.installer',
  fileSize = '50.4 MB',
  status,
  onClose,
  onCancel,
}) => {
  if (!open) return null;

  

  const getStatusIcon = () => {
    switch (status) {
      case 'complete': return <CheckCircle sx={{ fontSize: 48, color: 'success.main' }} />;
      case 'error': return <Error sx={{ fontSize: 48, color: 'error.main' }} />;
      default: return <CircularProgress size={48} />;
    }
  };

  return (
    <Paper
      sx={{
        position: 'fixed',
        bottom: 24,
        right: 24,
        width: 380,
        p: 3,
        zIndex: 9999,
        boxShadow: 8,
        borderRadius: 2,
        animation: 'slideUp 0.3s ease-out',
      }}
    >
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          {getStatusIcon()}
          <Box>
            <Typography variant="subtitle1" fontWeight="bold">
              {status === 'downloading' ? 'Downloading...' : 
               status === 'complete' ? 'Download Complete!' : 
               status === 'error' ? 'Download Failed' : 'Ready'}
            </Typography>
            <Typography variant="caption" color="text.secondary" display="block">
              {fileName}
            </Typography>
          </Box>
        </Box>
        <IconButton size="small" onClick={onClose}>
          <Close />
        </IconButton>
      </Box>

      {status === 'downloading' && (
        <>
          <Box sx={{ mb: 1 }}>
            <LinearProgress
              variant="determinate"
              value={progress}
              sx={{
                height: 8,
                borderRadius: 4,
                backgroundColor: 'grey.200',
                '& .MuiLinearProgress-bar': {
                  borderRadius: 4,
                },
              }}
            />
          </Box>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Typography variant="caption" color="text.secondary">
              {progress}% - {speed}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              {fileSize}
            </Typography>
          </Box>
          {onCancel && (
            <Button
              size="small"
              variant="outlined"
              color="error"
              onClick={onCancel}
              sx={{ mt: 1 }}
            >
              Cancel Download
            </Button>
          )}
        </>
      )}

      {status === 'complete' && (
        <Button
          variant="contained"
          fullWidth
          startIcon={<Download />}
          sx={{ mt: 2 }}
          onClick={() => {
            // Open the downloaded file or show location
            alert('File downloaded successfully!');
            onClose();
          }}
        >
          Open File
        </Button>
      )}

      {status === 'error' && (
        <Button
          variant="contained"
          color="error"
          fullWidth
          sx={{ mt: 2 }}
          onClick={onClose}
        >
          Try Again
        </Button>
      )}

      <style>
        {`
          @keyframes slideUp {
            from {
              opacity: 0;
              transform: translateY(20px);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }
        `}
      </style>
    </Paper>
  );
};

export default DownloadProgress;
