// import { initializeApp } from "firebase/app";
// import { getAuth } from "firebase/auth";
// import { getFirestore, collection, onSnapshot} from "firebase/firestore";

// const firebaseConfig = {
//   apiKey: "AIzaSyBCY66EkbFvk3bQWzFEwRn8h5HiwOmFsjQ",
//   authDomain: "kahfi-app.firebaseapp.com",
//   projectId: "kahfi-app",
//   storageBucket: "kahfi-app.appspot.com",
//   messagingSenderId: "379101749420",
//   appId: "1:379101749420:web:1a2641b731647f76577f09",
//   measurementId: "G-TGLBR3J0VY"
// };

// const app = initializeApp(firebaseConfig);
// export const auth = getAuth(app);
// export const db = getFirestore(app);
// // Tambahkan ini di firebase.js
// export const pembayaranCollection = collection(db, 'pembayaran');
// export { onSnapshot, collection }; // Tambahkan ini


import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyAOD0_MUnLUspaeUngwdAnMVAUbFkRf_gg",
  authDomain: "bismillah-ta-a66e9.firebaseapp.com",
  projectId: "bismillah-ta-a66e9",
  storageBucket: "bismillah-ta-a66e9.appspot.com",
  messagingSenderId: "211717103553",
  appId: "1:211717103553:web:df8c9f2241586abced1940",
  measurementId: "G-XE1W44PED7"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);

export { db, auth };