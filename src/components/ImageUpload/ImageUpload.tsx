import React, { useCallback, useState } from 'react';
import {
  Box,
  Paper,
  Typography,
  IconButton,
  CircularProgress,
  Alert,
} from '@mui/material';
import {
  CloudUpload,
  Delete,
} from '@mui/icons-material';
import { useDropzone } from 'react-dropzone';
import { uploadToCloudinary } from '../../config/cloudinary';

interface ImageUploadProps {
  onUpload: (url: string) => void;
  onUploadStart?: () => void;
  onUploadError?: (error: string) => void;
  onRemove?: () => void;
  currentImage?: string;
  multiple?: boolean;
  maxFiles?: number;
  label?: string;
  disabled?: boolean;
}

const ImageUpload: React.FC<ImageUploadProps> = ({
  onUpload,
  onUploadStart,
  onUploadError,
  onRemove,
  currentImage,
  multiple = false,
  maxFiles = 1,
  label = 'Upload Image',
  disabled = false,
}) => {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [preview, setPreview] = useState<string | null>(currentImage || null);
  const [uploadProgress, setUploadProgress] = useState(0);

  const onDrop = useCallback(
    async (acceptedFiles: File[]) => {
      if (acceptedFiles.length === 0 || disabled) return;

      setError(null);
      setUploading(true);
      setUploadProgress(0);
      
      if (onUploadStart) {
        onUploadStart();
      }

      try {
        const file = acceptedFiles[0];
        
        // Validate file type
        if (!file.type.startsWith('image/')) {
          throw new Error('Please upload an image file');
        }
        
        // Validate file size (max 5MB)
        if (file.size > 5 * 1024 * 1024) {
          throw new Error('Image size must be less than 5MB');
        }

        // Show preview immediately
        const reader = new FileReader();
        reader.onloadend = () => {
          setPreview(reader.result as string);
        };
        reader.readAsDataURL(file);

        // Upload to Cloudinary
        const url = await uploadToCloudinary(file);
        console.log('Upload successful, URL:', url);
        setUploadProgress(100);
        setPreview(url);
        onUpload(url);
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Failed to upload image';
        setError(errorMessage);
        setPreview(currentImage || null);
        if (onUploadError) {
          onUploadError(errorMessage);
        }
        console.error('Upload error:', err);
      } finally {
        setUploading(false);
      }
    },
    [onUpload, onUploadStart, onUploadError, currentImage, disabled]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png', '.gif', '.webp', '.bmp'],
    },
    maxFiles,
    multiple,
    disabled: uploading || disabled,
  });

  const handleRemove = () => {
    setPreview(null);
    setError(null);
    if (onRemove) onRemove();
  };

  return (
    <Box>
      {!preview ? (
        <Paper
          {...getRootProps()}
          sx={{
            p: 3,
            textAlign: 'center',
            cursor: disabled ? 'not-allowed' : 'pointer',
            border: '2px dashed',
            borderColor: error ? 'error.main' : isDragActive ? 'primary.main' : 'grey.300',
            backgroundColor: error ? 'error.light' : isDragActive ? 'primary.light' : 'grey.50',
            transition: 'all 0.3s',
            opacity: disabled ? 0.6 : 1,
            '&:hover': {
              borderColor: disabled ? 'grey.300' : error ? 'error.main' : 'primary.main',
              backgroundColor: disabled ? 'grey.50' : error ? 'error.light' : 'primary.light',
            },
          }}
        >
          <input {...getInputProps()} disabled={disabled} />
          {uploading ? (
            <Box sx={{ py: 2 }}>
              <CircularProgress size={40} />
              <Typography variant="body2" sx={{ mt: 1 }}>
                Uploading... {uploadProgress}%
              </Typography>
            </Box>
          ) : (
            <>
              <CloudUpload sx={{ fontSize: 48, color: error ? 'error.main' : 'grey.400' }} />
              <Typography variant="body1" sx={{ mt: 1, color: error ? 'error.main' : 'inherit' }}>
                {error || (isDragActive ? 'Drop the image here' : label)}
              </Typography>
              <Typography variant="caption" color="text.secondary" display="block">
                Drag & drop or click to browse
              </Typography>
              <Typography variant="caption" color="text.secondary" display="block">
                Supported: JPG, PNG, GIF, WEBP (Max 5MB)
              </Typography>
            </>
          )}
        </Paper>
      ) : (
        <Box sx={{ position: 'relative' }}>
          <img
            src={preview}
            alt="Uploaded preview"
            style={{
              width: '100%',
              maxHeight: 300,
              objectFit: 'cover',
              borderRadius: 8,
            }}
          />
          <Box
            sx={{
              position: 'absolute',
              top: 8,
              right: 8,
              display: 'flex',
              gap: 1,
            }}
          >
            <IconButton
              onClick={handleRemove}
              sx={{
                backgroundColor: 'rgba(0,0,0,0.6)',
                color: 'white',
                '&:hover': {
                  backgroundColor: 'rgba(0,0,0,0.8)',
                },
              }}
              disabled={uploading || disabled}
            >
              <Delete />
            </IconButton>
          </Box>
          {uploading && (
            <Box
              sx={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                backgroundColor: 'rgba(0,0,0,0.5)',
                borderRadius: 1,
              }}
            >
              <CircularProgress color="inherit" />
            </Box>
          )}
        </Box>
      )}

      {error && !uploading && (
        <Alert severity="error" sx={{ mt: 2 }}>
          {error}
        </Alert>
      )}
    </Box>
  );
};

export default ImageUpload;
