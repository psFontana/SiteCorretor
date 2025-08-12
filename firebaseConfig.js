// firebase-config.js
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

// Suas chaves de configuração do Firebase
const firebaseConfig = {
  apiKey: "AIzaSyBY6AlwA6Zwk3jyvVpaZQ9jhWD6rO8JqTU",
  authDomain: "corretor-d85aa.firebaseapp.com",
  projectId: "corretor-d85aa",
  storageBucket: "corretor-d85aa.firebasestorage.app",
  messagingSenderId: "463637040600",
  appId: "1:463637040600:web:9bb54b4c3d481a33e9f6ad",
};

// Inicializa o Firebase
const app = initializeApp(firebaseConfig);

// Obtém uma instância do Firestore
export const db = getFirestore(app);
