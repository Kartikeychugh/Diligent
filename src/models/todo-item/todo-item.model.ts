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
  color: string;

  constructor(
    id: string,
    title: string,
    description: string,
    createdOn: Timestamp,
    dueDate: number,
    done: boolean,
    color = "white"
  ) {
    this.id = id;
    this.title = title;
    this.description = description;
    this.createdOn = createdOn;
    this.done = done;
    this.dueDate = dueDate;
    this.color = color;
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
      color: todoItem.color,
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
      data.done,
      data.color
    );
  },
};
