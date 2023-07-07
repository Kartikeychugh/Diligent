import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { call, put, take, takeLatest, takeLeading } from "redux-saga/effects";
import { Services } from "../../services/service-manager";
import { IFirebaseAuthService } from "../../services/firebase/firebase-auth.service";
import { EventChannel, eventChannel } from "redux-saga";
import { User } from "firebase/auth";
import { IUserProfileService } from "../../services/user-profile/user-profile.service";
import { UserProfile } from "../../models";

export enum LOGIN_STATE {
  LOGGED_OUT,
  LOGGED_IN,
  UNKNOWN,
  ERROR,
  LOGGING,
}

export interface IAuthState {
  auth_state: LOGIN_STATE;
  user: UserProfile;
}

const initialState: IAuthState = {
  auth_state: LOGIN_STATE.UNKNOWN,
  user: new UserProfile("", "", ""),
};

export const authSlice = createSlice({
  name: "authSlice",
  initialState,
  reducers: {
    setUser: (state, action: PayloadAction<IAuthState["user"]>) => {
      state.user = action.payload;
    },
    setAuthState: (state, action: PayloadAction<IAuthState["auth_state"]>) => {
      state.auth_state = action.payload;
    },
  },
});

export function* watchLoginUserAsync() {
  yield takeLeading("LOGIN_USER_ASYNC", function* () {
    try {
      yield put(setAuthState(LOGIN_STATE.LOGGING));
      const firebaseAuthService: IFirebaseAuthService = yield call(
        () => Services.FirebaseAuthService
      );

      yield call(firebaseAuthService.login);
      // yield put(setAuthState(LOGIN_STATE.LOGGED_IN));
    } catch (e) {
      yield put(setAuthState(LOGIN_STATE.ERROR));
    }
  });
}

export function* watchLogoutUserAsync() {
  yield takeLeading("LOGOUT_USER_ASYNC", function* () {
    try {
      const firebaseAuthService: IFirebaseAuthService = yield call(
        () => Services.FirebaseAuthService
      );

      yield call(firebaseAuthService.logout);
      // yield put(setAuthState(LOGIN_STATE.LOGGED_OUT));
    } catch (e) {
      yield put(setAuthState(LOGIN_STATE.ERROR));
    }
  });
}

function subscribeToLoginState() {
  return eventChannel<{ user: User | null }>((emitter) => {
    const unsubscribe = (async () => {
      const firebaseAuthService = await Services.FirebaseAuthService;
      return firebaseAuthService.watchLoginState((user) => {
        emitter({ user });
      });
    })();

    return () => {
      unsubscribe.then((fn) => {
        fn();
      });
    };
  });
}

export function* watchLoginStatus() {
  yield takeLatest("AUTH_INIT", function* () {
    const channel: EventChannel<{ user: User | null }> = yield call(
      subscribeToLoginState
    );

    try {
      while (true) {
        const result: { user: User | null } = yield take(channel);
        const { user } = result;
        if (user) {
          const userProfileService: IUserProfileService =
            yield Services.UserProfileService;

          const userProfile = new UserProfile(
            user.uid,
            user.displayName || "",
            user.email || ""
          );
          yield userProfileService.createUserProfile(userProfile);
          yield put(setUser(userProfile));

          yield put(setAuthState(LOGIN_STATE.LOGGED_IN));
        } else {
          yield put(setAuthState(LOGIN_STATE.LOGGED_OUT));
          yield put(setUser(initialState.user));
        }
      }
    } finally {
      channel.close();
    }
  });
}

export const loginUserAsync = () => ({ type: "LOGIN_USER_ASYNC" });
export const logoutUserAsync = () => ({ type: "LOGOUT_USER_ASYNC" });

export const authInit = () => ({ type: "AUTH_INIT" });

export const { setUser, setAuthState } = authSlice.actions;
export const reducer = authSlice.reducer;
