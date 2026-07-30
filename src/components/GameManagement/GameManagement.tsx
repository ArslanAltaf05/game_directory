import React from 'react';
import {
  Paper,
  Typography,
  List,
  ListItem,
  ListItemAvatar,
  Avatar,
  ListItemText,
  IconButton,
  Box,
  Chip,
  CircularProgress,
  Tooltip,
} from '@mui/material';
import { Edit, Delete, Star, CloudDownload, LinkOff } from '@mui/icons-material';
import type { Game } from '../../types';

interface GameManagementProps {
  games: Game[];
  onEdit: (game: Game) => void;
  onDelete: (id: string) => void;
  loading?: boolean;
}

const GameManagement: React.FC<GameManagementProps> = ({ 
  games, 
  onEdit, 
  onDelete,
  loading = false 
}) => {
  if (loading) {
    return (
      <Paper sx={{ p: 3, display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: 200 }}>
        <CircularProgress />
      </Paper>
    );
  }

  return (
    <Paper sx={{ p: 3 }}>
      <Typography variant="h6" sx={{ mb: 3 }}>
        Manage Games ({games.length})
      </Typography>

      <List sx={{ maxHeight: 600, overflow: 'auto' }}>
        {games.length === 0 ? (
          <Typography color="text.secondary" sx={{ textAlign: 'center', py: 4 }}>
            No games added yet. Start by adding your first game!
          </Typography>
        ) : (
          games.map((game) => {
            const hasDownloadUrl = game.downloadUrl && game.downloadUrl.trim() !== '';
            return (
              <ListItem
                key={game.id}
                secondaryAction={
                  <Box>
                    <IconButton onClick={() => onEdit(game)} color="primary">
                      <Edit />
                    </IconButton>
                    <IconButton onClick={() => onDelete(game.id)} color="error">
                      <Delete />
                    </IconButton>
                  </Box>
                }
                sx={{ borderBottom: '1px solid', borderColor: 'divider' }}
              >
                <ListItemAvatar>
                  <Avatar src={game.imageUrl} variant="rounded" />
                </ListItemAvatar>
                <ListItemText
                  primary={
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flexWrap: 'wrap' }}>
                      <Typography variant="body1" sx={{ fontWeight: 500 }}>
                        {game.title}
                      </Typography>
                      {game.isFeatured && (
                        <Chip
                          icon={<Star sx={{ fontSize: 16 }} />}
                          label="Featured"
                          size="small"
                          color="warning"
                        />
                      )}
                      {hasDownloadUrl ? (
                        <Tooltip title="Download URL available">
                          <Chip
                            icon={<CloudDownload sx={{ fontSize: 16 }} />}
                            label="Download Ready"
                            size="small"
                            color="success"
                          />
                        </Tooltip>
                      ) : (
                        <Tooltip title="No download URL set">
                          <Chip
                            icon={<LinkOff sx={{ fontSize: 16 }} />}
                            label="No Download"
                            size="small"
                            color="error"
                          />
                        </Tooltip>
                      )}
                    </Box>
                  }
                  secondary={`${game.category} • ${game.developer} • ${game.downloads?.toLocaleString() || 0} downloads`}
                />
              </ListItem>
            );
          })
        )}
      </List>
    </Paper>
  );
};

export default GameManagement;
