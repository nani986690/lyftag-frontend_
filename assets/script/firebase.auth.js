import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyCb5BR3mDssjKWOdMuRGbWnEbcJYbjK6Ek",
  authDomain: "lyftag-fea6a.firebaseapp.com",
  projectId: "lyftag-fea6a",
  storageBucket: "lyftag-fea6a.firebasestorage.app",
  messagingSenderId: "1068115432380",
  appId: "1:1068115432380:web:4e0fbf0ac32bb427e111b9",
};

initializeApp(firebaseConfig);

const auth = getAuth();
const db = getFirestore();

let currentUser = null;

auth.onAuthStateChanged((user) => {
  if (user) {
    currentUser = user;
  } else {
    currentUser = null;
  }
});

const getCurrentUser = () => currentUser;

const getCurrentUserIdToken = async () => {
  const user = await getCurrentUser();
  if (!user) {
    throw new Error("No user is currently logged in");
  }
  return await user.getIdToken();
};

export { auth, db, firebaseConfig, getCurrentUser, getCurrentUserIdToken };
