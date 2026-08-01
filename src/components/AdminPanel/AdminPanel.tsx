import React, { useState } from 'react';
import { Container, Grid, Typography, Alert, Snackbar } from '@mui/material';
import { useAuth } from '../../context/AuthContext';
import { useGames } from '../../hooks/useGames';
import LoginForm from '../LoginForm/LoginForm';
import GameForm from '../GameForm/GameForm';
import GameManagement from '../GameManagement/GameManagement';
import type { Game } from '../../types';

const AdminPanel: React.FC = () => {
  const { isAdmin } = useAuth();
  const { 
    games, 
    loading, 
    error, 
    addGame, 
    updateGame, 
    deleteGame,
    refreshGames 
  } = useGames();
  const [editingGame, setEditingGame] = useState<Game | null>(null);
  const [snackbar, setSnackbar] = useState<{
    open: boolean;
    message: string;
    severity: 'success' | 'error';
  }>({
    open: false,
    message: '',
    severity: 'success',
  });

  if (!isAdmin) {
    return <LoginForm />;
  }

  const handleSubmit = async (gameData: Omit<Game, 'id'>) => {
    console.log('AdminPanel - Submitting game data:', gameData);
    console.log('Download URL:', gameData.downloadUrl);
    
    // Validate image URL
    if (!gameData.imageUrl) {
      setSnackbar({
        open: true,
        message: 'Please upload an image before saving',
        severity: 'error',
      });
      return;
    }

    try {
      if (editingGame) {
        console.log('Updating game:', editingGame.id);
        await updateGame(editingGame.id, gameData);
        setSnackbar({
          open: true,
          message: 'Game updated successfully! Download URL saved.',
          severity: 'success',
        });
        setEditingGame(null);
      } else {
        console.log('Adding new game');
        await addGame(gameData);
        setSnackbar({
          open: true,
          message: 'Game added successfully! Download URL saved.',
          severity: 'success',
        });
      }
      await refreshGames();
    } catch (err) {
      console.error('Error saving game:', err);
      setSnackbar({
        open: true,
        message: err instanceof Error ? err.message : 'Failed to save game. Please try again.',
        severity: 'error',
      });
    }
  };

  const handleEdit = (game: Game) => {
    console.log('Editing game:', game);
    console.log('Download URL:', game.downloadUrl);
    setEditingGame(game);
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this game?')) {
      try {
        await deleteGame(id);
        setSnackbar({
          open: true,
          message: 'Game deleted successfully!',
          severity: 'success',
        });
        await refreshGames();
      } catch (err) {
        console.error('Error deleting game:', err);
        setSnackbar({
          open: true,
          message: 'Failed to delete game. Please try again.',
          severity: 'error',
        });
      }
    }
  };

  const handleCancel = () => {
    setEditingGame(null);
  };

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      <Typography variant="h4" sx={{ mb: 4, fontWeight: 700 }}>
        Admin Panel
      </Typography>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      <Grid container spacing={4}>
        <Grid item xs={12} md={6}>
          <GameForm
            onSubmit={handleSubmit}
            initialData={editingGame || undefined}
            onCancel={handleCancel}
            loading={loading}
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <GameManagement
            games={games}
            onEdit={handleEdit}
            onDelete={handleDelete}
            loading={loading}
          />
        </Grid>
      </Grid>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        <Alert onClose={handleCloseSnackbar} severity={snackbar.severity}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default AdminPanel;
