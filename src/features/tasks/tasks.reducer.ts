import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { TodoItem } from "../../models";
import {
  call,
  fork,
  put,
  select,
  take,
  takeEvery,
  takeLeading,
} from "redux-saga/effects";
import {
  IFirebaseStoreService,
  ITaskStoreService,
  Services,
} from "../../services";
import {
  DocumentData,
  DocumentSnapshot,
  QuerySnapshot,
  Timestamp,
  serverTimestamp,
} from "firebase/firestore";
import { todoItemConverter } from "../../models/todo-item/todo-item.model";
import { QueryBuilder } from "../../utils";
import { EventChannel, Task, eventChannel } from "redux-saga";
import { RootState } from "../../app/store";

export interface ITasksState {
  itemIndex: { [key: string]: number };
  orderedItems: TodoItem[];
  limit: number;
  lastVisible: DocumentSnapshot<TodoItem> | null;
}

const initialState: ITasksState = {
  itemIndex: {},
  orderedItems: [],
  limit: 25,
  lastVisible: null,
};

export const tasksSlice = createSlice({
  name: "tasksSlice",
  initialState: initialState,
  reducers: {
    fetchTaskSuccess: (
      state,
      action: PayloadAction<{
        orderedItems: ITasksState["orderedItems"];
        lastVisible: ITasksState["lastVisible"];
      }>
    ) => {
      let index = state.orderedItems.length;
      const newItemIndex: ITasksState["itemIndex"] = {};
      const newOrderedItems: TodoItem[] = [];
      action.payload.orderedItems.forEach((value) => {
        if (Object.hasOwn(state.itemIndex, value.id)) {
          console.error(`Multiple tasks with one id ${value.id}`);
        } else {
          newItemIndex[value.id] = index++;
          newOrderedItems.push(value);
        }
      });
      state.orderedItems = [...state.orderedItems, ...newOrderedItems];
      state.itemIndex = { ...state.itemIndex, ...newItemIndex };
      state.lastVisible = action.payload.lastVisible;
    },
    refreshTasks: (
      state,
      action: PayloadAction<{
        orderedItems: ITasksState["orderedItems"];
        lastVisible: ITasksState["lastVisible"];
      }>
    ) => {
      const newItemIndex: ITasksState["itemIndex"] = {};
      const newOrderedItems: ITasksState["orderedItems"] = [];

      let index = 0;
      action.payload.orderedItems.forEach((value) => {
        newItemIndex[value.id] = index++;
        newOrderedItems.push(value);
      });

      state.itemIndex = newItemIndex;
      state.orderedItems = newOrderedItems;
      state.lastVisible = action.payload.lastVisible;
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
      .colRef(taskStoreService.getItemsCollectionRef())
      .orderBy("dueDate", "asc")
      .orderBy("createdOn", "desc")
      .endAt(state.tasks.lastVisible)
      .generate()
      .withConverter(todoItemConverter);

    const docs: QuerySnapshot<TodoItem> = yield taskStoreService.getDocuments(
      Q
    );

    const orderedItems: TodoItem[] = [];
    docs.forEach((doc) => {
      orderedItems.push(doc.data());
    });
    const lastVisible = docs.docs[docs.docs.length - 1];
    yield put(refreshTasks({ orderedItems, lastVisible }));
  });
}

export function* watchFetchTasks() {
  yield takeLeading("FETCH_NEXT_TASKS", function* () {
    const taskStoreService: ITaskStoreService = yield Services.TaskStoreService;
    const state: RootState = yield select();

    const Q = QueryBuilder()
      .colRef(taskStoreService.getItemsCollectionRef())
      .orderBy("dueDate", "asc")
      .orderBy("createdOn", "desc")
      .startAfter(state.tasks.lastVisible)
      .limit(state.tasks.limit)
      .generate()
      .withConverter(todoItemConverter);

    const qs: QuerySnapshot<TodoItem> = yield taskStoreService.getDocuments(Q);

    if (qs.docs.length === 0) return;

    const orderedItems: TodoItem[] = [];
    qs.forEach((doc) => {
      orderedItems.push(doc.data());
    });
    const lastVisible = qs.docs[qs.docs.length - 1];
    yield put(fetchTaskSuccess({ orderedItems, lastVisible }));
    // yield put(setLastVisible(qs.docs[qs.docs.length - 1]));
  });
}

export function* watchTaskAdd() {
  yield takeEvery(
    "TASK_ADDED",
    function* (
      action: PayloadAction<{
        title: string;
        description: string;
        done: boolean;
        dueDate: string;
        color: string;
      }>
    ) {
      try {
        const state: RootState = yield select();
        const { title, description, done, dueDate, color } = action.payload;

        const service: IFirebaseStoreService =
          yield Services.FirebaseStoreService;

        const colRef = service
          .getCollectionRef("users", [state.auth.user.id, "items"])
          .withConverter(todoItemConverter);

        const item = new TodoItem(
          "",
          title,
          description,
          serverTimestamp() as Timestamp,
          dueDate,
          done,
          color
        );

        yield call(service.addDocument, colRef, item);
        yield put({ type: "REFRESH_TASKS" });
      } catch (e) {
        console.log(e);
      }
    }
  );
}

function createTaskChannel(id: string) {
  return eventChannel<DocumentSnapshot<DocumentData>>((emitter) => {
    const unsubscribe = (async () => {
      let firstCall = true;
      const taskStoreService = await Services.TaskStoreService;
      return taskStoreService.watchTaskChanges(id, (qs) => {
        if (firstCall) {
          firstCall = false;
        } else {
          console.log("emitting");

          emitter(qs);
        }
      });
    })();

    return () => {
      unsubscribe.then((fn) => {
        fn();
      });
    };
  });
}

function* createTaskSubscriptiom(taskId: string) {
  const channel: EventChannel<DocumentSnapshot<DocumentData>> = yield call(
    createTaskChannel,
    taskId
  );

  try {
    while (true) {
      yield take(channel);
      yield put({ type: "REFRESH_TASKS" });
    }
  } finally {
    channel.close();
  }
}

function* createAndMaintainTaskSubsciption(action: PayloadAction<string>) {
  const taskId = action.payload;
  const subscription: Task = yield fork(createTaskSubscriptiom, taskId);

  while (true) {
    const taskUnrendered: PayloadAction<string> = yield take("TASK_UNRENDERED");
    if (taskId === taskUnrendered.payload) {
      console.log(`Cancelling ${taskId}`);
      subscription.cancel();
      return;
    }
  }
}

export function* watchTaskRenders() {
  yield takeEvery("TASK_RENDERED", createAndMaintainTaskSubsciption);
}

export function* deleteTask() {
  yield takeEvery("TASK_DELETED", function* (action: PayloadAction<string>) {
    const taskId = action.payload;
    const taskStoreService: ITaskStoreService = yield Services.TaskStoreService;
    yield taskStoreService.deleteTask(taskId);
    yield put({ type: "REFRESH_TASKS" });
  });
}

export function* watchUpdateTask() {
  yield takeEvery(
    "TASK_UPDATED",
    function* (
      action: PayloadAction<{
        id: string;
        title: string;
        description: string;
        done: boolean;
        dueDate: string;
        color: string;
      }>
    ) {
      const { id, ...data } = action.payload;
      const service: ITaskStoreService = yield Services.TaskStoreService;
      yield service.updateDocument(id, {
        ...data,
        dueDate: new Date(data.dueDate).getTime(),
      });

      const state: RootState = yield select();
      if (id === state.tasks.lastVisible?.id) {
        const snapshot: DocumentSnapshot<TodoItem> =
          yield service.getTaskSnapshot(id);
        yield put(setLastVisible(snapshot));
      }

      yield put({ type: "REFRESH_TASKS" });
    }
  );
}

export const reducer = tasksSlice.reducer;
export const { fetchTaskSuccess, refreshTasks, setLastVisible } =
  tasksSlice.actions;

export const taskRendered = (payload: string) => ({
  type: "TASK_RENDERED",
  payload: payload,
});

export const taskDeleted = (payload: string) => ({
  type: "TASK_DELETED",
  payload: payload,
});

export const taskUnrendered = (payload: string) => ({
  type: "TASK_UNRENDERED",
  payload: payload,
});

export const taskAdded = (payload: {
  title: string;
  description: string;
  done: boolean;
  dueDate: string;
  color: string;
}) => ({
  type: "TASK_ADDED",
  payload,
});

export const taskUpdated = (payload: {
  id: string;
  title: string;
  description: string;
  done: boolean;
  dueDate: string;
  color: string;
}) => ({ type: "TASK_UPDATED", payload });

export const fetchNextTasks = () => ({
  type: "FETCH_NEXT_TASKS",
});
