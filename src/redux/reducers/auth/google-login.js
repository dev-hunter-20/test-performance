export const googleLoginUpdateState = (state, action) => ({
  ...state,
  googleLoginResponse: action.payload.response,
});
