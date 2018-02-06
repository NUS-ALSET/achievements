import { combineReducers } from "redux";
import { appFrame } from "../containers/AppFrame/reducer";
import { firebaseReducer as firebase } from "react-redux-firebase";
import { courses } from "../containers/Courses/reducer";
import { authCheck } from "../containers/AuthCheck/reducer";
import { assignments } from "../containers/Assignments/reducer";
import { account } from "../containers/Account/reducer";

export default combineReducers({
  firebase,
  appFrame,
  courses,
  authCheck,
  assignments,
  account
});
