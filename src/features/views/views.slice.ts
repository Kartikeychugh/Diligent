import { PayloadAction, createSlice } from "@reduxjs/toolkit";

const initialState: {
  name: string;
  items: string[];
} = {
  name: "all",
  items: [],
};

const viewSlice = createSlice({
  name: "view",
  initialState,
  reducers: {
    viewUpdated: (state, action: PayloadAction<typeof initialState>) => {
      return action.payload;
    },
    addedToView: (state, action: PayloadAction<string>) => {
      const indexOf = state.items.indexOf(action.payload);
      if (indexOf === -1) state.items.push(action.payload);
    },
  },
});

export const { viewUpdated, addedToView } = viewSlice.actions;
export const reducer = viewSlice.reducer;
