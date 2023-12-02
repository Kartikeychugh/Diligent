import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { DocumentData } from "firebase/firestore";
import { TodoItem } from "../../models";

const initialState: { [key: string]: TodoItem } = {};
const slice = createSlice({
  name: "todos",
  initialState,
  reducers: {
    todoAdded: (state, action: PayloadAction<TodoItem>) => {
      state[action.payload.id] = action.payload;
    },
    todoDeleted: (state, action: PayloadAction<string>) => {
      delete state[action.payload];
    },
    todoUpdated: (
      state,
      action: PayloadAction<{
        id: string;
        changes: DocumentData;
      }>
    ) => {
      const { id, changes } = action.payload;
      state[id] = {
        ...state[id],
        ...changes,
      };
    },
  },
});

export const { todoAdded, todoDeleted, todoUpdated } = slice.actions;

export const reducer = slice.reducer;
