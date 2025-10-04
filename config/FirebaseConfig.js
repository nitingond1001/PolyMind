// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
    authDomain: "polymind-29919.firebaseapp.com",
    projectId: "polymind-29919",
    storageBucket: "polymind-29919.firebasestorage.app",
    messagingSenderId: "179012680665",
    appId: "1:179012680665:web:62acaee299a2c4b451b7c8",
    measurementId: "G-Y8DXJYR545"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app)
