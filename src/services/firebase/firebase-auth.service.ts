import {
  Auth,
  GoogleAuthProvider,
  User,
  onAuthStateChanged,
  signInWithPopup,
} from "firebase/auth";
import { appDispatch } from "../../app/store";
import { retryFunction } from "../../utils/retry";
import {
  setAuthState,
  LOGIN_STATE,
  setUserId,
  setName,
  setEmailId,
} from "../../features/firebase/firebase-auth";

export class FirebaseAuthService {
  static #key = Symbol();
  static #instance: FirebaseAuthService;
  static #initalised: boolean;

  #firebaseAuth: Auth;
  #googleAuthProvider: GoogleAuthProvider;

  constructor(
    firebaseAuth: Auth,
    googleAuthProvider: GoogleAuthProvider,
    key?: Symbol
  ) {
    if (key !== FirebaseAuthService.#key) {
      throw Error(
        "Use getInstance method to get an instance of FirebaseAuthService"
      );
    }

    this.#firebaseAuth = firebaseAuth;
    this.#googleAuthProvider = googleAuthProvider;
    this.watchLoginState();
    FirebaseAuthService.#initalised = true;
  }

  static initialise(
    firebaseAuth: Auth,
    googleAuthProvider: GoogleAuthProvider
  ) {
    this.#instance = new FirebaseAuthService(
      firebaseAuth,
      googleAuthProvider,
      this.#key
    );
  }

  static getInstance() {
    if (!FirebaseAuthService.#initalised)
      throw Error("Please initialise FirebaseManager");
    return FirebaseAuthService.#instance;
  }

  async login(): Promise<User> {
    if (this.#firebaseAuth.currentUser) return this.#firebaseAuth.currentUser;

    const retryableFn = retryFunction(async () => {
      const res = await signInWithPopup(
        this.#firebaseAuth,
        this.#googleAuthProvider
      );
      return res.user;
    }, 3);

    return retryableFn();
  }

  watchLoginState() {
    onAuthStateChanged(this.#firebaseAuth, async (user) => {
      if (user) {
        console.log(`Logged in: ${user.email}`);
        appDispatch(setAuthState(LOGIN_STATE.LOGGED_IN));
        appDispatch(setUserId(user.uid));
        appDispatch(setEmailId(user.email));
        appDispatch(setName(user.displayName || ""));
      } else {
        appDispatch(setAuthState(LOGIN_STATE.LOGGED_OUT));
        appDispatch(setUserId(""));
      }
    });
  }
}
