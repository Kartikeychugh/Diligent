import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import {
  call,
  delay,
  put,
  select,
  takeEvery,
  takeLatest,
} from "redux-saga/effects";
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

export interface IFormState {
  formState: FormState;
  error: string;
}

const initialState: IFormState = {
  formState: FormState.AVAILABLE,
  error: "",
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
    formError: (state, action: PayloadAction<IFormState["error"]>) => {
      state.error = action.payload;
    },
  },
});

export function* watchAddTaskAsync() {
  yield takeEvery(
    "ADD_TASK_ASYNC",
    function* (
      action: PayloadAction<{
        title: string;
        description: string;
        done: boolean;
        dueDate: string;
      }>
    ) {
      try {
        yield put(formSubmitted());
        const state: RootState = yield select();
        const { title, description, done, dueDate } = action.payload;

        const service: IFirebaseStoreService = yield call(
          () => Services.FirebaseStoreService
        );

        const colRef = service
          .getCollectionRef("users", [state.auth.user.userId, "items"])
          .withConverter(todoItemConverter);

        yield call(
          service.addDocument,
          colRef,
          new TodoItem(title, description, serverTimestamp(), dueDate, done)
        );

        yield put(formComplete());
        yield delay(3000);
        yield put(formAvailable());
      } catch (e) {
        console.log(e);
      }
    }
  );
}

export function* formErrorHandler() {
  // const action: PayloadAction<{ error: string }> = yield take("FORM_ERROR_ON_SUBMISSION");
}

export const addTaskAsync = (payload: {
  title: string;
  description: string;
  done: boolean;
  dueDate: string;
}) => ({
  type: "ADD_TASK_ASYNC",
  payload,
});

export const { formAvailable, formComplete, formSubmitted, formError } =
  formSlice.actions;

export const reducer = formSlice.reducer;
