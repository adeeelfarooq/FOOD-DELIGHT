import { initializeApp, getApps } from "firebase/app"
import { getAuth } from "firebase/auth"
import { getFirestore } from "firebase/firestore"

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyA0i_B_mRsVz9uSv6bZ_5WRUC0N6L2rBUU",
  authDomain: "food-ordering-system-fcef3.firebaseapp.com",
  projectId: "food-ordering-system-fcef3",
  storageBucket: "food-ordering-system-fcef3.firebasestorage.app",
  messagingSenderId: "1006535419740",
  appId: "1:1006535419740:web:ea98cdf5976552cbe70399",
}

// Initialize Firebase
let app
if (!getApps().length) {
  app = initializeApp(firebaseConfig)
} else {
  app = getApps()[0]
}

// Initialize Firebase services
export const auth = getAuth(app)
export const db = getFirestore(app)

export default app
