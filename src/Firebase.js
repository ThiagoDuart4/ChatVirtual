// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore"; // Nova importação para Firestore
import { getAuth, GoogleAuthProvider } from "firebase/auth"; // Nova importação para Auth

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBv6LaL8FYWZ7jwCe5Dj6JGCdK1dskX5Aw",
  authDomain: "zapbot-e1c4b.firebaseapp.com",
  projectId: "zapbot-e1c4b",
  storageBucket: "zapbot-e1c4b.appspot.com",
  messagingSenderId: "643664996268",
  appId: "1:643664996268:web:5e1f1d357a8ab385837c09",
  measurementId: "G-WY8B6F4FVL"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

// Inicializar Firestore e Auth usando as funções corretas no SDK v9
const db = getFirestore(app); // Inicializar Firestore
const auth = getAuth(app); // Inicializar Auth
const provider = new GoogleAuthProvider(); // Inicializar o provedor de autenticação do Google

export { db, auth, provider };