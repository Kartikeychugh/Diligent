import { PayloadAction } from "@reduxjs/toolkit";
import { put, select, takeEvery } from "redux-saga/effects";
import { Services, IViewService } from "../../services";
import { addedToView, viewUpdated } from "./views.slice";
import { RootState } from "../../config";

/****************************FETCH_VIEW******************************************/
const FETCH_VIEW = "FETCH_VIEW";

function* fetchView(action: PayloadAction<string>) {
  const viewService: IViewService = yield Services.ViewService;
  const viewDetails: { [key: string]: number } = yield viewService.getView(
    action.payload
  );
  const items = Object.keys(viewDetails);
  items.sort((a, b) => viewDetails[a] - viewDetails[b]);
  yield put(viewUpdated({ name: action.payload, items }));
}

export function* watchFetchView() {
  yield takeEvery(FETCH_VIEW, fetchView);
}

export const fetchViewAction = (payload: string) => ({
  type: FETCH_VIEW,
  payload,
});
/****************************FETCH_VIEW******************************************/

/****************************REMOVE_FROM_VIEW******************************************/
const REMOVE_FROM_VIEW = "REMOVE_FROM_VIEW";

function* removeFromView(action: PayloadAction<{ view: string; id: string }>) {
  const { id, view } = action.payload;

  const state: RootState = yield select();
  if (state.view.name === view) {
    const updatedItems = state.view.items.slice().filter((item) => item !== id);
    yield put(viewUpdated({ name: state.view.name, items: updatedItems }));
  }
  const viewService: IViewService = yield Services.ViewService;
  yield viewService.deleteFromView(view, id);
}

export function* watchRemoveFromView() {
  yield takeEvery(REMOVE_FROM_VIEW, removeFromView);
}

export const removeFromViewAction = (payload: {
  view: string;
  id: string;
}) => ({
  type: REMOVE_FROM_VIEW,
  payload,
});
/****************************REMOVE_FROM_VIEW******************************************/

/****************************ADD_TO_VIEW******************************************/
const ADD_TO_VIEW = "ADD_TO_VIEW";

function* addToView(action: PayloadAction<{ view: string; id: string }>) {
  const { view, id } = action.payload;
  const state: RootState = yield select();
  if (state.view.name === view) {
    yield put(addedToView(id));
  }
  const viewService: IViewService = yield Services.ViewService;
  yield viewService.addToView(view, id);
}

export function* watchAddToView() {
  yield takeEvery(ADD_TO_VIEW, addToView);
}

export const addToViewAction = (payload: { view: string; id: string }) => ({
  type: ADD_TO_VIEW,
  payload,
});
/****************************ADD_TO_VIEW******************************************/

/****************************UPDATE_VIEW******************************************/
const UPDATE_VIEW = "UPDATE_VIEW";

function* updateView(action: PayloadAction<string[]>) {
  const state: RootState = yield select();
  const viewDetails: { [key: string]: number } = {};
  action.payload.forEach((id, index) => {
    viewDetails[id] = index;
  });
  const viewService: IViewService = yield Services.ViewService;
  viewService.updateView(state.view.name, viewDetails);
}

export function* watchUpdateView() {
  yield takeEvery(UPDATE_VIEW, updateView);
}

export const updateViewAction = (payload: string[]) => ({
  type: UPDATE_VIEW,
  payload,
});
/****************************ADD_TO_VIEW******************************************/
