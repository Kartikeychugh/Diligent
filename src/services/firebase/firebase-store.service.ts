import {
  CollectionReference,
  DocumentData,
  DocumentReference,
  DocumentSnapshot,
  Query,
  QuerySnapshot,
  Unsubscribe,
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
import { firebaseStore } from "../../app/firebase";

export interface IFirebaseStoreService {
  getDocumentRef: (
    path: string,
    pathSegments: string[]
  ) => DocumentReference<DocumentData>;
  getDocumentSnap: (
    docRef: ReturnType<typeof doc>
  ) => Promise<DocumentSnapshot<DocumentData>>;
  getCollectionRef: (
    path: string,
    pathSegments: string[]
  ) => CollectionReference<DocumentData>;
  getDocuments: <T>(q: Query<T>) => Promise<QuerySnapshot<T>>;
  setDocument: (
    docRef: ReturnType<typeof doc>,
    data: WithFieldValue<DocumentData>
  ) => Promise<void>;
  addDocument: (
    colRef: ReturnType<typeof collection>,
    data: WithFieldValue<DocumentData>
  ) => Promise<DocumentReference<DocumentData>>;
  listen: (
    q: Query<DocumentData>,
    callback: (qs: QuerySnapshot<DocumentData>) => void
  ) => Unsubscribe;
}

export class FirebaseStoreService implements IFirebaseStoreService {
  static #key = Symbol();
  static #instance: FirebaseStoreService;

  static {
    FirebaseStoreService.#instance = new FirebaseStoreService(
      FirebaseStoreService.#key
    );
  }
  constructor(key?: Symbol) {
    if (key !== FirebaseStoreService.#key) {
      throw Error(
        "Use getInstance method to get an instance of FirebaseStoreService"
      );
    }
  }

  static getInstance() {
    return FirebaseStoreService.#instance;
  }

  getDocumentRef = (path: string, pathSegments: string[]) => {
    return doc(firebaseStore, path, ...pathSegments);
  };

  getDocumentSnap = (docRef: ReturnType<typeof doc>) => {
    return getDoc(docRef);
  };

  getCollectionRef = (path: string, pathSegments: string[]) => {
    return collection(firebaseStore, path, ...pathSegments);
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
