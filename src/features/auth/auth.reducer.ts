import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { put, take, takeLatest } from "redux-saga/effects";
import { Services } from "../../services/service-manager";
import { IFirebaseAuthService } from "../../services/firebase/firebase-auth.service";
import { channel } from "redux-saga";

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

export const authSlice = createSlice({
  name: "authSlice",
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
      const firebaseAuthService: IFirebaseAuthService =
        yield Services.FirebaseAuthService;
      yield firebaseAuthService.login();
    } catch (e) {
      yield put(setAuthState(LOGIN_STATE.ERROR));
    }
  });
}

const loginStatusChannel = channel();

export function* watchLoginStatus() {
  yield takeLatest("LOGIN_USER_STATUS", function* () {
    const firebaseAuthService: IFirebaseAuthService =
      yield Services.FirebaseAuthService;

    firebaseAuthService.watchLoginState((user) => {
      if (user) {
        console.log(`Logged in: ${user.email}`);
        loginStatusChannel.put(setAuthState(LOGIN_STATE.LOGGED_IN));
        loginStatusChannel.put(setUserId(user.uid));
        loginStatusChannel.put(setEmailId(user.email));
        loginStatusChannel.put(setName(user.displayName || ""));
      } else {
        loginStatusChannel.put(setAuthState(LOGIN_STATE.LOGGED_OUT));
        loginStatusChannel.put(setUserId(""));
      }
    });
  });
}

export function* watchLoginChannel() {
  while (true) {
    const action: PayloadAction = yield take(loginStatusChannel);
    yield put(action);
  }
}
export const loginUserAsync = () => ({ type: "LOGIN_USER_ASYNC" });
export const loginUserStatus = () => ({ type: "LOGIN_USER_STATUS" });

export const { setUserId, setAuthState, setEmailId, setName } =
  authSlice.actions;
export const reducer = authSlice.reducer;
