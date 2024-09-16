import { createActionCreator } from 'deox';

// CONSTANTS

export const EGetMyAppsAction = {
  GET_MY_APPS: 'GET_MY_APPS',
  GET_MY_APPS_REQUEST: 'GET_MY_APPS_REQUEST',
  GET_MY_APPS_SUCCESS: 'GET_MY_APPS_SUCCESS',
  GET_MY_APPS_FAILED: 'GET_MY_APPS_FAILED',
};

// FUNCTION

export const getMyAppsAction = {
  request: createActionCreator(
    EGetMyAppsAction.GET_MY_APPS_REQUEST,
    (resolve) => (materials, successCallback, failedCallback) =>
      resolve({ materials, successCallback, failedCallback }),
  ),
  success: createActionCreator(EGetMyAppsAction.GET_MY_APPS_SUCCESS, (resolve) => (response) => resolve({ response })),
  failure: createActionCreator(EGetMyAppsAction.GET_MY_APPS_FAILED, (resolve) => (error) => resolve({ error })),
};
