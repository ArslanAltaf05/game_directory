import React from 'react';
import { Link } from 'react-router-dom';
import {
  Card,
  CardContent,
  CardMedia,
  Typography,
  Box,
  Chip,
  Rating,
  CardActionArea,
} from '@mui/material';
import { Game } from '../../types';

interface GameCardProps {
  game: Game;
}

const GameCard: React.FC<GameCardProps> = ({ game }) => {

  return (
    <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <CardActionArea component={Link} to={`/game/${game.id}`}>
        <CardMedia
          component="img"
          height="200"
          image={game.imageUrl}
          alt={game.title}
          sx={{ objectFit: 'cover' }}
        />
        <CardContent sx={{ flexGrow: 1 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1 }}>
            <Typography variant="h6" component="h3" noWrap sx={{ flex: 1 }}>
              {game.title}
            </Typography>
            {game.isFeatured && (
              <Chip
                label="Featured"
                size="small"
                color="warning"
                sx={{ ml: 1, flexShrink: 0 }}
              />
            )}
          </Box>

          <Typography 
            variant="body2" 
            color="text.secondary" 
            sx={{ 
              mb: 2, 
              display: '-webkit-box', 
              WebkitLineClamp: 2, 
              WebkitBoxOrient: 'vertical', 
              overflow: 'hidden' 
            }}
          >
            {game.description}
          </Typography>

          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Box>
              <Typography variant="caption" color="text.secondary" display="block">
                {game.category}
              </Typography>
              <Typography variant="caption" color="text.secondary" display="block">
                {game.developer}
              </Typography>
            </Box>
            <Box sx={{ textAlign: 'right' }}>
              <Rating value={game.rating} precision={0.1} size="small" readOnly />
              <Typography variant="h6" color="primary" sx={{ fontWeight: 'bold' }}>
                ${game.price}
              </Typography>
            </Box>
          </Box>
        </CardContent>
      </CardActionArea>
    </Card>
  );
};

export default GameCard;
