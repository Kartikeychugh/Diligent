export const Services = {
  get FirebaseAuthService() {
    return (async () => {
      const { FirebaseAuthService } = await import(
        "./firebase/firebase-auth.service"
      );
      return FirebaseAuthService.getInstance();
    })();
  },
  get FirebaseStoreService() {
    return (async () => {
      const { FirebaseStoreService } = await import(
        "./firebase/firebase-store.service"
      );
      return FirebaseStoreService.getInstance();
    })();
  },
};
