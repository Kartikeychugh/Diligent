import { configureStore, ThunkAction, Action } from "@reduxjs/toolkit";
import counterReducer from "../features/counter/counterSlice";
import createSagaMiddleware from "redux-saga";
import { all } from "redux-saga/effects";
import formReducer from "../features/form";
import authReducer, {
  watchLoginUserAsync,
  watchUserAuthStatus,
  watchLogoutUserAsync,
} from "../features/auth";
import tasksReducer, {
  watchFetchTasks,
  watchTaskAdd,
  watchUpdateTask,
} from "../features/tasks";
import {
  watchRefreshTasks,
  watchTaskRenders,
  deleteTask,
} from "../features/tasks";

// notice how we now only export the rootSaga
// single entry point to start all Sagas at once
export function* rootSaga() {
  yield all([
    watchUserAuthStatus(),
    watchLoginUserAsync(),
    watchLogoutUserAsync(),
    watchTaskAdd(),
    watchFetchTasks(),
    watchRefreshTasks(),
    watchTaskRenders(),
    deleteTask(),
    watchUpdateTask(),
  ]);
}

const sagaMiddleware = createSagaMiddleware();
export const store = configureStore({
  reducer: {
    counter: counterReducer,
    auth: authReducer,
    form: formReducer,
    tasks: tasksReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({ serializableCheck: false }).concat(sagaMiddleware),
});

sagaMiddleware.run(rootSaga);

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  RootState,
  unknown,
  Action<string>
>;

export const appDispatch = <T>(action: { payload: T; type: string }) => {
  store.dispatch(action);
};
