import { useEffect } from "react";
import { useAppSelector } from "../../app/hooks";
import { FirebaseStoreService } from "../../services";
import { query } from "firebase/firestore";
import { NewItemForm } from "../new-item-form";
import { Box } from "@mui/material";
import { todoItemConverter } from "../../models/todo-item/todo-item.model";
import { Editor } from "../editor/editor.component";

export const Layout = () => {
  const { userId, name, email } = useAppSelector((state) => state.auth);

  const fbss = FirebaseStoreService.getInstance();

  useEffect(() => {
    const docRef = fbss.getDocumentRef("users", [userId]);
    fbss.getDocumentSnap(docRef).then((res) => {
      if (!res.exists()) {
        fbss.setDocument(docRef, { name, email });
      }
    });
  }, [email, fbss, name, userId]);

  // useEffect(() => {
  //   const fn = fbss.listen(
  //     query(fbss.getCollectionRef("users", [userId, "items"])).withConverter(
  //       todoItemConverter
  //     ),
  //     (querySnapshot) => {
  //       if (querySnapshot.metadata.hasPendingWrites) return;

  //       querySnapshot.docChanges().forEach((change) => {
  //         console.log(change.doc.data());
  //       });
  //     }
  //   );

  //   return () => {
  //     fn();
  //   };
  // }, [fbss, userId]);

  return (
    <Box sx={{ display: "flex", justifyContent: "center" }}>
      <NewItemForm />
      {/* <Editor /> */}
    </Box>
  );
};
