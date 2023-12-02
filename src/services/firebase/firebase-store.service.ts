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
import { IFirebaseAuthService } from "./firebase-auth.service";
import { Services } from "../service-manager";

export interface IFirebaseStoreService extends IFirebaseAuthService {
  getDocumentRef: (
    path: string,
    pathSegments: string[]
  ) => DocumentReference<DocumentData>;
  getDocumentSnap: <T>(
    docRef: DocumentReference<T>
  ) => Promise<DocumentSnapshot<T>>;
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

const FirebaseStoreServiceFactory = async () => {
  const firebaseAuthService = await Services.FirebaseAuthService;

  const service: IFirebaseStoreService = Object.create(firebaseAuthService);

  service.getDocumentRef = function (path: string, pathSegments: string[]) {
    return doc(this.firebaseStore, path, ...pathSegments);
  };

  service.getDocumentSnap = function <T>(docRef: DocumentReference<T>) {
    return getDoc<T>(docRef);
  };

  service.getCollectionRef = function (path: string, pathSegments: string[]) {
    return collection(this.firebaseStore, path, ...pathSegments);
  };

  service.getDocuments = function <T>(q: ReturnType<typeof query<T>>) {
    return getDocs(q);
  };

  service.setDocument = function (
    docRef: ReturnType<typeof doc>,
    data: WithFieldValue<DocumentData>
  ) {
    return setDoc(docRef, data);
  };

  service.addDocument = function (
    colRef: ReturnType<typeof collection>,
    data: WithFieldValue<DocumentData>
  ) {
    return addDoc(colRef, data);
  };

  service.listen = function <T>(
    q: Query<T>,
    callback: (qs: QuerySnapshot<T>) => void
  ) {
    return onSnapshot(
      q,
      { includeMetadataChanges: false },
      callback,
      (err) => {}
    );
  };

  return Object.freeze(service);
};

export const firebaseStoreService = FirebaseStoreServiceFactory();
