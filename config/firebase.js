import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';
const firebaseConfig = {
  apiKey: "AIzaSyDH2C6FkLj_1FUTmJ-IK6-Pt1djwEkpFWY",
  authDomain: "assignment-b55cf.firebaseapp.com",
  databaseURL: "https://assignment-b55cf-default-rtdb.firebaseio.com",
  projectId: "assignment-b55cf",
  storageBucket: "assignment-b55cf.appspot.com",
  messagingSenderId: "999303321586",
  appId: "1:999303321586:web:12a028cf6a8f8785f43d6b"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const storage = getStorage(app);

export { app, db, storage };