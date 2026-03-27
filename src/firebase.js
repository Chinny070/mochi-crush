import { initializeApp } from "firebase/app";
import { getFirestore, collection, addDoc, getDocs, orderBy, query, limit } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyCv1QC7GmUJBX6C7-1hbPLuYqdrt3YK5HM",
  authDomain: "mochi-crush.firebaseapp.com",
  projectId: "mochi-crush",
  storageBucket: "mochi-crush.firebasestorage.app",
  messagingSenderId: "93333794522",
  appId: "1:93333794522:web:5f95eeeff12f51467dffe3",
  measurementId: "G-MTCR533VEC"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export async function saveScore(name, score) {
  try {
    await addDoc(collection(db, "leaderboard"), {
      name: name,
      score: score,
      date: new Date().toLocaleDateString()
    });
  } catch (e) {
    console.error("Error saving score: ", e);
  }
}

export async function getLeaderboard() {
  try {
    const q = query(
      collection(db, "leaderboard"),
      orderBy("score", "desc"),
      limit(5)
    );
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => doc.data());
  } catch (e) {
    console.error("Error getting leaderboard: ", e);
    return [];
  }
}