import React, { useState, useEffect } from 'react';
import {
  Container,
  Grid,
  Typography,
  Box,
  Paper,
  Button,
  TextField,
  InputAdornment,
  Chip,
  IconButton,
  Card,
  CardContent,
  useTheme,
  Fade,
  Grow,
  Rating,
  CircularProgress,
} from '@mui/material';
import {
  Search,
  Games,
  TrendingUp,
  Star,
  Download,
  ArrowForward,
  ArrowBack,
  Whatshot,
  NewReleases,
  Favorite,
} from '@mui/icons-material';
import { useGames } from '../../hooks/useGames';
import GameList from '../../components/GameList/GameList';
import { Link } from 'react-router-dom';

const Home: React.FC = () => {
  const { games, loading, error, searchGames } = useGames();
  const theme = useTheme();
  const [searchTerm, setSearchTerm] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');
  const [currentSlide, setCurrentSlide] = useState(0);
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [isSearching, setIsSearching] = useState(false);

  const featuredGames = games.filter((g) => g.isFeatured);
  const categories = ['All', ...new Set(games.map((g) => g.category))];

  // Auto-slide for hero
  useEffect(() => {
    if (featuredGames.length === 0) return;
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % featuredGames.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [featuredGames.length]);

  // Handle search
  useEffect(() => {
    const performSearch = async () => {
      if (searchTerm.trim()) {
        setIsSearching(true);
        const results = await searchGames(searchTerm);
        setSearchResults(results);
        setIsSearching(false);
      } else {
        setSearchResults([]);
      }
    };
    
    const timeoutId = setTimeout(performSearch, 300);
    return () => clearTimeout(timeoutId);
  }, [searchTerm, searchGames]);

  const filteredGames = searchTerm.trim() 
    ? searchResults 
    : games.filter((game) => {
        const matchesCategory = activeCategory === 'All' || game.category === activeCategory;
        return matchesCategory;
      });

  const topRatedGames = [...games].sort((a, b) => b.rating - a.rating).slice(0, 4);
  const newGames = [...games].sort((a, b) => 
    new Date(b.releaseDate).getTime() - new Date(a.releaseDate).getTime()
  ).slice(0, 4);

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
        <Box sx={{ textAlign: 'center' }}>
          <CircularProgress size={60} />
          <Typography variant="h6" sx={{ mt: 2, color: 'text.secondary' }}>
            Loading amazing games...
          </Typography>
        </Box>
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
        <Paper sx={{ p: 4, textAlign: 'center', maxWidth: 400 }}>
          <Typography variant="h6" color="error" gutterBottom>
            Something went wrong
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {error}
          </Typography>
          <Button variant="contained" sx={{ mt: 2 }} onClick={() => window.location.reload()}>
            Retry
          </Button>
        </Paper>
      </Box>
    );
  }

  return (
    <Box>
      {/* Hero Section with Slideshow */}
      {featuredGames.length > 0 && (
        <Box
          sx={{
            position: 'relative',
            height: { xs: '60vh', md: '70vh' },
            overflow: 'hidden',
            mb: 6,
            borderRadius: { xs: 0, md: 3 },
            mx: { xs: 0, md: 2 },
            mt: { xs: 0, md: 2 },
          }}
        >
          {featuredGames.map((game, index) => (
            <Fade
              key={game.id}
              in={currentSlide === index}
              timeout={800}
            >
              <Box
                sx={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
                  display: currentSlide === index ? 'block' : 'none',
                  background: `linear-gradient(135deg, ${theme.palette.primary.dark}CC, ${theme.palette.secondary.dark}CC), url(${game.imageUrl})`,
                  backgroundSize: 'cover',
                  backgroundPosition: 'center',
                  borderRadius: { xs: 0, md: 3 },
                }}
              >
                <Container maxWidth="lg" sx={{ height: '100%', display: 'flex', alignItems: 'center' }}>
                  <Box sx={{ color: 'white', maxWidth: '60%' }}>
                    <Chip
                      label="Featured Game"
                      color="warning"
                      sx={{ mb: 2, fontWeight: 'bold' }}
                    />
                    <Typography
                      variant="h1"
                      sx={{
                        fontSize: { xs: '2.5rem', md: '4.5rem' },
                        fontWeight: 800,
                        mb: 2,
                        textShadow: '0 4px 20px rgba(0,0,0,0.3)',
                        lineHeight: 1.1,
                      }}
                    >
                      {game.title}
                    </Typography>
                    <Typography
                      variant="h6"
                      sx={{
                        mb: 3,
                        opacity: 0.9,
                        maxWidth: '80%',
                        textShadow: '0 2px 10px rgba(0,0,0,0.3)',
                      }}
                    >
                      {game.description.slice(0, 120)}...
                    </Typography>
                    <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                      <Button
                        component={Link}
                        to={`/game/${game.id}`}
                        variant="contained"
                        size="large"
                        startIcon={<Games />}
                        sx={{
                          bgcolor: 'white',
                          color: 'primary.main',
                          '&:hover': { bgcolor: 'grey.100' },
                          px: 4,
                        }}
                      >
                        View Game
                      </Button>
                      <Button
                        variant="outlined"
                        size="large"
                        startIcon={<Download />}
                        sx={{
                          borderColor: 'white',
                          color: 'white',
                          '&:hover': { borderColor: 'white', bgcolor: 'rgba(255,255,255,0.1)' },
                        }}
                      >
                        Download
                      </Button>
                    </Box>
                  </Box>
                </Container>
              </Box>
            </Fade>
          ))}

          {/* Slide Controls */}
          <Box
            sx={{
              position: 'absolute',
              bottom: 30,
              left: '50%',
              transform: 'translateX(-50%)',
              display: 'flex',
              gap: 1,
              zIndex: 10,
            }}
          >
            {featuredGames.map((_, index) => (
              <Box
                key={index}
                onClick={() => setCurrentSlide(index)}
                sx={{
                  width: 12,
                  height: 12,
                  borderRadius: '50%',
                  bgcolor: currentSlide === index ? 'white' : 'rgba(255,255,255,0.4)',
                  cursor: 'pointer',
                  transition: 'all 0.3s',
                  '&:hover': { transform: 'scale(1.2)' },
                }}
              />
            ))}
          </Box>

          <IconButton
            onClick={() => setCurrentSlide((prev) => (prev - 1 + featuredGames.length) % featuredGames.length)}
            sx={{
              position: 'absolute',
              left: 20,
              top: '50%',
              transform: 'translateY(-50%)',
              bgcolor: 'rgba(0,0,0,0.3)',
              color: 'white',
              '&:hover': { bgcolor: 'rgba(0,0,0,0.5)' },
              zIndex: 10,
            }}
          >
            <ArrowBack />
          </IconButton>
          <IconButton
            onClick={() => setCurrentSlide((prev) => (prev + 1) % featuredGames.length)}
            sx={{
              position: 'absolute',
              right: 20,
              top: '50%',
              transform: 'translateY(-50%)',
              bgcolor: 'rgba(0,0,0,0.3)',
              color: 'white',
              '&:hover': { bgcolor: 'rgba(0,0,0,0.5)' },
              zIndex: 10,
            }}
          >
            <ArrowForward />
          </IconButton>
        </Box>
      )}

      {/* Search and Filter Section */}
      <Container maxWidth="lg">
        <Box sx={{ mb: 4 }}>
          <Paper
            elevation={0}
            sx={{
              p: 3,
              borderRadius: 3,
              bgcolor: 'background.default',
              border: `1px solid ${theme.palette.divider}`,
            }}
          >
            <Grid container spacing={2} alignItems="center">
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  placeholder="Search for games..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Search color="action" />
                      </InputAdornment>
                    ),
                    sx: { borderRadius: 2, bgcolor: 'background.paper' }
                  }}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                  {categories.map((category) => (
                    <Chip
                      key={category}
                      label={category}
                      onClick={() => setActiveCategory(category)}
                      color={activeCategory === category ? 'primary' : 'default'}
                      variant={activeCategory === category ? 'filled' : 'outlined'}
                      sx={{ 
                        fontWeight: activeCategory === category ? 600 : 400,
                        '&:hover': { transform: 'scale(1.05)' },
                        transition: 'all 0.2s',
                      }}
                    />
                  ))}
                </Box>
              </Grid>
            </Grid>
          </Paper>
        </Box>

        {/* Stats Section */}
        <Grid container spacing={3} sx={{ mb: 5 }}>
          <Grid item xs={6} sm={3}>
            <Paper sx={{ p: 2, textAlign: 'center', borderRadius: 2 }}>
              <Games sx={{ fontSize: 32, color: 'primary.main' }} />
              <Typography variant="h5" fontWeight="bold">{games.length}</Typography>
              <Typography variant="caption" color="text.secondary">Total Games</Typography>
            </Paper>
          </Grid>
          <Grid item xs={6} sm={3}>
            <Paper sx={{ p: 2, textAlign: 'center', borderRadius: 2 }}>
              <Download sx={{ fontSize: 32, color: 'success.main' }} />
              <Typography variant="h5" fontWeight="bold">
                {games.reduce((acc, g) => acc + (g.downloads || 0), 0).toLocaleString()}
              </Typography>
              <Typography variant="caption" color="text.secondary">Total Downloads</Typography>
            </Paper>
          </Grid>
          <Grid item xs={6} sm={3}>
            <Paper sx={{ p: 2, textAlign: 'center', borderRadius: 2 }}>
              <Star sx={{ fontSize: 32, color: 'warning.main' }} />
              <Typography variant="h5" fontWeight="bold">
                {(games.reduce((acc, g) => acc + g.rating, 0) / games.length || 0).toFixed(1)}
              </Typography>
              <Typography variant="caption" color="text.secondary">Average Rating</Typography>
            </Paper>
          </Grid>
          <Grid item xs={6} sm={3}>
            <Paper sx={{ p: 2, textAlign: 'center', borderRadius: 2 }}>
              <TrendingUp sx={{ fontSize: 32, color: 'info.main' }} />
              <Typography variant="h5" fontWeight="bold">
                {games.filter(g => g.isFeatured).length}
              </Typography>
              <Typography variant="caption" color="text.secondary">Featured Games</Typography>
            </Paper>
          </Grid>
        </Grid>

        {/* Display filtered games */}
        {searchTerm && (
          <Box sx={{ mb: 3 }}>
            <Typography variant="h6">
              {isSearching ? 'Searching...' : `${filteredGames.length} results found for "${searchTerm}"`}
            </Typography>
          </Box>
        )}

        {/* Top Rated Section */}
        {!searchTerm && (
          <>
            <Box sx={{ mb: 5 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Whatshot sx={{ color: 'error.main', fontSize: 28 }} />
                  <Typography variant="h5" fontWeight="bold">Top Rated Games</Typography>
                </Box>
                <Button component={Link} to="/games" endIcon={<ArrowForward />}>
                  View All
                </Button>
              </Box>
              <Grid container spacing={3}>
                {topRatedGames.map((game, index) => (
                  <Grow key={game.id} in timeout={index * 200}>
                    <Grid item xs={12} sm={6} md={3}>
                      <Card
                        component={Link}
                        to={`/game/${game.id}`}
                        sx={{
                          textDecoration: 'none',
                          color: 'inherit',
                          height: '100%',
                          transition: 'all 0.3s',
                          '&:hover': {
                            transform: 'translateY(-8px)',
                            boxShadow: theme.shadows[8],
                          },
                        }}
                      >
                        <Box sx={{ position: 'relative' }}>
                          <Box
                            component="img"
                            src={game.imageUrl}
                            alt={game.title}
                            sx={{
                              width: '100%',
                              height: 160,
                              objectFit: 'cover',
                            }}
                          />
                          <Box
                            sx={{
                              position: 'absolute',
                              top: 10,
                              left: 10,
                              bgcolor: 'rgba(0,0,0,0.7)',
                              color: 'white',
                              borderRadius: '50%',
                              width: 32,
                              height: 32,
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              fontWeight: 'bold',
                              fontSize: 14,
                            }}
                          >
                            #{index + 1}
                          </Box>
                          <Box
                            sx={{
                              position: 'absolute',
                              bottom: 0,
                              left: 0,
                              right: 0,
                              bgcolor: 'rgba(0,0,0,0.6)',
                              color: 'white',
                              px: 1,
                              py: 0.5,
                              display: 'flex',
                              justifyContent: 'space-between',
                              alignItems: 'center',
                            }}
                          >
                            <Rating value={game.rating} precision={0.1} size="small" readOnly sx={{ color: 'warning.main' }} />
                            <Typography variant="caption" fontWeight="bold">
                              {game.rating.toFixed(1)}
                            </Typography>
                          </Box>
                        </Box>
                        <CardContent>
                          <Typography variant="subtitle1" fontWeight="bold" noWrap>
                            {game.title}
                          </Typography>
                          <Typography variant="caption" color="text.secondary" display="block" noWrap>
                            {game.developer}
                          </Typography>
                          <Typography variant="body2" color="primary" fontWeight="bold">
                            ${game.price}
                          </Typography>
                        </CardContent>
                      </Card>
                    </Grid>
                  </Grow>
                ))}
              </Grid>
            </Box>

            {/* New Releases Section */}
            <Box sx={{ mb: 5 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <NewReleases sx={{ color: 'secondary.main', fontSize: 28 }} />
                  <Typography variant="h5" fontWeight="bold">New Releases</Typography>
                </Box>
                <Button component={Link} to="/games" endIcon={<ArrowForward />}>
                  View All
                </Button>
              </Box>
              <Grid container spacing={3}>
                {newGames.map((game, index) => (
                  <Grow key={game.id} in timeout={index * 200}>
                    <Grid item xs={12} sm={6} md={3}>
                      <Card
                        component={Link}
                        to={`/game/${game.id}`}
                        sx={{
                          textDecoration: 'none',
                          color: 'inherit',
                          height: '100%',
                          transition: 'all 0.3s',
                          '&:hover': {
                            transform: 'translateY(-8px)',
                            boxShadow: theme.shadows[8],
                          },
                        }}
                      >
                        <Box sx={{ position: 'relative' }}>
                          <Box
                            component="img"
                            src={game.imageUrl}
                            alt={game.title}
                            sx={{
                              width: '100%',
                              height: 160,
                              objectFit: 'cover',
                            }}
                          />
                          <Chip
                            label="New"
                            color="secondary"
                            size="small"
                            sx={{
                              position: 'absolute',
                              top: 10,
                              right: 10,
                              fontWeight: 'bold',
                            }}
                          />
                        </Box>
                        <CardContent>
                          <Typography variant="subtitle1" fontWeight="bold" noWrap>
                            {game.title}
                          </Typography>
                          <Typography variant="caption" color="text.secondary" display="block" noWrap>
                            {game.developer}
                          </Typography>
                          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 1 }}>
                            <Typography variant="body2" color="primary" fontWeight="bold">
                              ${game.price}
                            </Typography>
                            <Typography variant="caption" color="text.secondary">
                              {new Date(game.releaseDate).toLocaleDateString()}
                            </Typography>
                          </Box>
                        </CardContent>
                      </Card>
                    </Grid>
                  </Grow>
                ))}
              </Grid>
            </Box>

            {/* Featured Games Section */}
            {featuredGames.length > 0 && (
              <Box sx={{ mb: 5 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 3 }}>
                  <Favorite sx={{ color: 'error.main', fontSize: 28 }} />
                  <Typography variant="h5" fontWeight="bold">Featured Games</Typography>
                </Box>
                <GameList games={featuredGames} />
              </Box>
            )}
          </>
        )}

        {/* Show all games when searching or filtered */}
        {(searchTerm || activeCategory !== 'All') && (
          <Box sx={{ mb: 5 }}>
            <GameList games={filteredGames} />
          </Box>
        )}

        {/* Call to Action */}
        <Paper
          sx={{
            p: 6,
            textAlign: 'center',
            background: `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
            color: 'white',
            borderRadius: 3,
            mb: 5,
          }}
        >
          <Typography variant="h4" fontWeight="bold" gutterBottom>
            Ready to Play?
          </Typography>
          <Typography variant="body1" sx={{ mb: 3, opacity: 0.9, maxWidth: 600, mx: 'auto' }}>
            Discover thousands of games, connect with friends, and start your gaming adventure today.
          </Typography>
          <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center', flexWrap: 'wrap' }}>
            <Button
              variant="contained"
              size="large"
              sx={{
                bgcolor: 'white',
                color: 'primary.main',
                '&:hover': { bgcolor: 'grey.100' },
              }}
              component={Link}
              to="/games"
            >
              Browse Games
            </Button>
            <Button
              variant="outlined"
              size="large"
              sx={{
                borderColor: 'white',
                color: 'white',
                '&:hover': { borderColor: 'white', bgcolor: 'rgba(255,255,255,0.1)' },
              }}
            >
              Learn More
            </Button>
          </Box>
        </Paper>
      </Container>
    </Box>
  );
};

export default Home;
