// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
const firebaseConfig = {
  apiKey: "AIzaSyD2NKrrgk27bk5aUdhvXJzYcSqx94K4zUU",
  authDomain: "pdbb-chat.firebaseapp.com",
  projectId: "pdbb-chat",
  storageBucket: "pdbb-chat.appspot.com",
  messagingSenderId: "261423407229",
  appId: "1:261423407229:web:d470972f0897a33b95d114"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const auth = getAuth();
export const storage = getStorage();
export const db = getFirestore();