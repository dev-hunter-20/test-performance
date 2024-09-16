export const registerAppUpdateState = (state, action) => ({
  ...state,
  registerAppResponse: action.payload.response,
});
