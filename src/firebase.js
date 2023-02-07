import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyBFWu66Z-nKkFMqZdXSn9vkZcTKsgXsFi0",
  authDomain: "mortgage-3d1a3.firebaseapp.com",
  projectId: "mortgage-3d1a3",
  storageBucket: "mortgage-3d1a3.appspot.com",
  messagingSenderId: "424787319821",
  appId: "1:424787319821:web:33db9efa2b8261e8a2c944",
  measurementId: "G-NCG8Y4HETS"
};

const app = initializeApp(firebaseConfig);

const auth = getAuth();

export { app, auth };
