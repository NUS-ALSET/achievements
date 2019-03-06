import {
  FETCH_SERVICE_DETAILS_SUCCESS,
  REMOVE_SERVICE
} from "./actions";

  const initalState = {
    service: {}
  }
  export const admin = (
    state = initalState,
    action
  ) => {
    switch (action.type) {
      case FETCH_SERVICE_DETAILS_SUCCESS:
        return {
            ...state,
            service: action.service
        }
      case REMOVE_SERVICE:
        return {
          ...state,
          service: {}
        }
      default:
        return state;
    }
  };