import { configureStore, ThunkAction, Action } from "@reduxjs/toolkit";
import createSagaMiddleware from "redux-saga";
import { all } from "redux-saga/effects";
import formReducer from "../features/form";
import { todosReducer, watchFetchTodo } from "../features/todos";
import authReducer, {
  watchLoginUserAsync,
  watchUserAuthStatus,
  watchLogoutUserAsync,
} from "../features/auth";
import {
  viewsReducer,
  watchFetchView,
  watchAddTodo,
  watchDeleteTodo,
  watchUpdateTodo,
  watchAddToView,
  watchRemoveFromView,
  watchUpdateView,
} from "../features";

// notice how we now only export the rootSaga
// single entry point to start all Sagas at once
export function* rootSaga() {
  yield all([
    watchUserAuthStatus(),
    watchLoginUserAsync(),
    watchLogoutUserAsync(),
    watchFetchTodo(),
    watchAddTodo(),
    watchDeleteTodo(),
    watchUpdateTodo(),
    watchFetchView(),
    watchAddToView(),
    watchRemoveFromView(),
    watchUpdateView(),
  ]);
}

const sagaMiddleware = createSagaMiddleware();
export const store = configureStore({
  reducer: {
    auth: authReducer,
    form: formReducer,
    todos: todosReducer,
    view: viewsReducer,
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
