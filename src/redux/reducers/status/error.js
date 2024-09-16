import { getType } from 'deox';
import { uiActions } from './../../actions';
import { showNotification } from '../../../utils/functions';
import { ETypeNotification } from '../../../common/enums';

const getErrorMatches = (actionType) => /(.*)_(REQUEST|FAILED)/.exec(actionType);

const errorReducer = (state = {}, action) => {
  if (action.type === getType(uiActions.resetActionStatus)) {
    const { actionName } = action.payload;
    const { [actionName]: _, ...newState } = state;
    return newState;
  }

  const matches = getErrorMatches(action.type);

  if (!matches) {
    return state;
  }

  const [, requestName, requestState] = matches;

  let error = action.payload?.error;
  let code;

  if (error instanceof Error) {
    const axiosErrorData = error?.response?.data;

    code = axiosErrorData?.statusCode;

    error =
      axiosErrorData?.error ||
      axiosErrorData?.message ||
      axiosErrorData?.error_description ||
      axiosErrorData?.errors?.message ||
      error?.message;

    if (error) {
      showNotification(ETypeNotification.ERROR, error);
    }
  }

  return {
    ...state,
    [requestName]: requestState === 'FAILED' && error ? { error, code } : null,
  };
};

export default errorReducer;
