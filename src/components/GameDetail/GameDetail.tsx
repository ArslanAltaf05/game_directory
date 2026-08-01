import React, { useState } from 'react';
import {
  Grid,
  Typography,
  Box,
  Paper,
  Chip,
  Rating,
  Button,
  Divider,
  Avatar,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  LinearProgress,
  useTheme,
  Tooltip,
  Snackbar,
  Alert,
  CircularProgress,
  Link,
} from '@mui/material';
import {
  CalendarToday,
  DeveloperBoard,
  Facebook,
  Twitter,
  LinkedIn,
  Email,
  WhatsApp,
  Android,
  Apple,
  ThumbUp,
  ThumbDown,
  Star,
  PhoneAndroid,
  Computer,
  DesktopWindows,
  SportsEsports,
  CheckCircle,
  OpenInNew,
  CloudDownload,
} from '@mui/icons-material';
import { Download, Share, Favorite, FavoriteBorder } from '@mui/icons-material';

import type { Game } from '../../types';
import { useGames } from '../../hooks/useGames';

interface GameDetailProps {
  game: Game;
}

const GameDetail: React.FC<GameDetailProps> = ({ game }) => {
  const theme = useTheme();
  const { addReview } = useGames();
  const [showReviewDialog, setShowReviewDialog] = useState(false);
  const [reviewData, setReviewData] = useState({
    userName: '',
    rating: 5,
    comment: '',
  });
  const [liked, setLiked] = useState(false);
  const [downloading, setDownloading] = useState(false);
  const [downloadProgress, setDownloadProgress] = useState(0);
  const [snackbar, setSnackbar] = useState<{
    open: boolean;
    message: string;
    severity: 'success' | 'error' | 'info';
  }>({
    open: false,
    message: '',
    severity: 'info',
  });

  const getPlatformIcon = (platform: string) => {
    const lower = platform.toLowerCase();
    if (lower.includes('android')) return <Android />;
    if (lower.includes('ios')) return <Apple />;
    if (lower.includes('windows')) return <DesktopWindows />;
    if (lower.includes('apple')) return <Apple />;
    if (lower.includes('mac')) return <Apple />;
    if (lower.includes('playstation')) return <SportsEsports />;
    if (lower.includes('xbox')) return <SportsEsports />;
    if (lower.includes('nintendo')) return <SportsEsports />;
    if (lower.includes('linux')) return <Computer />;
    return <PhoneAndroid />;
  };

  const getSocialIcon = (platform: string) => {
    const lower = platform.toLowerCase();
    if (lower.includes('facebook')) return <Facebook />;
    if (lower.includes('twitter')) return <Twitter />;
    if (lower.includes('linkedin')) return <LinkedIn />;
    if (lower.includes('email')) return <Email />;
    if (lower.includes('whatsapp')) return <WhatsApp />;
    if (lower.includes('instagram')) return <Favorite />;
    if (lower.includes('youtube')) return <Favorite />;
    if (lower.includes('reddit')) return <Favorite />;
    if (lower.includes('discord')) return <Favorite />;
    return <Share />;
  };

  const handleAddReview = () => {
    if (reviewData.userName && reviewData.comment) {
      addReview(game.id, {
        userName: reviewData.userName,
        rating: reviewData.rating,
        comment: reviewData.comment,
      });
      setReviewData({ userName: '', rating: 5, comment: '' });
      setShowReviewDialog(false);
      setSnackbar({
        open: true,
        message: 'Review added successfully!',
        severity: 'success',
      });
    }
  };

  const handleDownload = async () => {
    // Check if download URL exists
    if (!game.downloadUrl) {
      setSnackbar({
        open: true,
        message: 'Download URL not available for this game.',
        severity: 'error',
      });
      return;
    }

    setDownloading(true);
    setDownloadProgress(0);

    try {
      // Simulate download progress
      for (let i = 0; i <= 100; i += 10) {
        await new Promise(resolve => setTimeout(resolve, 150));
        setDownloadProgress(i);
      }

      // Open the download URL in a new tab/window
      window.open(game.downloadUrl, '_blank');
      
      // Also trigger a direct download if it's an APK file
      if (game.downloadUrl.endsWith('.apk')) {
        const link = document.createElement('a');
        link.href = game.downloadUrl;
        link.download = `${game.title.toLowerCase().replace(/[^a-z0-9]/g, '_')}_v${game.version || '1.0.0'}.apk`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      }

      setSnackbar({
        open: true,
        message: `${game.title} download started!`,
        severity: 'success',
      });
    } catch (error) {
      console.error('Download failed:', error);
      setSnackbar({
        open: true,
        message: 'Download failed. Please try again.',
        severity: 'error',
      });
    } finally {
      setDownloading(false);
      setDownloadProgress(0);
    }
  };

  const handleShare = async () => {
    const shareData = {
      title: game.title,
      text: `Check out ${game.title} on GameCatalog!`,
      url: window.location.href,
    };

    try {
      if (navigator.share) {
        await navigator.share(shareData);
        setSnackbar({
          open: true,
          message: 'Shared successfully!',
          severity: 'success',
        });
      } else {
        await navigator.clipboard.writeText(window.location.href);
        setSnackbar({
          open: true,
          message: 'Link copied to clipboard!',
          severity: 'success',
        });
      }
    } catch (error) {
      if (error instanceof Error && error.name !== 'AbortError') {
        console.error('Share failed:', error);
        setSnackbar({
          open: true,
          message: 'Failed to share. Please try again.',
          severity: 'error',
        });
      }
    }
  };

  const renderRatingBars = () => {
    const dist = game.ratingDistribution || { fiveStar: 0, fourStar: 0, threeStar: 0, twoStar: 0, oneStar: 0 };
    const total = game.totalReviews || 0;
    const getPercentage = (count: number) => (total > 0 ? (count / total) * 100 : 0);

    const ratings = [
      { stars: 5, count: dist.fiveStar, color: '#4CAF50' },
      { stars: 4, count: dist.fourStar, color: '#8BC34A' },
      { stars: 3, count: dist.threeStar, color: '#FFC107' },
      { stars: 2, count: dist.twoStar, color: '#FF9800' },
      { stars: 1, count: dist.oneStar, color: '#F44336' },
    ];

    return ratings.map((item) => (
      <Box key={item.stars} sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 0.5 }}>
        <Typography variant="caption" sx={{ minWidth: 20 }}>
          {item.stars}
        </Typography>
        <Star sx={{ fontSize: 14, color: item.color }} />
        <Box sx={{ flex: 1 }}>
          <LinearProgress
            variant="determinate"
            value={getPercentage(item.count)}
            sx={{
              height: 8,
              borderRadius: 4,
              backgroundColor: theme.palette.grey[200],
              '& .MuiLinearProgress-bar': {
                backgroundColor: item.color,
                borderRadius: 4,
              },
            }}
          />
        </Box>
        <Typography variant="caption" color="text.secondary" sx={{ minWidth: 30 }}>
          {item.count}
        </Typography>
      </Box>
    ));
  };

  return (
    <Box>
      {/* Main Game Info */}
      <Paper sx={{ overflow: 'hidden', borderRadius: 3, mb: 3 }}>
        <Grid container>
          <Grid item xs={12} md={5}>
            <Box
              component="img"
              src={game.imageUrl}
              alt={game.title}
              sx={{
                width: '100%',
                height: '100%',
                minHeight: 400,
                objectFit: 'cover',
              }}
            />
          </Grid>
          <Grid item xs={12} md={7}>
            <Box sx={{ p: 4 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                <Box>
                  <Typography variant="h4" component="h1" sx={{ fontWeight: 700 }}>
                    {game.title}
                  </Typography>
                  <Typography variant="subtitle2" color="text.secondary">
                    {game.version} by {game.developer}
                  </Typography>
                </Box>
                {game.isFeatured && (
                  <Chip label="Featured" color="warning" />
                )}
              </Box>

              <Box sx={{ display: 'flex', alignItems: 'center', gap: 3, mb: 3, flexWrap: 'wrap' }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Rating value={game.rating} precision={0.1} readOnly />
                  <Typography variant="body2" color="text.secondary">
                    ({game.totalReviews || 0} reviews)
                  </Typography>
                </Box>
                <Chip label={game.category} size="small" />
                <Box sx={{ display: 'flex', gap: 0.5, flexWrap: 'wrap' }}>
                  {game.platforms?.map((platform) => (
                    <Tooltip key={platform} title={platform}>
                      <Chip
                        icon={getPlatformIcon(platform) || undefined}
                        size="small"
                        variant="outlined"
                        label={platform}
                      />
                    </Tooltip>
                  ))}
                </Box>
              </Box>

              <Typography variant="body1" sx={{ mb: 3 }}>
                {game.description}
              </Typography>

              <Divider sx={{ my: 2 }} />

              <Grid container spacing={2}>
                <Grid item xs={6}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <DeveloperBoard color="action" />
                    <Box>
                      <Typography variant="caption" color="text.secondary" display="block">
                        Developer
                      </Typography>
                      <Typography variant="body2">{game.developer}</Typography>
                    </Box>
                  </Box>
                </Grid>
                <Grid item xs={6}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <CalendarToday color="action" />
                    <Box>
                      <Typography variant="caption" color="text.secondary" display="block">
                        Updated
                      </Typography>
                      <Typography variant="body2">
                        {new Date(game.releaseDate).toLocaleDateString()}
                      </Typography>
                    </Box>
                  </Box>
                </Grid>
                <Grid item xs={6}>
                  <Box>
                    <Typography variant="caption" color="text.secondary" display="block">
                      File Size
                    </Typography>
                    <Typography variant="body2">{game.fileSize || 'N/A'}</Typography>
                  </Box>
                </Grid>
                <Grid item xs={6}>
                  <Box>
                    <Typography variant="caption" color="text.secondary" display="block">
                      Downloads
                    </Typography>
                    <Typography variant="body2">
                      {game.downloads ? game.downloads.toLocaleString() : 'N/A'}
                    </Typography>
                  </Box>
                </Grid>
                {game.packageName && (
                  <Grid item xs={12}>
                    <Typography variant="caption" color="text.secondary" display="block">
                      Package Name
                    </Typography>
                    <Typography variant="body2" sx={{ fontFamily: 'monospace' }}>
                      {game.packageName}
                    </Typography>
                  </Grid>
                )}
                {game.downloadUrl && (
                  <Grid item xs={12}>
                    <Box sx={{ 
                      display: 'flex', 
                      alignItems: 'center', 
                      gap: 1,
                      p: 1,
                      bgcolor: 'grey.50',
                      borderRadius: 1,
                    }}>
                      <CloudDownload color="primary" />
                      <Typography variant="caption" color="text.secondary">
                        Download URL:
                      </Typography>
                      <Link 
                        href={game.downloadUrl} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        sx={{ 
                          fontSize: '0.75rem',
                          wordBreak: 'break-all',
                          textDecoration: 'none',
                          '&:hover': { textDecoration: 'underline' }
                        }}
                      >
                        {game.downloadUrl.length > 50 
                          ? game.downloadUrl.substring(0, 50) + '...' 
                          : game.downloadUrl}
                      </Link>
                      <IconButton 
                        size="small" 
                        onClick={() => {
                          navigator.clipboard.writeText(game.downloadUrl || '');
                          setSnackbar({
                            open: true,
                            message: 'Download URL copied!',
                            severity: 'success',
                          });
                        }}
                      >
                        <OpenInNew fontSize="small" />
                      </IconButton>
                    </Box>
                  </Grid>
                )}
              </Grid>

              <Divider sx={{ my: 2 }} />

              <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                <Box sx={{ flex: 1 }}>
                  <Button
                    variant="contained"
                    size="large"
                    startIcon={downloading ? <CircularProgress size={20} color="inherit" /> : <Download />}
                    onClick={handleDownload}
                    disabled={downloading || !game.downloadUrl}
                    fullWidth
                    sx={{
                      position: 'relative',
                      overflow: 'hidden',
                    }}
                  >
                    {!game.downloadUrl 
                      ? 'No Download Available' 
                      : downloading 
                        ? `Downloading... ${downloadProgress}%` 
                        : `Download Now (${game.fileSize || 'APK'})`}
                  </Button>
                  {downloading && (
                    <LinearProgress
                      variant="determinate"
                      value={downloadProgress}
                      sx={{
                        mt: 1,
                        height: 4,
                        borderRadius: 2,
                      }}
                    />
                  )}
                  {!game.downloadUrl && (
                    <Typography variant="caption" color="error" sx={{ display: 'block', mt: 0.5 }}>
                      No download link available. Admin needs to add a download URL.
                    </Typography>
                  )}
                </Box>
                <IconButton 
                  onClick={() => setLiked(!liked)} 
                  color={liked ? 'primary' : 'default'}
                  sx={{ border: '1px solid', borderColor: 'divider' }}
                >
                  {liked ? <Favorite color="error" /> : <FavoriteBorder />}
                </IconButton>
                <IconButton 
                  onClick={handleShare}
                  sx={{ border: '1px solid', borderColor: 'divider' }}
                >
                  <Share />
                </IconButton>
              </Box>
            </Box>
          </Grid>
        </Grid>
      </Paper>

      {/* Social Links */}
      {game.socialLinks && game.socialLinks.length > 0 && (
        <Paper sx={{ p: 3, mb: 3 }}>
          <Typography variant="h6" gutterBottom>
            Social Media Links
          </Typography>
          <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
            {game.socialLinks.map((link) => (
              <Button
                key={link.platform}
                variant="outlined"
                startIcon={getSocialIcon(link.platform)}
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
              >
                {link.platform}
              </Button>
            ))}
          </Box>
        </Paper>
      )}

      {/* Ratings & Reviews */}
      <Paper sx={{ p: 3, mb: 3 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Typography variant="h6">Rate the App</Typography>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <ThumbUp sx={{ color: 'success.main', fontSize: 20 }} />
              <Typography variant="body2" sx={{ ml: 0.5 }}>11</Typography>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <ThumbDown sx={{ color: 'error.main', fontSize: 20 }} />
              <Typography variant="body2" sx={{ ml: 0.5 }}>390</Typography>
            </Box>
          </Box>
        </Box>

        <Typography variant="subtitle1" gutterBottom>
          Based on {game.totalReviews || 0} reviews
        </Typography>

        <Grid container spacing={4}>
          <Grid item xs={12} md={6}>
            {renderRatingBars()}
          </Grid>
          <Grid item xs={12} md={6}>
            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%' }}>
              <Typography variant="h2" sx={{ fontWeight: 'bold' }}>
                {game.rating.toFixed(1)}
              </Typography>
              <Rating value={game.rating} precision={0.1} readOnly size="large" />
              <Typography variant="body2" color="text.secondary">
                {game.totalReviews || 0} total reviews
              </Typography>
            </Box>
          </Grid>
        </Grid>

        <Divider sx={{ my: 3 }} />

        <Typography variant="h6" gutterBottom>
          User Reviews
        </Typography>

        {game.reviews && game.reviews.length > 0 ? (
          game.reviews.map((review) => (
            <Box key={review.id} sx={{ mb: 3, p: 2, bgcolor: 'grey.50', borderRadius: 2 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  <Avatar sx={{ bgcolor: 'primary.main' }}>
                    {review.userName.charAt(0).toUpperCase()}
                  </Avatar>
                  <Box>
                    <Typography variant="subtitle2">{review.userName}</Typography>
                    <Typography variant="caption" color="text.secondary">
                      {review.date}
                    </Typography>
                  </Box>
                </Box>
                <Rating value={review.rating} readOnly size="small" />
              </Box>
              <Typography variant="body2">{review.comment}</Typography>
            </Box>
          ))
        ) : (
          <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'center', py: 3 }}>
            No reviews added yet. Be the first to review!
          </Typography>
        )}

        <Button
          variant="contained"
          onClick={() => setShowReviewDialog(true)}
          sx={{ mt: 2 }}
        >
          Add Comment & Review
        </Button>
      </Paper>

      {/* Review Dialog */}
      <Dialog
        open={showReviewDialog}
        onClose={() => setShowReviewDialog(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Add Your Review</DialogTitle>
        <DialogContent>
          <TextField
            fullWidth
            label="Your Name"
            value={reviewData.userName}
            onChange={(e) => setReviewData({ ...reviewData, userName: e.target.value })}
            margin="normal"
            required
          />
          <Box sx={{ mt: 2, mb: 2 }}>
            <Typography variant="body2" gutterBottom>Rating</Typography>
            <Rating
              value={reviewData.rating}
              onChange={(_, value) => setReviewData({ ...reviewData, rating: value || 5 })}
              size="large"
            />
          </Box>
          <TextField
            fullWidth
            label="Your Comment"
            value={reviewData.comment}
            onChange={(e) => setReviewData({ ...reviewData, comment: e.target.value })}
            margin="normal"
            multiline
            rows={3}
            required
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowReviewDialog(false)}>Cancel</Button>
          <Button
            onClick={handleAddReview}
            variant="contained"
            disabled={!reviewData.userName || !reviewData.comment}
          >
            Submit Review
          </Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar for notifications */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert 
          onClose={() => setSnackbar({ ...snackbar, open: false })} 
          severity={snackbar.severity}
          icon={snackbar.severity === 'success' ? <CheckCircle /> : undefined}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default GameDetail;
