import React, { useState, useEffect } from 'react';
import {
  Paper,
  Typography,
  TextField,
  Button,
  Box,
  FormControlLabel,
  Switch,
  Grid,
  Chip,
  Divider,
  Alert,
  CircularProgress,
  InputAdornment,
} from '@mui/material';
import { Add, CloudDownload } from '@mui/icons-material';
import type { Game } from '../../types';
import ImageUpload from '../ImageUpload/ImageUpload';

interface GameFormProps {
  onSubmit: (game: Omit<Game, 'id'>) => void;
  initialData?: Game;
  onCancel?: () => void;
  loading?: boolean;
}

const GameForm: React.FC<GameFormProps> = ({ 
  onSubmit, 
  initialData, 
  onCancel,
  loading = false 
}) => {
  const [formData, setFormData] = useState<Omit<Game, 'id'>>({
    title: '',
    description: '',
    category: '',
    rating: 0,
    imageUrl: '',
    releaseDate: '',
    developer: '',
    price: 0,
    isFeatured: false,
    version: '',
    fileSize: '',
    downloads: 0,
    packageName: '',
    platforms: [],
    socialLinks: [],
    reviews: [],
    totalReviews: 0,
    ratingDistribution: {
      fiveStar: 0,
      fourStar: 0,
      threeStar: 0,
      twoStar: 0,
      oneStar: 0,
    },
    downloadUrl: '',
  });

  const [socialPlatform, setSocialPlatform] = useState('');
  const [socialUrl, setSocialUrl] = useState('');
  const [platformInput, setPlatformInput] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [imageUploading, setImageUploading] = useState(false);

  useEffect(() => {
    if (initialData) {
      const { id, ...rest } = initialData;
      setFormData({
        ...rest,
        downloadUrl: rest.downloadUrl || '',
      });
    }
  }, [initialData]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validation
    if (!formData.title.trim()) {
      setError('Title is required');
      return;
    }

    if (!formData.imageUrl) {
      setError('Game image is required. Please upload an image.');
      return;
    }

    // Validate download URL if provided
    if (formData.downloadUrl && !formData.downloadUrl.startsWith('http')) {
      setError('Download URL must start with http:// or https://');
      return;
    }

    console.log('Submitting game data with downloadUrl:', formData.downloadUrl);
    console.log('Full form data:', formData);
    
    setError(null);
    onSubmit(formData);
    
    if (!initialData) {
      // Reset form but keep image URL
      const imageUrl = formData.imageUrl;
      setFormData({
        title: '',
        description: '',
        category: '',
        rating: 0,
        imageUrl: imageUrl,
        releaseDate: '',
        developer: '',
        price: 0,
        isFeatured: false,
        version: '',
        fileSize: '',
        downloads: 0,
        packageName: '',
        platforms: [],
        socialLinks: [],
        reviews: [],
        totalReviews: 0,
        ratingDistribution: {
          fiveStar: 0,
          fourStar: 0,
          threeStar: 0,
          twoStar: 0,
          oneStar: 0,
        },
        downloadUrl: '',
      });
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'number' ? parseFloat(value) || 0 : 
              type === 'checkbox' ? checked : value,
    }));
  };

  const handleImageUpload = (url: string) => {
    console.log('Image uploaded successfully:', url);
    setFormData((prev) => {
      const updated = { ...prev, imageUrl: url };
      return updated;
    });
    setError(null);
    setImageUploading(false);
  };

  const handleImageUploadStart = () => {
    setImageUploading(true);
    setError(null);
  };

  const handleImageUploadError = (err: string) => {
    setImageUploading(false);
    setError(err);
  };

  const addPlatform = () => {
    if (platformInput && !formData.platforms?.includes(platformInput)) {
      setFormData((prev) => ({
        ...prev,
        platforms: [...(prev.platforms || []), platformInput],
      }));
      setPlatformInput('');
    }
  };

  const removePlatform = (platform: string) => {
    setFormData((prev) => ({
      ...prev,
      platforms: prev.platforms?.filter((p) => p !== platform) || [],
    }));
  };

  const addSocialLink = () => {
    if (socialPlatform && socialUrl) {
      setFormData((prev) => ({
        ...prev,
        socialLinks: [...(prev.socialLinks || []), { platform: socialPlatform, url: socialUrl }],
      }));
      setSocialPlatform('');
      setSocialUrl('');
    }
  };

  const removeSocialLink = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      socialLinks: prev.socialLinks?.filter((_, i) => i !== index) || [],
    }));
  };

  return (
    <Paper sx={{ p: 3, maxHeight: '80vh', overflow: 'auto' }}>
      <Typography variant="h6" sx={{ mb: 3 }}>
        {initialData ? 'Edit Game' : 'Add New Game'}
      </Typography>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      <form onSubmit={handleSubmit}>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Title *"
              name="title"
              value={formData.title}
              onChange={handleChange}
              required
              disabled={loading || imageUploading}
            />
          </Grid>

          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              multiline
              rows={3}
              disabled={loading || imageUploading}
            />
          </Grid>

          <Grid item xs={12}>
            <Typography variant="subtitle2" gutterBottom>
              Game Image * {formData.imageUrl && '✅ Uploaded'}
            </Typography>
            <ImageUpload
              onUpload={handleImageUpload}
              onUploadStart={handleImageUploadStart}
              onUploadError={handleImageUploadError}
              currentImage={formData.imageUrl}
              onRemove={() => setFormData((prev) => ({ ...prev, imageUrl: '' }))}
              label={imageUploading ? 'Uploading...' : 'Upload Game Image'}
              disabled={loading}
            />
            {formData.imageUrl && (
              <Typography variant="caption" color="success.main" sx={{ mt: 1, display: 'block' }}>
                Image uploaded successfully!
              </Typography>
            )}
          </Grid>

          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Category"
              name="category"
              value={formData.category}
              onChange={handleChange}
              placeholder="e.g., Action, RPG"
              disabled={loading || imageUploading}
            />
          </Grid>

          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Developer"
              name="developer"
              value={formData.developer}
              onChange={handleChange}
              disabled={loading || imageUploading}
            />
          </Grid>

          <Grid item xs={12} sm={4}>
            <TextField
              fullWidth
              label="Rating (0-5)"
              name="rating"
              type="number"
              value={formData.rating}
              onChange={handleChange}
              inputProps={{ min: 0, max: 5, step: 0.1 }}
              disabled={loading || imageUploading}
            />
          </Grid>

          <Grid item xs={12} sm={4}>
            <TextField
              fullWidth
              label="Price ($)"
              name="price"
              type="number"
              value={formData.price}
              onChange={handleChange}
              inputProps={{ min: 0, step: 0.01 }}
              disabled={loading || imageUploading}
            />
          </Grid>

          <Grid item xs={12} sm={4}>
            <TextField
              fullWidth
              label="Downloads"
              name="downloads"
              type="number"
              value={formData.downloads || ''}
              onChange={handleChange}
              inputProps={{ min: 0 }}
              disabled={loading || imageUploading}
            />
          </Grid>

          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Version"
              name="version"
              value={formData.version || ''}
              onChange={handleChange}
              placeholder="e.g., 1.0.0"
              disabled={loading || imageUploading}
            />
          </Grid>

          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="File Size"
              name="fileSize"
              value={formData.fileSize || ''}
              onChange={handleChange}
              placeholder="e.g., 50.4MB"
              disabled={loading || imageUploading}
            />
          </Grid>

          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Package Name"
              name="packageName"
              value={formData.packageName || ''}
              onChange={handleChange}
              placeholder="e.g., com.example.game"
              disabled={loading || imageUploading}
            />
          </Grid>

          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Download URL (APK file link)"
              name="downloadUrl"
              value={formData.downloadUrl || ''}
              onChange={handleChange}
              placeholder="https://example.com/game.apk"
              disabled={loading || imageUploading}
              helperText="Enter the direct URL to the APK file or download page. This will enable the download button."
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <CloudDownload color={formData.downloadUrl ? 'success' : 'primary'} />
                  </InputAdornment>
                ),
              }}
            />
            {formData.downloadUrl && (
              <Typography variant="caption" color="success.main" sx={{ display: 'block', mt: 1 }}>
                ✅ Download URL set. The download button will be enabled.
              </Typography>
            )}
          </Grid>

          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Release Date"
              name="releaseDate"
              type="date"
              value={formData.releaseDate}
              onChange={handleChange}
              InputLabelProps={{ shrink: true }}
              disabled={loading || imageUploading}
            />
          </Grid>

          {/* Platforms */}
          <Grid item xs={12}>
            <Typography variant="subtitle2" gutterBottom>Platforms</Typography>
            <Box sx={{ display: 'flex', gap: 1, mb: 1 }}>
              <TextField
                fullWidth
                size="small"
                placeholder="Add platform (e.g., Android, iOS)"
                value={platformInput}
                onChange={(e) => setPlatformInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && addPlatform()}
                disabled={loading || imageUploading}
              />
              <Button variant="outlined" onClick={addPlatform} disabled={loading || imageUploading}>
                <Add />
              </Button>
            </Box>
            <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
              {formData.platforms?.map((platform) => (
                <Chip
                  key={platform}
                  label={platform}
                  onDelete={() => removePlatform(platform)}
                  disabled={loading || imageUploading}
                />
              ))}
            </Box>
          </Grid>

          {/* Social Links */}
          <Grid item xs={12}>
            <Divider sx={{ my: 2 }} />
            <Typography variant="subtitle2" gutterBottom>Social Media Links</Typography>
            <Box sx={{ display: 'flex', gap: 1, mb: 1 }}>
              <TextField
                size="small"
                placeholder="Platform"
                value={socialPlatform}
                onChange={(e) => setSocialPlatform(e.target.value)}
                sx={{ flex: 1 }}
                disabled={loading || imageUploading}
              />
              <TextField
                size="small"
                placeholder="URL"
                value={socialUrl}
                onChange={(e) => setSocialUrl(e.target.value)}
                sx={{ flex: 2 }}
                disabled={loading || imageUploading}
              />
              <Button variant="outlined" onClick={addSocialLink} disabled={loading || imageUploading}>
                <Add />
              </Button>
            </Box>
            <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
              {formData.socialLinks?.map((link, index) => (
                <Chip
                  key={index}
                  label={`${link.platform}: ${link.url}`}
                  onDelete={() => removeSocialLink(index)}
                  disabled={loading || imageUploading}
                />
              ))}
            </Box>
          </Grid>

          <Grid item xs={12}>
            <FormControlLabel
              control={
                <Switch
                  checked={formData.isFeatured}
                  onChange={handleChange}
                  name="isFeatured"
                  disabled={loading || imageUploading}
                />
              }
              label="Featured Game"
            />
          </Grid>

          <Grid item xs={12}>
            <Box sx={{ display: 'flex', gap: 2 }}>
              <Button
                type="submit"
                variant="contained"
                fullWidth
                disabled={loading || imageUploading || !formData.imageUrl}
                startIcon={loading ? <CircularProgress size={20} /> : null}
              >
                {loading ? 'Saving...' : (initialData ? 'Update Game' : 'Add Game')}
              </Button>
              {initialData && onCancel && (
                <Button
                  variant="outlined"
                  onClick={onCancel}
                  fullWidth
                  disabled={loading || imageUploading}
                >
                  Cancel
                </Button>
              )}
            </Box>
          </Grid>
        </Grid>
      </form>
    </Paper>
  );
};

export default GameForm;
