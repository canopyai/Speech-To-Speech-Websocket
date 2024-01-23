import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyAPZA6Uw2WXWaKDyIA7utRLqWM9NcgKWNY",
  authDomain: "speechsdk.firebaseapp.com",
  projectId: "speechsdk",
  storageBucket: "speechsdk.appspot.com",
  messagingSenderId: "132583370615",
  appId: "1:132583370615:web:1d5b0e36078c3b40277b72"
};

export const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);