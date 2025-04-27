import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore, collection, onSnapshot} from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyBCY66EkbFvk3bQWzFEwRn8h5HiwOmFsjQ",
  authDomain: "kahfi-app.firebaseapp.com",
  projectId: "kahfi-app",
  storageBucket: "kahfi-app.appspot.com",
  messagingSenderId: "379101749420",
  appId: "1:379101749420:web:1a2641b731647f76577f09",
  measurementId: "G-TGLBR3J0VY"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
// Tambahkan ini di firebase.js
export const pembayaranCollection = collection(db, 'pembayaran');
export { onSnapshot, collection }; // Tambahkan ini
