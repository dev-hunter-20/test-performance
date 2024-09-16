import { createReducer } from "deox";

import { getMyAppsAction } from "../../../redux/actions";
import { getListMyApps } from "./MyApps";

const initialState = {
  getMyAppsResponse: [],
};

const myAppsReducer = createReducer(initialState, (handleAction) => [
  handleAction(getMyAppsAction.success, getListMyApps),
]);

export default myAppsReducer;
