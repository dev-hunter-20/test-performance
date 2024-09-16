import { createActionCreator } from 'deox';

import { EUIAction } from './constants';

export const uiActions = {
  resetActionStatus: createActionCreator(
    EUIAction.RESET_ACTION_STATUS,
    (resolve) => (actionName) => resolve({ actionName: actionName.replace('_REQUEST', '') }),
  ),
  setDevice: createActionCreator(EUIAction.SET_DEVICE, (resolve) => (deviceWidth) => resolve({ deviceWidth })),
  setVisibleMenu: createActionCreator(EUIAction.SET_VISIBLE_MENU, (resolve) => (visible) => resolve({ visible })),
};
