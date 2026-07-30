import { collection, getDocs, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../config/firebase';

export const testFirestoreConnection = async () => {
  try {
    console.log('Testing Firestore connection...');
    
    // Test read
    const gamesRef = collection(db, 'games');
    const snapshot = await getDocs(gamesRef);
    console.log('Firestore connection successful!');
    console.log('Number of games:', snapshot.size);
    
    // Test write
    const testDoc = await addDoc(collection(db, 'games'), {
      test: true,
      title: 'Test Game',
      createdAt: serverTimestamp(),
    });
    console.log('Test write successful! Document ID:', testDoc.id);
    
    return true;
  } catch (error) {
    console.error('Firestore connection error:', error);
    return false;
  }
};
