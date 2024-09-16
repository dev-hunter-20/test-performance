import { createActionCreator } from 'deox';

// CONSTANTS

export const EChangePasswordAction = {
  CHANGE_PASSWORD: 'CHANGE_PASSWORD',
  CHANGE_PASSWORD_REQUEST: 'CHANGE_PASSWORD_REQUEST',
  CHANGE_PASSWORD_SUCCESS: 'CHANGE_PASSWORD_SUCCESS',
  CHANGE_PASSWORD_FAILED: 'CHANGE_PASSWORD_FAILED',
};

// FUNCTION

export const changePasswordAction = {
  request: createActionCreator(
    EChangePasswordAction.CHANGE_PASSWORD_REQUEST,
    (resolve) => (materials, successCallback, failedCallback) =>
      resolve({ materials, successCallback, failedCallback }),
  ),
  success: createActionCreator(
    EChangePasswordAction.CHANGE_PASSWORD_SUCCESS,
    (resolve) => (response) => resolve({ response }),
  ),
  failure: createActionCreator(
    EChangePasswordAction.CHANGE_PASSWORD_FAILED,
    (resolve) => (error) => resolve({ error }),
  ),
};
