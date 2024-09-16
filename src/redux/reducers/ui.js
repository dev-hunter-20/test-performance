import { createReducer } from 'deox';
import { uiActions } from '../actions';

export const BREAKPOINT = 1275;

export const EDeviceType = {
  DESKTOP: 'desktop',
  MOBILE: 'mobile',
};

const initialState = {
  device: {
    type: typeof window !== 'undefined' && window.innerWidth > BREAKPOINT ? EDeviceType.DESKTOP : EDeviceType.MOBILE,
    isMobile: typeof window !== 'undefined' && window.innerWidth <= BREAKPOINT,
    width: typeof window !== 'undefined' ? window.innerWidth : 0,
  },
  visibleMenu: false,
};

const reducer = createReducer(initialState, (handleAction) => [
  handleAction(uiActions.setDevice, (state, { payload }) => ({
    ...state,
    device: {
      type: payload.deviceWidth > BREAKPOINT ? EDeviceType.DESKTOP : EDeviceType.MOBILE,
      isMobile: payload.deviceWidth <= BREAKPOINT,
      width: payload.deviceWidth,
    },
  })),
  handleAction(uiActions.setVisibleMenu, (state, { payload }) => ({
    ...state,
    visibleMenu: payload.visible,
  })),
]);

export default reducer;
