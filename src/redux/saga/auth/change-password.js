import AuthApiService from '@/api-services/api/auth/AuthApiService';
import { changePasswordAction } from '@/redux/actions';
import { call, put } from 'redux-saga/effects';

// FUNCTION

export function* changePasswordSaga(action) {
  const { materials, successCallback, failedCallback } = action.payload;
  try {
    const response = yield call(AuthApiService.changePassword, materials);
    const changePasswordResponse = response;
    yield put(changePasswordAction.success(changePasswordResponse));
    successCallback?.(changePasswordResponse);
  } catch (err) {
    yield put(changePasswordAction.failure(err));
    failedCallback?.(err);
  }
}
