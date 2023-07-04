import { FirebaseApp, initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { Auth, getAuth, GoogleAuthProvider } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyDHlbtkpTSJ8bHKvmYaWnp1EGEfOLCOwO0",
  authDomain: "this-is-diligent.firebaseapp.com",
  projectId: "this-is-diligent",
  storageBucket: "this-is-diligent.appspot.com",
  messagingSenderId: "689895420931",
  appId: "1:689895420931:web:db4665bdc0c90b18e04a36",
  measurementId: "G-D6JN0Q6SB8",
};

export const firebaseApp: FirebaseApp = initializeApp(firebaseConfig);
export const firebaseAuth: Auth = getAuth(firebaseApp);
export const firebaseStore = getFirestore(firebaseApp);
export const googleAuthProvider: GoogleAuthProvider = new GoogleAuthProvider();
