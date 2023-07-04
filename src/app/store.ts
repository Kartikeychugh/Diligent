import { configureStore, ThunkAction, Action } from "@reduxjs/toolkit";
import counterReducer from "../features/counter/counterSlice";
import createSagaMiddleware from "redux-saga";
import { all } from "redux-saga/effects";
import formReducer, { watchAddTaskAsync } from "../features/form";
import authReducer, {
  watchLoginUserAsync,
  watchLoginStatus,
  watchLoginChannel,
} from "../features/auth";

// notice how we now only export the rootSaga
// single entry point to start all Sagas at once
export function* rootSaga() {
  yield all([
    watchLoginUserAsync(),
    watchAddTaskAsync(),
    watchLoginStatus(),
    watchLoginChannel(),
  ]);
}

const sagaMiddleware = createSagaMiddleware();
export const store = configureStore({
  reducer: {
    counter: counterReducer,
    auth: authReducer,
    form: formReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(sagaMiddleware),
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
