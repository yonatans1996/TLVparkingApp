import firebase from "firebase/app";
import "firebase/auth";
import "firebase/firestore";
import secret from "./secret";
const firebaseConfig = {
  apiKey: secret.API_KEY,
  authDomain: secret.AUTH_DOMAIN,
  projectId: secret.PROJECT_ID,
  storageBucket: secret.STORAGE_BUCKET,
  messagingSenderId: secret.MESSAGING_SENDER_ID,
  appId: secret.APPID,
};
export const app = firebase.initializeApp(firebaseConfig);
export const auth = app.auth();
const storage = firebase.firestore();
export { storage, firebase as default };
