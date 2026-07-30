import React from 'react';
import { Grid, Typography, Box } from '@mui/material';
import { Game } from '../../types';
import GameCard from '../GameCard/GameCard';

interface GameListProps {
  games: Game[];
  title?: string;
}

const GameList: React.FC<GameListProps> = ({ games, title }) => {
  if (games.length === 0) {
    return (
      <Box sx={{ textAlign: 'center', py: 8 }}>
        <Typography variant="h6" color="text.secondary">
          No games found
        </Typography>
      </Box>
    );
  }

  return (
    <Box>
      {title && (
        <Typography variant="h5" sx={{ mb: 3, fontWeight: 600 }}>
          {title}
        </Typography>
      )}
      <Grid container spacing={3}>
        {games.map((game) => (
          <Grid item xs={12} sm={6} md={4} lg={3} key={game.id}>
            <GameCard game={game} />
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default GameList;
