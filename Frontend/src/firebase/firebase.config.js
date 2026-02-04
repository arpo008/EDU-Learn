// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// analytics আপাতত না লাগলে বাদ দিতে পারেন, তবে থাকলে সমস্যা নেই

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBEtXoRoMqWIgseU4THpzbMjDk4ieF7pfc",
  authDomain: "edulearn-capstone.firebaseapp.com",
  projectId: "edulearn-capstone",
  storageBucket: "edulearn-capstone.firebasestorage.app",
  messagingSenderId: "108815959893",
  appId: "1:108815959893:web:01f0f5a65ff4a08601d1dc",
  measurementId: "G-NYFRRRG5R7"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// ✅ এই লাইনটি থাকার কারণেই এখন AuthProvider কাজ করবে
export default app;