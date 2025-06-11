// src/services/firebase.ts

import { initializeApp, FirebaseApp } from "firebase/app";
import { getAuth, Auth } from 'firebase/auth'; 
// <<< PASSO 1: Importar as funções do Firestore >>>
import { getFirestore, Firestore } from 'firebase/firestore';

// Suas configurações do Firebase (MANTENHA AS SUAS CREDENCIAIS REAIS)
const firebaseConfig = {
  apiKey: "AIzaSyAh4KXf2stl8YjKCy6glZENv3WMpdfbSlg",
  authDomain: "scripty-9a7df.firebaseapp.com",
  projectId: "scripty-9a7df",
  storageBucket: "scripty-9a7df.firebasestorage.app",
  messagingSenderId: "313972080833",
  appId: "1:313972080833:web:b9efd733811f729bfc9440",
  measurementId: "G-351G85Q3FQ"
};

// Inicializar o Firebase
const app: FirebaseApp = initializeApp(firebaseConfig);

// Obter a instância de Autenticação
const auth: Auth = getAuth(app);

// <<< PASSO 2: Obter a instância do Firestore >>>
const db: Firestore = getFirestore(app);

// Se você não for usar o Analytics agora, pode remover estas linhas:
// const analytics = getAnalytics(app);

// <<< PASSO 3: Exportar a instância 'db' juntamente com as outras >>>
export { app, auth, db };