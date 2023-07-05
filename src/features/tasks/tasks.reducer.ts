import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { TodoItem } from "../../models";
import { call, put, select, take, takeEvery } from "redux-saga/effects";
import { Services } from "../../services";
import { query } from "firebase/firestore";
import { RootState } from "../../app/store";
import { todoItemConverter } from "../../models/todo-item/todo-item.model";
import { EventChannel, eventChannel } from "redux-saga";

export interface ITasksState {
  items: { [key: string]: TodoItem };
}

const initialState: ITasksState = {
  items: {},
};

export const tasksSlice = createSlice({
  name: "tasksSlice",
  initialState: initialState,
  reducers: {
    fetchTaskSuccess: (state, action: PayloadAction<ITasksState["items"]>) => {
      Object.assign(state.items, action.payload);
    },
  },
});

function subscribeToTasks(userId: string) {
  return eventChannel<ITasksState["items"]>((emitter) => {
    const unsubscribe = (async () => {
      const firebaseStoreService = await Services.FirebaseStoreService;
      return firebaseStoreService.listen(
        query(
          firebaseStoreService.getCollectionRef("users", [userId, "items"])
        ).withConverter(todoItemConverter),
        (querySnapshot) => {
          if (querySnapshot.metadata.hasPendingWrites) return;
          const items: ITasksState["items"] = {};
          querySnapshot.docs.forEach((doc) => {
            if (!doc.metadata.hasPendingWrites) {
              Object.assign(items, { [doc.id]: doc.data() });
            }
          });
          emitter(items);
        }
      );
    })();

    return () => {
      unsubscribe.then((fn) => fn());
    };
  });
}

export function* watchTasksSubscription() {
  yield take("SUBSCRIBE_TO_TASKS");
  const state: RootState = yield select();
  const channel: EventChannel<ITasksState["items"]> = yield call(
    subscribeToTasks,
    state.auth.user.userId
  );

  try {
    while (true) {
      yield takeEvery(channel, function* (items: ITasksState["items"]) {
        yield put(fetchTaskSuccess(items));
      });
    }
  } finally {
    channel.close();
  }
}

export const { fetchTaskSuccess } = tasksSlice.actions;
export const reducer = tasksSlice.reducer;
