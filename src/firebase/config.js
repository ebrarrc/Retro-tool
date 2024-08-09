import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyD8d0GzlW_TEaTtQFbbhFjTif0EpRDeCGE",
  authDomain: "retrospark-ad923.firebaseapp.com",
  projectId: "retrospark-ad923",
  storageBucket: "retrospark-ad923.appspot.com",
  messagingSenderId: "344703500925",
  appId: "1:344703500925:web:dff0f0508eb55203c92714",
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const googleProvider = new GoogleAuthProvider();

export { app, auth, db, googleProvider };
