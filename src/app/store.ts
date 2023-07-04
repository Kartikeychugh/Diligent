import { configureStore, ThunkAction, Action } from "@reduxjs/toolkit";
import counterReducer from "../features/counter/counterSlice";
import createSagaMiddleware from "redux-saga";
import authReducer, {
  watchLoginUserAsync,
} from "../features/firebase/firebase-auth";
import { all } from "redux-saga/effects";

// notice how we now only export the rootSaga
// single entry point to start all Sagas at once
export function* rootSaga() {
  yield all([watchLoginUserAsync()]);
}

const sagaMiddleware = createSagaMiddleware();
export const store = configureStore({
  reducer: {
    counter: counterReducer,
    auth: authReducer,
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
