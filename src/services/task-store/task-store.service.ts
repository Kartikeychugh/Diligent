import {
  CollectionReference,
  DocumentData,
  DocumentReference,
  DocumentSnapshot,
  Unsubscribe,
  deleteDoc,
  onSnapshot,
  updateDoc,
} from "firebase/firestore";
import { IFirebaseStoreService } from "../firebase";
import { Services } from "../service-manager";
import { TodoItem, todoItemConverter } from "../../models";
import { QueryBuilder } from "../../utils";

export interface ITaskStoreService extends IFirebaseStoreService {
  getTaskRef(id: string): DocumentReference<DocumentData>;
  getAllTasks(): Promise<TodoItem[]>;
  getItemsCollectionRef(): CollectionReference<DocumentData>;
  deleteTask(id: string): Promise<void>;
  updateDocument: (id: string, data: DocumentData) => Promise<void>;
  watchTaskChanges(
    id: string,
    listener: (qs: DocumentSnapshot<DocumentData>) => void
  ): Unsubscribe;
  getTaskSnapshot: (
    this: ITaskStoreService,
    id: string
  ) => Promise<DocumentSnapshot<TodoItem>>;
  addTask: (
    this: ITaskStoreService,
    task: TodoItem
  ) => Promise<DocumentReference<DocumentData>>;
}

const TaskStoreServiceFactory = async () => {
  const firebaseStoreService = await Services.FirebaseStoreService;
  const taskStoreService: ITaskStoreService = Object.assign(
    Object.create(firebaseStoreService),
    {
      getAllTasks: async function getAllTasks(this: ITaskStoreService) {
        if (!this.firebaseAuth.currentUser) throw new Error("");

        const colRef =
          this.getItemsCollectionRef().withConverter(todoItemConverter);

        const Q = QueryBuilder()
          .colRef(colRef)
          .generate()
          .withConverter(todoItemConverter);

        const snapshot = await this.getDocuments(Q);
        return snapshot.docs.map((doc) => doc.data());
      },
      addTask: function addTask(this: ITaskStoreService, task: TodoItem) {
        return this.addDocument(
          this.getItemsCollectionRef().withConverter(todoItemConverter),
          task
        );
      },
      getItemsCollectionRef: function getItemsCollectionRef(
        this: ITaskStoreService
      ) {
        if (!this.firebaseAuth.currentUser) throw new Error("");
        return this.getCollectionRef("users", [
          this.firebaseAuth.currentUser.uid,
          "items",
        ]);
      },
      getTaskRef: function getTaskRef(this: ITaskStoreService, id: string) {
        if (!this.firebaseAuth.currentUser) throw new Error("");
        return this.getDocumentRef("users", [
          this.firebaseAuth.currentUser.uid,
          "items",
          id,
        ]);
      },
      getTaskSnapshot: function getTaskSnapshot(
        this: ITaskStoreService,
        id: string
      ) {
        if (!this.firebaseAuth.currentUser) throw new Error("");
        return this.getDocumentSnap(
          this.getDocumentRef("users", [
            this.firebaseAuth.currentUser.uid,
            "items",
            id,
          ]).withConverter(todoItemConverter)
        );
      },
      watchTaskChanges: function watchTaskChanges(
        this: ITaskStoreService,
        id: string,
        listener: (qs: DocumentSnapshot<DocumentData>) => void
      ) {
        if (!this.firebaseAuth.currentUser) throw new Error("");
        return onSnapshot(this.getTaskRef(id), listener);
      },
      deleteTask: function deleteTask(this: ITaskStoreService, id: string) {
        if (!this.firebaseAuth.currentUser) throw new Error("");
        const ref = this.getTaskRef(id);
        return deleteDoc(ref);
      },
      updateDocument: function (
        this: ITaskStoreService,
        id: string,
        data: DocumentData
      ) {
        const ref = this.getTaskRef(id);
        return updateDoc(ref, data);
      },
    }
  );

  return Object.freeze(taskStoreService);
};

export const taskStoreService = TaskStoreServiceFactory();
