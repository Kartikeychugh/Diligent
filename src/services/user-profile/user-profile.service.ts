import { userProfileConverter, UserProfile } from "../../models";
import { IFirebaseStoreService } from "../firebase/firebase-store.service";
import { Services } from "../service-manager";

export interface IUserProfileService extends IFirebaseStoreService {
  createUserProfile(userProfile: UserProfile): Promise<void>;
}

const UserProfileServiceFactory = async () => {
  const firebaseStoreService = await Services.FirebaseStoreService;
  const service: IUserProfileService = Object.create(firebaseStoreService);

  service.createUserProfile = async function (userProfile: UserProfile) {
    const docRef = firebaseStoreService
      .getDocumentRef("users", [userProfile.id])
      .withConverter(userProfileConverter);

    const res = await firebaseStoreService.getDocumentSnap<UserProfile>(docRef);
    if (!res.exists()) {
      return firebaseStoreService.setDocument(docRef, userProfile);
    }
  };

  return Object.freeze(service);
};

export const userProfileService = UserProfileServiceFactory();
