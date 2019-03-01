import { 
  FETCH_COURSE_MEMBERS,
  FETCH_COURSE_MEMBERS_SUCCESS,
  FETCH_COURSE_MEMBERS_FALIURE,
  SEND_MESSAGE,
  SEND_MESSAGE_SUCCESS,
  SEND_MESSAGE_FALIURE
} from "./actions";

export const message = (
  state = {
    courseMembers: []
  },
  action
) => {
  switch (action.type) {
    case FETCH_COURSE_MEMBERS:
      return {
        ...state
      }
    case FETCH_COURSE_MEMBERS_SUCCESS:
      return {
        ...state,
        courseMembers: action.members
      }
    case FETCH_COURSE_MEMBERS_FALIURE:
      return {
        ...state,
        err: action.err
      }
    case SEND_MESSAGE:
      return {
        ...state,
        err: ""
      }
    case SEND_MESSAGE_SUCCESS:
      return {
        ...state
      }
    case SEND_MESSAGE_FALIURE:
      return {
        ...state,
        err: action.err
      }
    default:
      return state;
  }
};
