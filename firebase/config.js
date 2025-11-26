import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyDriaN-yvpxJKb1-oe9NBB3oe87cltVzaw",
  authDomain: "myhomeneeds-1616b.firebaseapp.com",
  projectId: "myhomeneeds-1616b",
  storageBucket: "myhomeneeds-1616b.firebasestorage.app",
  messagingSenderId: "346288184754",
  appId: "1:346288184754:web:c2f9ddd87b18cf401a58ab"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);