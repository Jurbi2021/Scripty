// src/services/firebase.ts

import { initializeApp, FirebaseApp } from 'firebase/app';
// Adicionar a importação para getAuth e o tipo Auth
import { getAuth, Auth } from 'firebase/auth'; 
// A importação de getAnalytics é opcional para a autenticação. Removida para simplificar por agora.
// import { getAnalytics } from "firebase/analytics"; 

// Suas configurações do Firebase (MANTENHA AS SUAS CREDENCIAIS REAIS AQUI)
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

// Se você não for usar o Analytics agora, pode remover estas linhas:
// const analytics = getAnalytics(app);

// Exportar as instâncias que você usará na sua aplicação
export { app, auth }; // Exportamos 'auth' que será usado para login, registo, etc.