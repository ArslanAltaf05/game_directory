import {
  collection,
  doc,
  getDocs,
  getDoc,
  addDoc,
  updateDoc,
  deleteDoc,
  query,
  orderBy,
  where,
  serverTimestamp,
  Timestamp,
} from 'firebase/firestore';
import { db } from '../config/firebase';
import type { Game, UserReview } from '../types';

const COLLECTION_NAME = 'games';

// Convert Firestore data to Game type
const convertToGame = (docData: any, id: string): Game => {
  // Helper function to safely convert timestamp
  const safeConvertTimestamp = (timestamp: any): string => {
    if (!timestamp) return new Date().toISOString();
    
    if (timestamp instanceof Timestamp) {
      return timestamp.toDate().toISOString();
    }
    
    if (typeof timestamp === 'object' && 'toDate' in timestamp) {
      try {
        return timestamp.toDate().toISOString();
      } catch (e) {
        return new Date().toISOString();
      }
    }
    
    if (typeof timestamp === 'string') {
      return timestamp;
    }
    
    return new Date().toISOString();
  };

  return {
    id,
    title: docData.title || '',
    description: docData.description || '',
    category: docData.category || '',
    rating: docData.rating || 0,
    imageUrl: docData.imageUrl || '',
    releaseDate: docData.releaseDate || '',
    developer: docData.developer || '',
    price: docData.price || 0,
    isFeatured: docData.isFeatured || false,
    version: docData.version || '',
    fileSize: docData.fileSize || '',
    downloads: docData.downloads || 0,
    packageName: docData.packageName || '',
    platforms: docData.platforms || [],
    socialLinks: docData.socialLinks || [],
    reviews: docData.reviews || [],
    totalReviews: docData.totalReviews || 0,
    ratingDistribution: docData.ratingDistribution || {
      fiveStar: 0,
      fourStar: 0,
      threeStar: 0,
      twoStar: 0,
      oneStar: 0,
    },
    downloadUrl: docData.downloadUrl || '',
    createdAt: safeConvertTimestamp(docData.createdAt),
    updatedAt: safeConvertTimestamp(docData.updatedAt),
  };
};

// Get all games
export const getAllGames = async (): Promise<Game[]> => {
  try {
    const gamesRef = collection(db, COLLECTION_NAME);
    const q = query(gamesRef, orderBy('createdAt', 'desc'));
    const querySnapshot = await getDocs(q);
    
    const games: Game[] = [];
    querySnapshot.forEach((doc) => {
      games.push(convertToGame(doc.data(), doc.id));
    });
    
    return games;
  } catch (error) {
    console.error('Error fetching games:', error);
    throw error;
  }
};

// Get featured games
export const getFeaturedGames = async (): Promise<Game[]> => {
  try {
    const gamesRef = collection(db, COLLECTION_NAME);
    const q = query(gamesRef, where('isFeatured', '==', true));
    const querySnapshot = await getDocs(q);
    
    const games: Game[] = [];
    querySnapshot.forEach((doc) => {
      games.push(convertToGame(doc.data(), doc.id));
    });
    
    return games;
  } catch (error) {
    console.error('Error fetching featured games:', error);
    throw error;
  }
};

// Get game by ID
export const getGameById = async (id: string): Promise<Game | null> => {
  try {
    const docRef = doc(db, COLLECTION_NAME, id);
    const docSnap = await getDoc(docRef);
    
    if (docSnap.exists()) {
      return convertToGame(docSnap.data(), docSnap.id);
    }
    return null;
  } catch (error) {
    console.error('Error fetching game:', error);
    throw error;
  }
};

// Add new game
export const addGame = async (gameData: Omit<Game, 'id' | 'createdAt' | 'updatedAt'>): Promise<string> => {
  try {
    const gamesRef = collection(db, COLLECTION_NAME);
    
    const docData = {
      title: gameData.title || '',
      description: gameData.description || '',
      category: gameData.category || '',
      rating: gameData.rating || 0,
      imageUrl: gameData.imageUrl || '',
      releaseDate: gameData.releaseDate || '',
      developer: gameData.developer || '',
      price: gameData.price || 0,
      isFeatured: gameData.isFeatured || false,
      version: gameData.version || '',
      fileSize: gameData.fileSize || '',
      downloads: gameData.downloads || 0,
      packageName: gameData.packageName || '',
      platforms: gameData.platforms || [],
      socialLinks: gameData.socialLinks || [],
      reviews: gameData.reviews || [],
      totalReviews: gameData.totalReviews || 0,
      ratingDistribution: gameData.ratingDistribution || {
        fiveStar: 0,
        fourStar: 0,
        threeStar: 0,
        twoStar: 0,
        oneStar: 0,
      },
      downloadUrl: gameData.downloadUrl || '',
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    };

    console.log('Saving to Firestore:', docData);
    
    const docRef = await addDoc(gamesRef, docData);
    console.log('Game saved with ID:', docRef.id);
    return docRef.id;
  } catch (error) {
    console.error('Error adding game:', error);
    throw error;
  }
};

// Update game
export const updateGame = async (id: string, gameData: Partial<Game>): Promise<void> => {
  try {
    const docRef = doc(db, COLLECTION_NAME, id);
    
    // Remove id, createdAt, updatedAt from update data
    const { id: _, createdAt: __, updatedAt: ___, ...updateData } = gameData;
    
    const dataToUpdate = {
      ...updateData,
      updatedAt: serverTimestamp(),
    };
    
    // Explicitly handle downloadUrl
    if (gameData.downloadUrl !== undefined) {
      dataToUpdate.downloadUrl = gameData.downloadUrl;
    }
    
    console.log('Updating game in Firestore:', id, dataToUpdate);
    
    await updateDoc(docRef, dataToUpdate);
    console.log('Game updated successfully');
  } catch (error) {
    console.error('Error updating game:', error);
    throw error;
  }
};

// Delete game
export const deleteGame = async (id: string): Promise<void> => {
  try {
    const docRef = doc(db, COLLECTION_NAME, id);
    await deleteDoc(docRef);
  } catch (error) {
    console.error('Error deleting game:', error);
    throw error;
  }
};

// Add review to game
export const addReviewToGame = async (gameId: string, review: Omit<UserReview, 'id' | 'date'>): Promise<void> => {
  try {
    const game = await getGameById(gameId);
    if (!game) throw new Error('Game not found');

    const newReview: UserReview = {
      ...review,
      id: Date.now().toString(),
      date: new Date().toISOString().split('T')[0],
    };

    const updatedReviews = [...(game.reviews || []), newReview];
    const totalReviews = updatedReviews.length;
    
    const distribution = {
      fiveStar: updatedReviews.filter(r => r.rating === 5).length,
      fourStar: updatedReviews.filter(r => r.rating === 4).length,
      threeStar: updatedReviews.filter(r => r.rating === 3).length,
      twoStar: updatedReviews.filter(r => r.rating === 2).length,
      oneStar: updatedReviews.filter(r => r.rating === 1).length,
    };
    
    const totalRating = updatedReviews.reduce((sum, r) => sum + r.rating, 0);
    const avgRating = totalReviews > 0 ? totalRating / totalReviews : 0;

    await updateGame(gameId, {
      reviews: updatedReviews,
      totalReviews,
      ratingDistribution: distribution,
      rating: Math.round(avgRating * 10) / 10,
    });
  } catch (error) {
    console.error('Error adding review:', error);
    throw error;
  }
};

// Search games
export const searchGames = async (searchTerm: string): Promise<Game[]> => {
  try {
    const allGames = await getAllGames();
    return allGames.filter(game =>
      game.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      game.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      game.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
      game.developer.toLowerCase().includes(searchTerm.toLowerCase())
    );
  } catch (error) {
    console.error('Error searching games:', error);
    throw error;
  }
};

// Increment download count for a game
export const incrementDownloads = async (id: string): Promise<void> => {
  try {
    const docRef = doc(db, COLLECTION_NAME, id);
    const docSnap = await getDoc(docRef);
    
    if (docSnap.exists()) {
      const currentDownloads = docSnap.data().downloads || 0;
      await updateDoc(docRef, {
        downloads: currentDownloads + 1,
        updatedAt: serverTimestamp(),
      });
    }
  } catch (error) {
    console.error('Error incrementing downloads:', error);
    throw error;
  }
};

// Get games by category
export const getGamesByCategory = async (category: string): Promise<Game[]> => {
  try {
    const gamesRef = collection(db, COLLECTION_NAME);
    const q = query(gamesRef, where('category', '==', category));
    const querySnapshot = await getDocs(q);
    
    const games: Game[] = [];
    querySnapshot.forEach((doc) => {
      games.push(convertToGame(doc.data(), doc.id));
    });
    
    return games;
  } catch (error) {
    console.error('Error fetching games by category:', error);
    throw error;
  }
};

// Get top rated games
export const getTopRatedGames = async (limitCount: number = 10): Promise<Game[]> => {
  try {
    const allGames = await getAllGames();
    return allGames
      .sort((a, b) => b.rating - a.rating)
      .slice(0, limitCount);
  } catch (error) {
    console.error('Error fetching top rated games:', error);
    throw error;
  }
};

// Get most downloaded games
export const getMostDownloadedGames = async (limitCount: number = 10): Promise<Game[]> => {
  try {
    const allGames = await getAllGames();
    return allGames
      .sort((a, b) => b.downloads - a.downloads)
      .slice(0, limitCount);
  } catch (error) {
    console.error('Error fetching most downloaded games:', error);
    throw error;
  }
};

// Get games by platform
export const getGamesByPlatform = async (platform: string): Promise<Game[]> => {
  try {
    const allGames = await getAllGames();
    return allGames.filter(game => 
      game.platforms && game.platforms.includes(platform)
    );
  } catch (error) {
    console.error('Error fetching games by platform:', error);
    throw error;
  }
};  