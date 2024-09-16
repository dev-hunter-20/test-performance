import MyAppApiService from '@/api-services/api/MyAppApiService';
import { getMyAppsAction } from '@/redux/actions';
import { call, put } from 'redux-saga/effects';

// FUNCTION

export function* getMyAppsSaga(action) {
  const { materials, successCallback, failedCallback } = action.payload;
  try {
    const response = yield call(MyAppApiService.getMyApps, materials);
    const getMyAppsResponse = response;
    yield put(getMyAppsAction.success(getMyAppsResponse));
    successCallback?.(getMyAppsResponse);
  } catch (err) {
    yield put(getMyAppsAction.failure(err));
    failedCallback?.(err);
  }
}
