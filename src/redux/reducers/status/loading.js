const getLoadingMatches = (actionType) => /(.*)_(REQUEST|SUCCESS|FAILED)/.exec(actionType);

const loadingReducer = (state = {}, action) => {
  const matches = getLoadingMatches(action.type);

  if (!matches) {
    return state;
  }

  const [, requestName, requestStatus] = matches;
  return {
    ...state,
    [requestName]: requestStatus === 'REQUEST',
  };
};

export default loadingReducer;
