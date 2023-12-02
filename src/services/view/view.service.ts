import { DocumentData, setDoc } from "firebase/firestore";
import { IFirebaseStoreService } from "../firebase";
import { Services } from "../service-manager";

export interface IViewService extends IFirebaseStoreService {
  addToView: (view: string, id: string) => Promise<DocumentData>;
  getView(view: string): Promise<DocumentData>;
  deleteFromView(view: string, id: string): Promise<DocumentData>;
  updateView(
    this: IViewService,
    view: string,
    viewDetails: {
      [key: string]: number;
    }
  ): Promise<void>;
}

const ViewServiceFactory = async () => {
  const firebaseStoreService = await Services.FirebaseStoreService;
  const service: IViewService = Object.create(firebaseStoreService);

  service.getView = async function getView(this: IViewService, view: string) {
    if (!this.firebaseAuth.currentUser) return {};

    const docRef = this.getDocumentRef("users", [
      this.firebaseAuth.currentUser.uid,
      "views",
      view,
    ]);

    const docSnap = await this.getDocumentSnap(docRef);
    return docSnap.data() || {};
  };

  service.addToView = async function addToView(
    this: IViewService,
    view: string,
    id: string
  ) {
    if (!this.firebaseAuth.currentUser) return {};

    const currentView = await this.getView(view);
    const count = Object.keys(currentView).length;
    const docRef = this.getDocumentRef("users", [
      this.firebaseAuth.currentUser.uid,
      "views",
      view,
    ]);

    await setDoc(docRef, { [id]: count }, { merge: true });
    return { ...currentView, [id]: count };
  };

  service.deleteFromView = async function deleteFromView(
    this: IViewService,
    view: string,
    id: string
  ) {
    if (!this.firebaseAuth.currentUser) return {};

    const docRef = this.getDocumentRef("users", [
      this.firebaseAuth.currentUser.uid,
      "views",
      view,
    ]);
    const docSnap = await this.getDocumentSnap(docRef);
    const currentView = docSnap.data() || {};

    const pos = currentView[id];
    if (pos === undefined) return {};

    delete currentView[id];
    Object.entries(currentView).forEach((entry) => {
      if (entry[1] > pos) {
        currentView[entry[0]]--;
      }
    });

    await setDoc(docRef, currentView);
    return currentView;
  };

  service.updateView = async function updateView(
    this: IViewService,
    view: string,
    viewDetails: { [key: string]: number }
  ) {
    const docRef = this.getDocumentRef("users", [
      this.firebaseAuth.currentUser!!!.uid,
      "views",
      view,
    ]);
    return setDoc(docRef, viewDetails);
  };

  return Object.freeze(service);
};

export const viewService = ViewServiceFactory();
