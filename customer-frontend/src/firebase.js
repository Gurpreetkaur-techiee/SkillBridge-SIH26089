import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyA0aon956sl-wTixO4dlPAbryI-Zv6Q6kQ",
  authDomain: "skillbridge-sih26089.firebaseapp.com",
  projectId: "skillbridge-sih26089",
  storageBucket: "skillbridge-sih26089.firebasestorage.app",
  messagingSenderId: "476786670343",
  appId: "1:476786670343:web:3b37ae28069a941023a2",
  measurementId: "G-XCPSL0HPNW"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);