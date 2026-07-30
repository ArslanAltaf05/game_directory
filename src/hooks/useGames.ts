import { useState, useEffect, useCallback } from 'react';
import type { Game, UserReview } from '../types';
import * as gameService from '../services/gameService';

export const useGames = () => {
  const [games, setGames] = useState<Game[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Load all games
  const loadGames = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await gameService.getAllGames();
      console.log('Loaded games from Firestore:', data);
      setGames(data);
    } catch (err) {
      console.error('Error loading games:', err);
      setError(err instanceof Error ? err.message : 'Failed to load games');
    } finally {
      setLoading(false);
    }
  }, []);

  // Load games on mount
  useEffect(() => {
    loadGames();
  }, [loadGames]);

  // Add a new game
  const addGame = async (gameData: Omit<Game, 'id'>) => {
    try {
      setError(null);
      console.log('Adding game to Firestore with data:', gameData);
      
      // Ensure downloadUrl is included
      const dataToSave = {
        ...gameData,
        downloadUrl: gameData.downloadUrl || '',
      };
      
      const id = await gameService.addGame(dataToSave);
      console.log('Game added with ID:', id);
      const newGame = { ...dataToSave, id } as Game;
      setGames(prev => [newGame, ...prev]);
      return id;
    } catch (err) {
      console.error('Error in addGame:', err);
      setError(err instanceof Error ? err.message : 'Failed to add game');
      throw err;
    }
  };

  // Update a game
  const updateGame = async (id: string, updatedData: Partial<Game>) => {
    try {
      setError(null);
      console.log('Updating game in Firestore:', id, updatedData);
      
      // Ensure downloadUrl is included in the update
      const updatePayload = {
        ...updatedData,
        downloadUrl: updatedData.downloadUrl !== undefined ? updatedData.downloadUrl : '',
      };
      
      await gameService.updateGame(id, updatePayload);
      console.log('Game updated successfully');
      setGames(prev =>
        prev.map(game =>
          game.id === id ? { ...game, ...updatePayload } : game
        )
      );
    } catch (err) {
      console.error('Error in updateGame:', err);
      setError(err instanceof Error ? err.message : 'Failed to update game');
      throw err;
    }
  };

  // Delete a game
  const deleteGame = async (id: string) => {
    try {
      setError(null);
      console.log('Deleting game from Firestore:', id);
      await gameService.deleteGame(id);
      console.log('Game deleted successfully');
      setGames(prev => prev.filter(game => game.id !== id));
    } catch (err) {
      console.error('Error in deleteGame:', err);
      setError(err instanceof Error ? err.message : 'Failed to delete game');
      throw err;
    }
  };

  // Get a single game by ID
  const getGame = useCallback(async (id: string): Promise<Game | null> => {
    try {
      setError(null);
      console.log('Fetching game from Firestore:', id);
      const game = await gameService.getGameById(id);
      console.log('Game fetched:', game);
      return game;
    } catch (err) {
      console.error('Error in getGame:', err);
      setError(err instanceof Error ? err.message : 'Failed to load game');
      return null;
    }
  }, []);

  // Add a review
  const addReview = async (gameId: string, review: Omit<UserReview, 'id' | 'date'>) => {
    try {
      setError(null);
      console.log('Adding review to game:', gameId, review);
      await gameService.addReviewToGame(gameId, review);
      console.log('Review added successfully');
      await loadGames();
    } catch (err) {
      console.error('Error in addReview:', err);
      setError(err instanceof Error ? err.message : 'Failed to add review');
      throw err;
    }
  };

  // Search games
  const searchGames = async (searchTerm: string): Promise<Game[]> => {
    try {
      setError(null);
      console.log('Searching games:', searchTerm);
      const results = await gameService.searchGames(searchTerm);
      console.log('Search results:', results);
      return results;
    } catch (err) {
      console.error('Error in searchGames:', err);
      setError(err instanceof Error ? err.message : 'Failed to search games');
      return [];
    }
  };

  // Refresh games
  const refreshGames = async () => {
    console.log('Refreshing games...');
    await loadGames();
  };

  // Increment downloads
  const incrementDownloads = async (id: string) => {
    try {
      setError(null);
      await gameService.incrementDownloads(id);
      setGames(prev =>
        prev.map(game =>
          game.id === id
            ? { ...game, downloads: (game.downloads || 0) + 1 }
            : game
        )
      );
    } catch (err) {
      console.error('Error incrementing downloads:', err);
    }
  };

  return {
    games,
    loading,
    error,
    addGame,
    updateGame,
    deleteGame,
    getGame,
    addReview,
    searchGames,
    refreshGames,
    incrementDownloads,
  };
};
