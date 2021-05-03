import firebase from "firebase/app";
import "firebase/auth";
import "firebase/firestore";
const firebaseConfig = {
  apiKey: "AIzaSyAM5kUWITztlOqJ7t8_zupos5-Adh6PypE",
  authDomain: "parkingtlv103.firebaseapp.com",
  projectId: "parkingtlv103",
  storageBucket: "parkingtlv103.appspot.com",
  messagingSenderId: "450372316952",
  appId: "1:450372316952:web:8169ea8d94dd7fae98f86d",
};
export const app = firebase.initializeApp(firebaseConfig);
export const auth = app.auth();
const storage = firebase.firestore();
export { storage, firebase as default };
