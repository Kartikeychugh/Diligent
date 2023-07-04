import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { delay, put, select, takeLatest } from "redux-saga/effects";
import { Services } from "../../services";
import {
  TodoItem,
  todoItemConverter,
} from "../../models/todo-item/todo-item.model";
import { RootState } from "../../app/store";
import { serverTimestamp } from "firebase/firestore";
import { IFirebaseStoreService } from "../../services/firebase/firebase-store.service";

export enum FormState {
  AVAILABLE,
  BUSY,
  SUCCESS,
}

const initialState: { formState: FormState } = {
  formState: FormState.AVAILABLE,
};

const formSlice = createSlice({
  name: "formSlice",
  initialState,
  reducers: {
    formSubmitted: (state) => {
      state.formState = FormState.BUSY;
    },
    formComplete: (state) => {
      state.formState = FormState.SUCCESS;
    },
    formAvailable: (state) => {
      state.formState = FormState.AVAILABLE;
    },
  },
});

export function* watchAddTaskAsync() {
  yield takeLatest(
    "ADD_TASK_ASYNC",
    function* (
      action: PayloadAction<{
        title: string;
        description: string;
        done: boolean;
      }>
    ) {
      yield put(formSubmitted());
      const state: RootState = yield select();
      const { title, description, done } = action.payload;
      const service: IFirebaseStoreService =
        yield Services.FirebaseStoreService;

      const colRef = service
        .getCollectionRef("users", [state.auth.userId, "items"])
        .withConverter(todoItemConverter);

      yield service.addDocument(
        colRef,
        new TodoItem(title, description, serverTimestamp(), done)
      );

      yield put(formComplete());
      yield delay(3000);
      yield put(formAvailable());
    }
  );
}

export const addTaskAsync = (payload: {
  title: string;
  description: string;
  done: boolean;
}) => ({
  type: "ADD_TASK_ASYNC",
  payload,
});

const { formAvailable, formComplete, formSubmitted } = formSlice.actions;

export const reducer = formSlice.reducer;
