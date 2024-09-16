import AuthApiService from '@/api-services/api/auth/AuthApiService';
import { loginAppAction } from '@/redux/actions';
import { call, put } from 'redux-saga/effects';

// FUNCTION

export function* loginAppSaga(action) {
  const { materials, successCallback, failedCallback } = action.payload;
  try {
    const response = yield call(AuthApiService.loginApp, materials);
    const loginAppResponse = response;
    yield put(loginAppAction.success(loginAppResponse));
    successCallback?.(loginAppResponse);
  } catch (err) {
    yield put(loginAppAction.failure(err));
    failedCallback?.(err);
  }
}
