import { getType } from 'deox';

import { uiActions } from '../../../redux/actions';

const successReducer = (state = {}, action) => {
  if (action.type === getType(uiActions.resetActionStatus)) {
    const { actionName } = action.payload;
    const { [actionName]: _, ...newState } = state;
    return newState;
  }

  const matches = /(.*)_(REQUEST|SUCCESS)/.exec(action.type);

  if (!matches) return state;

  const [, requestName, requestStatus] = matches;
  return {
    ...state,
    [requestName]: requestStatus === 'SUCCESS',
  };
};

export default successReducer;
