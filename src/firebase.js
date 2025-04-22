import { initializeApp } from "firebase/app";
import { getAuth, signInWithEmailAndPassword, signOut } from "firebase/auth";
import { getFirestore, collection, addDoc, getDocs, doc, deleteDoc, updateDoc } from "firebase/firestore";
import { getStorage } from "firebase/storage";


const firebaseConfig = {
  apiKey: "AIzaSyCZU9VOBHiEFL2fwZPVA2Aa3jYE6pu4Uo8",
  authDomain: "anakprogram-596c2.firebaseapp.com",
  projectId: "anakprogram-596c2",
  storageBucket: "anakprogram-596c2.appspot.com",
  messagingSenderId: "181641588610",
  appId: "1:181641588610:web:1b42b3363d80018cc5a99b",
  measurementId: "G-EBCMRNVRRW"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

const storage = getStorage(app);

export const galleryRef = collection(db, "gallery_mahasantri"); // Nama collection disesuaikan
export { db, storage };

export { 
  auth, 
  signInWithEmailAndPassword, 
  signOut,
  collection,
  addDoc,
  getDocs,
  doc,
  deleteDoc,
  updateDoc
};
