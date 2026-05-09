import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey:            "AIzaSyAcZ3y60n40T9OWWNLczFQBZJC7PhRc0dg",
  authDomain:        "my-memo-6517d.firebaseapp.com",
  projectId:         "my-memo-6517d",
  storageBucket:     "my-memo-6517d.firebasestorage.app",
  messagingSenderId: "41447344208",
  appId:             "1:41447344208:web:251aa924607c7dd2d32955"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
