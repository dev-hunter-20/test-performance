import { createActionCreator } from 'deox';

// CONSTANTS

export const ELoginAppAction = {
  LOGIN_APP: 'LOGIN_APP',
  LOGIN_APP_REQUEST: 'LOGIN_APP_REQUEST',
  LOGIN_APP_SUCCESS: 'LOGIN_APP_SUCCESS',
  LOGIN_APP_FAILED: 'LOGIN_APP_FAILED',
};

// FUNCTION

export const loginAppAction = {
  request: createActionCreator(
    ELoginAppAction.LOGIN_APP_REQUEST,
    (resolve) => (materials, successCallback, failedCallback) =>
      resolve({ materials, successCallback, failedCallback }),
  ),
  success: createActionCreator(ELoginAppAction.LOGIN_APP_SUCCESS, (resolve) => (response) => resolve({ response })),
  failure: createActionCreator(ELoginAppAction.LOGIN_APP_FAILED, (resolve) => (error) => resolve({ error })),
};
