export const loginAppUpdateState = (state, action) => ({
  ...state,
  loginAppResponse: action.payload.response,
});
