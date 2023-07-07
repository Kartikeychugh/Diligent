import {
  CollectionReference,
  DocumentData,
  DocumentSnapshot,
  FieldPath,
  OrderByDirection,
  QueryConstraint,
  endAt,
  endBefore,
  limit,
  orderBy,
  query,
  startAfter,
  startAt,
} from "firebase/firestore";

export const QueryBuilder = () => {
  let colRef: CollectionReference<DocumentData> | null;
  let specifiers: QueryConstraint[] = [];

  return {
    colRef: function (ref: CollectionReference<DocumentData>) {
      colRef = ref;
      return this;
    },
    orderBy: function (
      fieldPath: string | FieldPath,
      directionStr?: OrderByDirection | undefined
    ) {
      specifiers.push(orderBy(fieldPath, directionStr));
      return this;
    },
    limit: function (num: number) {
      specifiers.push(limit(num));
      return this;
    },
    startAfter: function (snapshot: DocumentSnapshot<DocumentData> | null) {
      if (snapshot) specifiers.push(startAfter(snapshot));
      return this;
    },
    endBefore: function (snapshot: DocumentSnapshot<DocumentData> | null) {
      if (snapshot) specifiers.push(endBefore(snapshot));
      return this;
    },
    startAt: function (snapshot: DocumentSnapshot<DocumentData> | null) {
      if (snapshot) specifiers.push(startAt(snapshot));
      return this;
    },
    endAt: function (snapshot: DocumentSnapshot<DocumentData> | null) {
      if (snapshot) specifiers.push(endAt(snapshot));
      return this;
    },
    generate: function () {
      if (!colRef) throw new Error("Collection Reference not set");
      return query(colRef, ...specifiers);
    },
  };
};
