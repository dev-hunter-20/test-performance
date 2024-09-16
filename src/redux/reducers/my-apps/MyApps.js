export const getListMyApps = (state, action) => ({
  ...state,
  getMyAppsResponse: action.payload.response,
});
