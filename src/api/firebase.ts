import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
const projectId = process.env.EXPO_PUBLIC_FIREBASE_PROJECT_ID;
console.log("Firebase Project ID:", projectId);
const firebaseConfig = {
  apiKey: process.env.EXPO_PUBLIC_FIREBASE_API_KEY,
  authDomain: `${projectId}.firebaseapp.com`,
  projectId,
  storageBucket: `${projectId}.firebasestorage.app`,
  messagingSenderId: process.env.EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.EXPO_PUBLIC_FIREBASE_APP_ID,
  measurementId: process.env.EXPO_PUBLIC_FIREBASE_MEASUREMENT_ID,
};
console.log("Firebase Config:", firebaseConfig);
const app = initializeApp(firebaseConfig);

export const db = getFirestore(app);
