import { PayloadAction, createSelector, createSlice } from "@reduxjs/toolkit";
import { RootState } from "../../config";

export enum FormState {
  AVAILABLE,
  BUSY,
  SUCCESS,
}

export interface IFormState {
  formState: FormState;
  error: string;
}

const initialState: IFormState = {
  formState: FormState.AVAILABLE,
  error: "",
};

const formSlice = createSlice({
  name: "formSlice",
  initialState,
  reducers: {
    formError: (state, action: PayloadAction<IFormState["error"]>) => {
      state.error = action.payload;
    },
  },
});

export const { formError } = formSlice.actions;

export const reducer = formSlice.reducer;

const selectSelf = (state: RootState) => state.form;
export const selectFormError = createSelector(
  [selectSelf],
  (state) => state.error
);
