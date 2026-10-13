import { initializeApp, getApps, getApp } from 'firebase/app';
import { getFirestore, doc, setDoc, onSnapshot, getDoc } from 'firebase/firestore';
import firebaseConfig from '../../firebase-applet-config.json';

const app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);
export const db = getFirestore(app, firebaseConfig.firestoreDatabaseId || '(default)');

export const SHARED_DATA_DOC = doc(db, 'community', 'app_data');

export const saveSharedDataToFirestore = async (data: Record<string, any>) => {
  try {
    await setDoc(SHARED_DATA_DOC, data, { merge: true });
  } catch (err) {
    console.error('Error syncing data to Firestore:', err);
  }
};
