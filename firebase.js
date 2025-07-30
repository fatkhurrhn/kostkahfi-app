import { initializeApp } from "firebase/app";
import { getFirestore, serverTimestamp, } from "firebase/firestore";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyDtw4TkcgabQYlgsJmAskqLinwJK9n1wKI",
  authDomain: "kost-kahfi.firebaseapp.com",
  projectId: "kost-kahfi",
  storageBucket: "kost-kahfi.firebasestorage.app",
  messagingSenderId: "87691635468",
  appId: "1:87691635468:web:ba4d476630b1025de8b729",
  measurementId: "G-PS1TZW8WB2"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);
const googleProvider = new GoogleAuthProvider();

export { db, app, auth, serverTimestamp, googleProvider };
