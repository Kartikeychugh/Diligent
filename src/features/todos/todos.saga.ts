import { PayloadAction } from "@reduxjs/toolkit";
import { put, takeEvery } from "redux-saga/effects";
import {
  DocumentData,
  DocumentReference,
  DocumentSnapshot,
} from "firebase/firestore";

import { ITaskStoreService, Services } from "../../services";
import { TodoItem } from "../../models";
import { todoAdded, todoDeleted, todoUpdated } from "./todos.slice";
import { addToViewAction, removeFromViewAction } from "../views";

/****************************FETCH_TODO******************************************/
const FETCH_TODO = "FETCH_TODO";

function* fetchTodo(action: PayloadAction<string>) {
  const taskStoreService: ITaskStoreService = yield Services.TaskStoreService;
  const todoSnap: DocumentSnapshot<TodoItem> =
    yield taskStoreService.getTaskSnapshot(action.payload);
  const todo = todoSnap.data();
  if (todo) yield put(todoAdded(todo));
}

export function* watchFetchTodo() {
  yield takeEvery(FETCH_TODO, fetchTodo);
}

export const fetchTodoAction = (payload: string) => ({
  type: FETCH_TODO,
  payload,
});
/****************************FETCH_TODO******************************************/

/****************************DELETE_TODO******************************************/
const DELETE_TODO = "DELETE_TODO";

function* deleteTodo(action: PayloadAction<TodoItem>) {
  yield put(removeFromViewAction({ view: "all", id: action.payload.id }));
  yield put(
    removeFromViewAction({
      view: action.payload.dueDate.toString(),
      id: action.payload.id,
    })
  );
  yield put(todoDeleted(action.payload.id));

  const taskStoreService: ITaskStoreService = yield Services.TaskStoreService;
  yield taskStoreService.deleteTask(action.payload.id);
}

export function* watchDeleteTodo() {
  yield takeEvery(DELETE_TODO, deleteTodo);
}

export const deleteTodoAction = (payload: TodoItem) => ({
  type: DELETE_TODO,
  payload,
});
/****************************DELETE_TODO******************************************/

/****************************ADD_TODO******************************************/
const ADD_TODO = "ADD_TODO";

function* addTodo(action: PayloadAction<TodoItem>) {
  const taskStoreService: ITaskStoreService = yield Services.TaskStoreService;
  const ref: DocumentReference<DocumentData> = yield taskStoreService.addTask(
    action.payload
  );
  action.payload.id = ref.id;
  yield put(todoAdded(action.payload));
  yield put(addToViewAction({ view: "all", id: action.payload.id }));
  yield put(
    addToViewAction({
      view: action.payload.dueDate.toString(),
      id: action.payload.id,
    })
  );
}

export function* watchAddTodo() {
  yield takeEvery(ADD_TODO, addTodo);
}

export const addTodoAction = (payload: TodoItem) => ({
  type: ADD_TODO,
  payload,
});
/****************************ADD_TODO******************************************/

/****************************UPDATE_TODO******************************************/
const UPDATE_TODO = "UPDATE_TODO";

function* updateTodo(
  action: PayloadAction<{
    id: string;
    changes: DocumentData;
  }>
) {
  const { id, changes } = action.payload;
  yield put(todoUpdated(action.payload));
  const taskStoreService: ITaskStoreService = yield Services.TaskStoreService;
  yield taskStoreService.updateDocument(id, changes);
}

export function* watchUpdateTodo() {
  yield takeEvery(UPDATE_TODO, updateTodo);
}

export const updateTodoAction = (payload: {
  id: string;
  changes: DocumentData;
}) => ({
  type: UPDATE_TODO,
  payload,
});
/****************************UPDATE_TODO******************************************/
