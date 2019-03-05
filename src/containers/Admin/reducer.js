import { FETCH_SERVICE_DETAILS_SUCCESS } from "./actions";

  const initalState = {
    service: {
        name : "",
        accessToken : "",
        levelsUrl: "",
        profileUrl: ""
    }
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
      default:
        return state;
    }
  };
  