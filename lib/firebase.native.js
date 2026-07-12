// firebase.js
import AsyncStorage from "@react-native-async-storage/async-storage";
import { getApps, initializeApp } from "firebase/app";
import { browserLocalPersistence, getAuth, getReactNativePersistence, initializeAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { Platform } from "react-native";

const firebaseConfig = {
  apiKey: "AIzaSyCC3thrnyvL7w22Mw2CFthv-pkA7Mr-hk4",
  authDomain: "react-native-9466e.firebaseapp.com",
  projectId: "react-native-9466e",
  storageBucket: "react-native-9466e.firebasestorage.app",
  messagingSenderId: "211006278124",
  appId: "1:211006278124:web:8e3b0c6dbaf575fcf018c9",
  measurementId: "G-ZQLZ768G23",
};

// Initialize Firebase app
const app = !getApps().length ? initializeApp(firebaseConfig) : getApps()[0];

// Initialize Auth
let auth;

if (Platform.OS === "web") {
  auth = getAuth(app);
  auth.setPersistence(browserLocalPersistence);
} else {
  // ✅ For React Native, check if already initialized
  try {
    auth = initializeAuth(app, {
      persistence: getReactNativePersistence(AsyncStorage),
    });
  } catch (e) {
    // Already initialized
    auth = getAuth(app);
  }
}

// Firestore
const db = getFirestore(app);

export { auth, db };
export default app;
