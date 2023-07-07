import {
  DocumentData,
  QueryDocumentSnapshot,
  SnapshotOptions,
  Timestamp,
} from "firebase/firestore";

export class TodoItem {
  id: string;
  title: string;
  description: string;
  createdOn: Timestamp;
  dueDate: number;
  done: boolean;

  constructor(
    id: string,
    title: string,
    description: string,
    createdOn: Timestamp,
    dueDate: string,
    done: boolean
  ) {
    this.id = id;
    this.title = title;
    this.description = description;
    this.createdOn = createdOn;
    this.done = done;
    this.dueDate = dueDate ? new Date(dueDate).getTime() : 0;
  }
}

export const todoItemConverter = {
  toFirestore: (todoItem: TodoItem) => {
    return {
      title: todoItem.title,
      description: todoItem.description,
      createdOn: todoItem.createdOn,
      done: todoItem.done,
      dueDate: todoItem.dueDate,
    };
  },
  fromFirestore: (
    snapshot: QueryDocumentSnapshot<DocumentData>,
    options?: SnapshotOptions
  ): TodoItem => {
    const data = snapshot.data(options);
    return new TodoItem(
      snapshot.id,
      data.title,
      data.description,
      data.createdOn,
      data.dueDate,
      data.done
    );
  },
};
