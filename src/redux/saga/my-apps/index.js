import { all, takeLatest } from 'redux-saga/effects';
import { getMyAppsSaga } from './MyApps';
import { getMyAppsAction } from '@/redux/actions';

export default function* root() {
  yield all([takeLatest(getMyAppsAction.request.type, getMyAppsSaga)]);
}
