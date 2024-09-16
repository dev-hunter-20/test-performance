export const changePasswordUpdateState = (state, action) => ({
  ...state,
  changePasswordResponse: action.payload.response,
});
