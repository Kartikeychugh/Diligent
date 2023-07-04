import React from "react";
import { createRoot } from "react-dom/client";
import { Provider } from "react-redux";
import { store } from "./app/store";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import "./index.css";
import {
  firebaseAuth,
  firebaseStore,
  googleAuthProvider,
} from "./app/firebase";
import { FirebaseAuthService } from "./services/firebase/firebase-auth.service";
import { FirebaseStoreService } from "./services/firebase/firebase-store.service";

const container = document.getElementById("root")!;
const root = createRoot(container);

const tasks = [
  () => FirebaseAuthService.initialise(firebaseAuth, googleAuthProvider),
  () => FirebaseStoreService.initialise(firebaseStore),
  () => {
    root.render(
      <React.StrictMode>
        <Provider store={store}>
          <App />
        </Provider>
      </React.StrictMode>
    );
  },
];

tasks.forEach((task) => task());

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();

// const db = getFirestore(firebaseApp);
// const docRef = doc(db, "users", uid);
// const docSnap = await getDoc(docRef);
// if (!docSnap.exists()) {
//   setDoc(docRef, {
//     name: user.displayName,
//   });
// }

// const colRef = collection(db, "users", uid, "items");
// await addDoc(colRef, { content: "ejbfkejw" });

// ...
