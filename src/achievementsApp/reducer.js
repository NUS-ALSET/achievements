import { combineReducers } from "redux";
import { appFrame } from "../containers/AppFrame/reducer";
import { firebaseReducer as firebase } from "react-redux-firebase";
import { courses } from "../containers/Courses/reducer";
import { root } from "../containers/Root/reducer";
import { assignments } from "../containers/Assignments/reducer";
import { account } from "../containers/Account/reducer";

export default combineReducers({
  firebase,
  appFrame,
  courses,
  root,
  assignments,
  account
});
