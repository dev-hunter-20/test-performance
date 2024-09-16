import { createActionCreator } from 'deox';

// CONSTANTS

export const ERegisterAppAction = {
  REGISTER_APP: 'REGISTER_APP',
  REGISTER_APP_REQUEST: 'REGISTER_APP_REQUEST',
  REGISTER_APP_SUCCESS: 'REGISTER_APP_SUCCESS',
  REGISTER_APP_FAILED: 'REGISTER_APP_FAILED',
};

// FUNCTION

export const registerAppAction = {
  request: createActionCreator(
    ERegisterAppAction.REGISTER_APP_REQUEST,
    (resolve) => (materials, successCallback, failedCallback) =>
      resolve({ materials, successCallback, failedCallback }),
  ),
  success: createActionCreator(
    ERegisterAppAction.REGISTER_APP_SUCCESS,
    (resolve) => (response) => resolve({ response }),
  ),
  failure: createActionCreator(ERegisterAppAction.REGISTER_APP_FAILED, (resolve) => (error) => resolve({ error })),
};
