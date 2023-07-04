import {
  DocumentData,
  Firestore,
  Query,
  QuerySnapshot,
  WithFieldValue,
  addDoc,
  collection,
  doc,
  getDoc,
  getDocs,
  onSnapshot,
  query,
  setDoc,
} from "firebase/firestore";

export class FirebaseStoreService {
  static #key = Symbol();
  static #instance: FirebaseStoreService;
  #firebaseStore: Firestore;

  constructor(firebaseStore: Firestore, key?: Symbol) {
    if (key !== FirebaseStoreService.#key) {
      throw Error(
        "Use getInstance method to get an instance of FirebaseStoreService"
      );
    }

    this.#firebaseStore = firebaseStore;
  }

  static initialise(firebaseStore: Firestore) {
    if (!FirebaseStoreService.#instance) {
      FirebaseStoreService.#instance = new FirebaseStoreService(
        firebaseStore,
        FirebaseStoreService.#key
      );
    }
  }

  static getInstance() {
    if (!FirebaseStoreService.#instance) {
      throw Error("Please initialise FirebaseStoreService");
    }

    return this.#instance;
  }

  getDocumentRef = (path: string, pathSegments: string[]) => {
    return doc(this.#firebaseStore, path, ...pathSegments);
  };

  getDocumentSnap = (docRef: ReturnType<typeof doc>) => {
    return getDoc(docRef);
  };

  getCollectionRef = (path: string, pathSegments: string[]) => {
    return collection(this.#firebaseStore, path, ...pathSegments);
  };

  getDocuments = <T>(q: ReturnType<typeof query<T>>) => {
    return getDocs(q);
  };

  setDocument = (
    docRef: ReturnType<typeof doc>,
    data: WithFieldValue<DocumentData>
  ) => {
    return setDoc(docRef, data);
  };

  addDocument = (
    colRef: ReturnType<typeof collection>,
    data: WithFieldValue<DocumentData>
  ) => {
    return addDoc(colRef, data);
  };

  listen = (
    q: Query<DocumentData>,
    callback: (qs: QuerySnapshot<DocumentData>) => void
  ) => {
    return onSnapshot(q, callback);
  };
}
