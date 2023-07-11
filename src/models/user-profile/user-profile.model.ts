import {
  QueryDocumentSnapshot,
  DocumentData,
  SnapshotOptions,
} from "firebase/firestore";

export class UserProfile {
  id: string;
  name: string;
  email: string;

  constructor(
    id: string,
    name: string | null | undefined,
    email: string | null | undefined
  ) {
    this.id = id;
    this.name = name || "";
    this.email = email || "";
  }
}

export const userProfileConverter = {
  toFirestore: (userProfile: UserProfile) => {
    return {
      id: userProfile.id,
      name: userProfile.name,
      email: userProfile.email,
    };
  },
  fromFirestore: (
    snapshot: QueryDocumentSnapshot<DocumentData>,
    options?: SnapshotOptions
  ): UserProfile => {
    const data = snapshot.data(options);
    return new UserProfile(snapshot.id, data.name, data.email);
  },
};
