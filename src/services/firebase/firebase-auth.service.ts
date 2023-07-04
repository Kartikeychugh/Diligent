import {
  NextOrObserver,
  User,
  onAuthStateChanged,
  signInWithPopup,
} from "firebase/auth";
import { retryFunction } from "../../utils/retry";
import { firebaseAuth, googleAuthProvider } from "../../app/firebase";

export interface IFirebaseAuthService {
  login(): Promise<User>;
  watchLoginState(listener: NextOrObserver<User>): void;
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

    const retryableFn = retryFunction(async () => {
      const res = await signInWithPopup(firebaseAuth, googleAuthProvider);
      return res.user;
    }, 3);

    return retryableFn();
  }

  watchLoginState(listener: NextOrObserver<User>) {
    onAuthStateChanged(firebaseAuth, listener);
  }
}
