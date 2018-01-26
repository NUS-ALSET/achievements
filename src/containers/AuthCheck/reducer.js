import { RISE_ERROR_MESSAGE } from "./actions";

export const authCheck = (
  state = {
    notificationMessage: ""
  },
  action
) => {
  switch (action.type) {
    case RISE_ERROR_MESSAGE:
      return {
        ...state,
        notificationMessage: action.error
      };
    default:
      return state;
  }
};
