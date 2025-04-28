// Import the functions you need from the SDKs you need
import { getApp, getApps, initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCfbdm64v8sY7uH2cqXQVyc5sx01dIdrF4",
  authDomain: "skillsbridge-a4c87.firebaseapp.com",
  projectId: "skillsbridge-a4c87",
  storageBucket: "skillsbridge-a4c87.firebasestorage.app",
  messagingSenderId: "326288109473",
  appId: "1:326288109473:web:944d7a6078c3a3371025e0",
  measurementId: "G-ZHXBVNR9J3",
};

// Initialize Firebase
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();
const auth = getAuth(app);
auth.useDeviceLanguage();

export { auth };
