import {
  DocumentData,
  QueryDocumentSnapshot,
  SnapshotOptions,
  Timestamp,
  serverTimestamp,
} from "firebase/firestore";

export class TodoItem {
  title: string;
  description: string;
  createdOn: ReturnType<typeof serverTimestamp>;
  done: boolean;

  constructor(
    title: string,
    description: string,
    createdOn: ReturnType<typeof serverTimestamp>,
    done: boolean
  ) {
    this.title = title;
    this.description = description;
    this.createdOn = createdOn;
    this.done = done;
  }

  toString() {
    return (this.createdOn as Timestamp).toDate();
  }
}

export const todoItemConverter = {
  toFirestore: (todoItem: TodoItem) => {
    return {
      title: todoItem.title,
      description: todoItem.description,
      createdOn: todoItem.createdOn,
      done: todoItem.done,
    };
  },
  fromFirestore: (
    snapshot: QueryDocumentSnapshot<DocumentData>,
    options?: SnapshotOptions
  ): TodoItem => {
    const data = snapshot.data(options);
    return new TodoItem(
      data.title,
      data.description,
      data.createdOn,
      data.done
    );
  },
};
