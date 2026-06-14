// Firebase Configuration
// Emaús Parejas Ibagué - Intenciones de Oración

const firebaseConfig = {
    apiKey: "AIzaSyBUDKMb14_STr-xGvHxDBAaS9mXIqyQQwQ",
    authDomain: "emaus-parejas-ibague.firebaseapp.com",
    projectId: "emaus-parejas-ibague",
    storageBucket: "emaus-parejas-ibague.firebasestorage.app",
    messagingSenderId: "802672849323",
    appId: "1:802672849323:web:e558f9520918b948cda2ee"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);

// Initialize Firestore
const db = firebase.firestore();

// Collection reference
const intencionesRef = db.collection('intenciones');
