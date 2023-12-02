export const Services = {
  get FirebaseAuthService() {
    return (async () => {
      const { firebaseAuthService } = await import("./firebase");
      return firebaseAuthService;
    })();
  },
  get FirebaseStoreService() {
    return (async () => {
      const { firebaseStoreService } = await import("./firebase");
      return firebaseStoreService;
    })();
  },
  get UserProfileService() {
    return (async () => {
      const { userProfileService } = await import("./user-profile");
      return userProfileService;
    })();
  },
  get TaskStoreService() {
    return (async () => {
      const { taskStoreService } = await import("./task-store");
      return taskStoreService;
    })();
  },
  get ViewService() {
    return (async () => {
      const { viewService } = await import("./view");
      return viewService;
    })();
  },
};
