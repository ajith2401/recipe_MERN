// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
apiKey: "AIzaSyBmXMzAZICdrl1Ia8y95-8buK4T1VZeSBg",
  authDomain: "recipe-mern.firebaseapp.com",
  projectId: "recipe-mern",
  storageBucket: "recipe-mern.appspot.com",
  messagingSenderId: "746610850465",
  appId: "1:746610850465:web:336182f6c134fc294e4ee0"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);