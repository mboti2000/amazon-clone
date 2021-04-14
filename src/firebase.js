import firebase from 'firebase';

const firebaseConfig = {
    apiKey: "AIzaSyAF5fqm92oHAVUOne-1T4ZI6ipDiCj4QYk",
    authDomain: "clone-45878.firebaseapp.com",
    projectId: "clone-45878",
    storageBucket: "clone-45878.appspot.com",
    messagingSenderId: "766871719075",
    appId: "1:766871719075:web:4f72c6ef3faf7c4bda4316",
    measurementId: "G-L7JYW0J26L"
};

const firebasApp = firebase.initializeApp(firebaseConfig);

const db = firebasApp.firestore();
const auth = firebase.auth();

export { db, auth };