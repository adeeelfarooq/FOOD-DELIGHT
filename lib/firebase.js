// lib/firebase.js
// Web-only Firebase config, used by the Next.js app (imported via the "@/lib/firebase" alias).
// IMPORTANT: do NOT import "react-native" or "@react-native-async-storage/async-storage" here —
// Next.js's webpack bundler cannot parse React Native's source files, which is what was breaking
// `npm run dev`. The mobile (Expo/React Native) app uses lib/firebase.native.js instead.
import { getApps, initializeApp } from "firebase/app";
import { browserLocalPersistence, getAuth, setPersistence } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID,
};

// Initialize Firebase app
const app = !getApps().length ? initializeApp(firebaseConfig) : getApps()[0];

// Initialize Auth (web)
const auth = getAuth(app);
setPersistence(auth, browserLocalPersistence);

// Firestore
const db = getFirestore(app);

export { auth, db };
export default app;
