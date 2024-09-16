import { createActionCreator } from 'deox';

// CONSTANTS

export const EResetPasswordAction = {
  RESET_PASSWORD: 'RESET_PASSWORD',
  RESET_PASSWORD_REQUEST: 'RESET_PASSWORD_REQUEST',
  RESET_PASSWORD_SUCCESS: 'RESET_PASSWORD_SUCCESS',
  RESET_PASSWORD_FAILED: 'RESET_PASSWORD_FAILED',
};

// FUNCTION

export const resetPasswordAction = {
  request: createActionCreator(
    EResetPasswordAction.RESET_PASSWORD_REQUEST,
    (resolve) => (materials, successCallback, failedCallback) =>
      resolve({ materials, successCallback, failedCallback }),
  ),
  success: createActionCreator(
    EResetPasswordAction.RESET_PASSWORD_SUCCESS,
    (resolve) => (response) => resolve({ response }),
  ),
  failure: createActionCreator(EResetPasswordAction.RESET_PASSWORD_FAILED, (resolve) => (error) => resolve({ error })),
};
