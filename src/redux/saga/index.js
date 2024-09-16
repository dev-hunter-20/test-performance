import { all, fork } from "redux-saga/effects";

import authSaga from "./auth";
import getMyAppsSaga from "./my-apps";

const rootSaga = function* root() {
  yield all([fork(authSaga), fork(getMyAppsSaga)]);
};

export default rootSaga;
