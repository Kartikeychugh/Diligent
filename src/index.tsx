import React from "react";
import { createRoot } from "react-dom/client";
import { Provider } from "react-redux";
import { store } from "./app/store";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import "./index.css";

const container = document.getElementById("root")!;
const root = createRoot(container);

root.render(
  <React.StrictMode>
    <Provider store={store}>
      <App />
    </Provider>
  </React.StrictMode>
);

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

// useEffect(() => {
//   Services.FirebaseStoreService.then((service) => {
//     const docRef = service.getDocumentRef("users", [userId]);
//     service.getDocumentSnap(docRef).then((res) => {
//       if (!res.exists()) {
//         service.setDocument(docRef, { name, email });
//       }
//     });
//   });
// }, [email, name, userId]);

// useEffect(() => {
//   Services.FirebaseStoreService.then((service) => {
//     const docRef = service.getDocumentRef("users", [userId]);
//     service.getDocumentSnap(docRef).then((res) => {
//       if (!res.exists()) {
//         service.setDocument(docRef, { name, email });
//       }
//     });
//   });

//   const fn = fbss.listen(
//     query(fbss.getCollectionRef("users", [userId, "items"])).withConverter(
//       todoItemConverter
//     ),
//     (querySnapshot) => {
//       if (querySnapshot.metadata.hasPendingWrites) return;

//       querySnapshot.docChanges().forEach((change) => {
//         console.log(change.doc.data());
//       });
//     }
//   );

//   return () => {
//     fn();
//   };
// }, [fbss, userId]);
