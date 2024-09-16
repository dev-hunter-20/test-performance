import { all, takeLatest } from 'redux-saga/effects';
import { changePasswordSaga } from './change-password';
import { googleLoginSaga } from './google-login';
import { loginAppSaga } from './login-app';
import { registerAppSaga } from './register-app';
import { resetPasswordSaga } from './reset-password';
import {
  changePasswordAction,
  googleLoginAction,
  loginAppAction,
  registerAppAction,
  resetPasswordAction,
} from '@/redux/actions';

export default function* root() {
  yield all([
    takeLatest(changePasswordAction.request.type, changePasswordSaga),
    takeLatest(googleLoginAction.request.type, googleLoginSaga),
    takeLatest(loginAppAction.request.type, loginAppSaga),
    takeLatest(registerAppAction.request.type, registerAppSaga),
    takeLatest(resetPasswordAction.request.type, resetPasswordSaga),
  ]);
}
