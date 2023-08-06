// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyA7zgrJxbbqaOVju-6CyVQMmBB16tV90KM",
  authDomain: "photofolio-85af1.firebaseapp.com",
  projectId: "photofolio-85af1",
  storageBucket: "photofolio-85af1.appspot.com",
  messagingSenderId: "88983782231",
  appId: "1:88983782231:web:81460b02fd947693b1b412"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
// Initialize Cloud Firestore and get a reference to the service
export const db = getFirestore(app);
