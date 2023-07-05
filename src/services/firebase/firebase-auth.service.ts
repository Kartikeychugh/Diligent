import {
  NextOrObserver,
  Unsubscribe,
  User,
  onAuthStateChanged,
  signInWithPopup,
  signOut,
} from "firebase/auth";
import { firebaseAuth, googleAuthProvider } from "../../app/firebase";

export interface IFirebaseAuthService {
  login(): Promise<User>;
  logout(): Promise<void>;
  watchLoginState(listener: NextOrObserver<User>): Unsubscribe;
}

export class FirebaseAuthService implements IFirebaseAuthService {
  static #key = Symbol();
  static #instance: FirebaseAuthService;

  static {
    FirebaseAuthService.#instance = new FirebaseAuthService(this.#key);
  }

  constructor(key?: Symbol) {
    if (key !== FirebaseAuthService.#key) {
      throw Error(
        "Use getInstance method to get an instance of FirebaseAuthService"
      );
    }
  }

  static getInstance() {
    return FirebaseAuthService.#instance;
  }

  async login(): Promise<User> {
    if (firebaseAuth.currentUser) return firebaseAuth.currentUser;

    // const retryableFn = retryFunction(async () => {
    //   const res = await signInWithPopup(firebaseAuth, googleAuthProvider);
    //   return res.user;
    // }, 3);
    // return retryableFn();

    return signInWithPopup(firebaseAuth, googleAuthProvider).then(
      (res) => res.user
    );
  }

  async logout(): Promise<void> {
    return signOut(firebaseAuth);
  }

  watchLoginState(listener: NextOrObserver<User>) {
    return onAuthStateChanged(firebaseAuth, listener);
  }
}
