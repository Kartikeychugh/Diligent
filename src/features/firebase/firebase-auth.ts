import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { put, takeLatest } from "redux-saga/effects";
import { FirebaseAuthService } from "../../services/firebase";

export enum LOGIN_STATE {
  LOGGED_OUT,
  LOGGED_IN,
  UNKNOWN,
  ERROR,
}

const initialState: {
  auth_state: LOGIN_STATE;
  userId: string;
  email: string | null;
  name: string;
} = {
  auth_state: LOGIN_STATE.UNKNOWN,
  userId: "",
  email: "",
  name: "",
};

export const firebaseAuthSlice = createSlice({
  name: "firebaseAuthSlice",
  initialState,
  reducers: {
    setUserId: (state, action: PayloadAction<string>) => {
      state.userId = action.payload;
    },
    setEmailId: (state, action: PayloadAction<string | null>) => {
      state.email = action.payload;
    },
    setName: (state, action: PayloadAction<string>) => {
      state.name = action.payload;
    },
    setAuthState: (state, action: PayloadAction<LOGIN_STATE>) => {
      state.auth_state = action.payload;
    },
  },
});

export function* watchLoginUserAsync() {
  yield takeLatest("LOGIN_USER_ASYNC", function* () {
    try {
      yield FirebaseAuthService.getInstance().login();
    } catch (e) {
      yield put(setAuthState(LOGIN_STATE.ERROR));
    }
  });
}

export const loginUserAsync = () => ({ type: "LOGIN_USER_ASYNC" });
export const { setUserId, setAuthState, setEmailId, setName } =
  firebaseAuthSlice.actions;
export default firebaseAuthSlice.reducer;
