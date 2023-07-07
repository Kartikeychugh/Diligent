import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { TodoItem } from "../../models";
import { put, select, takeLeading } from "redux-saga/effects";
import { ITaskStoreService, Services } from "../../services";
import { DocumentSnapshot, QuerySnapshot } from "firebase/firestore";
import { RootState } from "../../app/store";
import { todoItemConverter } from "../../models/todo-item/todo-item.model";
import { QueryBuilder } from "../../utils";

export interface ITasksState {
  items: TodoItem[];
  limit: number;
  lastVisible: DocumentSnapshot<TodoItem> | null;
}

const initialState: ITasksState = {
  items: [],
  limit: 5,
  lastVisible: null,
};

export const tasksSlice = createSlice({
  name: "tasksSlice",
  initialState: initialState,
  reducers: {
    fetchTaskSuccess: (state, action: PayloadAction<ITasksState["items"]>) => {
      state.items.push(...action.payload);
    },
    refreshTasks: (state, action: PayloadAction<ITasksState["items"]>) => {
      state.items = action.payload;
    },
    setLastVisible: (
      state,
      action: PayloadAction<ITasksState["lastVisible"]>
    ) => {
      state.lastVisible = action.payload;
    },
  },
});

export function* watchRefreshTasks() {
  yield takeLeading("REFRESH_TASKS", function* () {
    const taskStoreService: ITaskStoreService = yield Services.TaskStoreService;
    const state: RootState = yield select();

    const Q = QueryBuilder()
      .colRef(taskStoreService.getItemsCollectionRef(state.auth.user.id))
      .orderBy("dueDate", "desc")
      .endAt(state.tasks.lastVisible)
      .generate()
      .withConverter(todoItemConverter);

    const docs: QuerySnapshot<TodoItem> = yield taskStoreService.getDocuments(
      Q
    );

    const items: TodoItem[] = [];
    docs.forEach((doc) => {
      items.push(doc.data());
    });

    yield put(refreshTasks(items));
  });
}

export function* watchFetchTasks() {
  yield takeLeading("FETCH_NEXT_TASKS", function* () {
    const taskStoreService: ITaskStoreService = yield Services.TaskStoreService;
    const state: RootState = yield select();

    const Q = QueryBuilder()
      .colRef(taskStoreService.getItemsCollectionRef(state.auth.user.id))
      .orderBy("dueDate", "desc")
      .startAfter(state.tasks.lastVisible)
      .limit(state.tasks.limit)
      .generate()
      .withConverter(todoItemConverter);

    const docs: QuerySnapshot<TodoItem> = yield taskStoreService.getDocuments(
      Q
    );

    if (docs.docs.length === 0) return;

    if (
      state.tasks.lastVisible &&
      docs.docs[docs.docs.length - 1].id === state.tasks.lastVisible.id
    ) {
      return;
    }

    const items: TodoItem[] = [];
    docs.forEach((doc) => {
      items.push(doc.data());
    });
    yield put(fetchTaskSuccess(items));
    yield put(setLastVisible(docs.docs[docs.docs.length - 1]));
  });
}

export const reducer = tasksSlice.reducer;
export const { fetchTaskSuccess, setLastVisible, refreshTasks } =
  tasksSlice.actions;
