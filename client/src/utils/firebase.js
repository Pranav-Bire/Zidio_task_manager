// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_APP_FIREBASE_API_KEY,
  authDomain: "zidio-task-manager.firebaseapp.com",
  projectId: "zidio-task-manager",
  storageBucket: "zidio-task-manager.firebasestorage.app",
  messagingSenderId: "808388533534",
  appId: "1:808388533534:web:ac76070dfb05339b1efd0f"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);