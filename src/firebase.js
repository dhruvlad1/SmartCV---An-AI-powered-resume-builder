// src/firebase.js
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// --- PASTE YOUR KEYS FROM FIREBASE CONSOLE BELOW ---
const firebaseConfig = {
  apiKey: "AIzaSyDoUb27FIKkAv7m1ABInl3kSVKqqH6XfMo",
  authDomain: "smartcv-b0fce.firebaseapp.com",
  projectId: "smartcv-b0fce",
  storageBucket: "smartcv-b0fce.firebasestorage.app",
  messagingSenderId: "554125669255",
  appId: "1:554125669255:web:fc018294e93367cbc95922"
};
// ---------------------------------------------------

// Initialize the connection
const app = initializeApp(firebaseConfig);

// Export the tools for your pages to use
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
export const db = getFirestore(app);