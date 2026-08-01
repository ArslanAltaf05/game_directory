import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Container, Button, Typography, CircularProgress } from '@mui/material';
import { ArrowBack } from '@mui/icons-material';
import { useGames } from '../../hooks/useGames';
import GameDetail from '../../components/GameDetail/GameDetail';

const GameDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
const { getGame, loading } = useGames();
  const [game, setGame] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadGame = async () => {
      if (id) {
        try {
          const data = await getGame(id);
          setGame(data);
          if (!data) {
            setError('Game not found');
          }
        } catch (err) {
          setError('Failed to load game');
        }
      }
    };
    loadGame();
  }, [id, getGame]);

  // Pass incrementDownloads to GameDetail via context or props
  // We'll handle it through the useGames hook

  if (loading) {
    return (
      <Container sx={{ py: 8, textAlign: 'center' }}>
        <CircularProgress size={60} />
        <Typography variant="h6" sx={{ mt: 2 }}>
          Loading game...
        </Typography>
      </Container>
    );
  }

  if (error || !game) {
    return (
      <Container sx={{ py: 8, textAlign: 'center' }}>
        <Typography variant="h5" gutterBottom color="error">
          {error || 'Game not found'}
        </Typography>
        <Button component={Link} to="/games" startIcon={<ArrowBack />}>
          Browse all games
        </Button>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Button component={Link} to="/games" startIcon={<ArrowBack />} sx={{ mb: 3 }}>
        Back to Games
      </Button>
      <GameDetail game={game} />
    </Container>
  );
};

export default GameDetailPage;
