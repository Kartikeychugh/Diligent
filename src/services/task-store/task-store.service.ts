import {
  CollectionReference,
  DocumentData,
  QuerySnapshot,
} from "firebase/firestore";
import { IFirebaseStoreService } from "../firebase";
import { Services } from "../service-manager";
import {
  TodoItem,
  todoItemConverter,
} from "../../models/todo-item/todo-item.model";
import { QueryBuilder } from "../../utils";

export interface ITaskStoreService extends IFirebaseStoreService {
  getAllTasks(userId: string): Promise<QuerySnapshot<TodoItem>>;
  getItemsCollectionRef(userId: string): CollectionReference<DocumentData>;
}

const TaskStoreServiceFactory = async () => {
  const firebaseStoreService = await Services.FirebaseStoreService;
  const service: ITaskStoreService = Object.create(firebaseStoreService);

  service.getAllTasks = function getAllTasks(userId: string) {
    const colRef =
      this.getItemsCollectionRef(userId).withConverter(todoItemConverter);

    const Q = QueryBuilder()
      .colRef(colRef)
      .generate()
      .withConverter(todoItemConverter);

    return this.getDocuments(Q);
  };

  service.getItemsCollectionRef = function getItemsCollectionRef(
    userId: string
  ) {
    return this.getCollectionRef("users", [userId, "items"]);
  };

  return Object.freeze(service);
};

export const taskStoreService = TaskStoreServiceFactory();
