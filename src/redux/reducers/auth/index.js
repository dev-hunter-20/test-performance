import { createReducer } from 'deox';

import {
  changePasswordAction,
  googleLoginAction,
  loginAppAction,
  loginAction,
  registerAppAction,
  resetPasswordAction,
} from '../../../redux/actions';
import { changePasswordUpdateState } from './change-password';
import { googleLoginUpdateState } from './google-login';
import { loginAppUpdateState } from './login-app';
import { registerAppUpdateState } from './register-app';
import { resetPasswordUpdateState } from './reset-password';

const initialState = {
  changePasswordResponse: undefined,
  googleLoginResponse: undefined,
  loginAppResponse: undefined,
  registerAppResponse: undefined,
  resetPasswordResponse: undefined,
};

const AuthReducer = createReducer(initialState, (handleAction) => [
  handleAction(changePasswordAction.success, changePasswordUpdateState),
  handleAction(googleLoginAction.success, googleLoginUpdateState),
  handleAction(loginAppAction.success, loginAppUpdateState),
  handleAction(registerAppAction.success, registerAppUpdateState),
  handleAction(resetPasswordAction.success, resetPasswordUpdateState),
]);

export default AuthReducer;
