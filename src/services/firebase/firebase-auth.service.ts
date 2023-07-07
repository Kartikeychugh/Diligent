import {
  NextOrObserver,
  Unsubscribe,
  User,
  onAuthStateChanged,
  signInWithPopup,
  signOut,
} from "firebase/auth";
import { FirebaseApp, initializeApp } from "firebase/app";
import { Firestore, getFirestore } from "firebase/firestore";
import { Auth, getAuth, GoogleAuthProvider } from "firebase/auth";

export interface IFirebaseAuthService {
  firebaseApp: FirebaseApp;
  firebaseAuth: Auth;
  firebaseStore: Firestore;
  googleAuthProvider: GoogleAuthProvider;
  login: () => Promise<User>;
  logout: () => Promise<void>;
  watchLoginState: (listener: NextOrObserver<User>) => Unsubscribe;
}

const FirebaseAuthServiceFactory = (): IFirebaseAuthService => {
  const firebaseConfig = {
    apiKey: "AIzaSyDHlbtkpTSJ8bHKvmYaWnp1EGEfOLCOwO0",
    authDomain: "this-is-diligent.firebaseapp.com",
    projectId: "this-is-diligent",
    storageBucket: "this-is-diligent.appspot.com",
    messagingSenderId: "689895420931",
    appId: "1:689895420931:web:db4665bdc0c90b18e04a36",
    measurementId: "G-D6JN0Q6SB8",
  };

  const firebaseApp: FirebaseApp = initializeApp(firebaseConfig);
  const firebaseAuth: Auth = getAuth(firebaseApp);
  const firebaseStore = getFirestore(firebaseApp);
  const googleAuthProvider: GoogleAuthProvider = new GoogleAuthProvider();

  return Object.freeze({
    firebaseApp,
    firebaseAuth,
    firebaseStore,
    googleAuthProvider,
    login: async function () {
      if (firebaseAuth.currentUser) return firebaseAuth.currentUser;
      const userCredentials = await signInWithPopup(
        firebaseAuth,
        googleAuthProvider
      );
      return userCredentials.user;
    },
    logout: function () {
      return signOut(firebaseAuth);
    },
    watchLoginState: function (listener: NextOrObserver<User>) {
      return onAuthStateChanged(firebaseAuth, listener);
    },
  });
};

export const firebaseAuthService = FirebaseAuthServiceFactory();
