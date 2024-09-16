import { createActionCreator } from 'deox';

// CONSTANTS

export const EGoogleLoginAction = {
  GOOGLE_LOGIN: 'GOOGLE_LOGIN',
  GOOGLE_LOGIN_REQUEST: 'GOOGLE_LOGIN_REQUEST',
  GOOGLE_LOGIN_SUCCESS: 'GOOGLE_LOGIN_SUCCESS',
  GOOGLE_LOGIN_FAILED: 'GOOGLE_LOGIN_FAILED',
};

// FUNCTION

export const googleLoginAction = {
  request: createActionCreator(
    EGoogleLoginAction.GOOGLE_LOGIN_REQUEST,
    (resolve) => (materials, successCallback, failedCallback) =>
      resolve({ materials, successCallback, failedCallback }),
  ),
  success: createActionCreator(
    EGoogleLoginAction.GOOGLE_LOGIN_SUCCESS,
    (resolve) => (response) => resolve({ response }),
  ),
  failure: createActionCreator(EGoogleLoginAction.GOOGLE_LOGIN_FAILED, (resolve) => (error) => resolve({ error })),
};
