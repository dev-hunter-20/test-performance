import AuthApiService from '@/api-services/api/auth/AuthApiService';
import { resetPasswordAction } from '@/redux/actions';
import { call, put } from 'redux-saga/effects';

// FUNCTION

export function* resetPasswordSaga(action) {
  const { materials, successCallback, failedCallback } = action.payload;
  try {
    const response = yield call(AuthApiService.resetPassword, materials);
    const resetPasswordResponse = response;
    yield put(resetPasswordAction.success(resetPasswordResponse));
    successCallback?.(resetPasswordResponse);
  } catch (err) {
    yield put(resetPasswordAction.failure(err));
    failedCallback?.(err);
  }
}
