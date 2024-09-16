export const resetPasswordUpdateState = (state, action) => ({
  ...state,
  resetPasswordResponse: action.payload.response,
});
