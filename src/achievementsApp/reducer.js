import { account } from "../containers/Account/reducer";
import { appFrame } from "../containers/AppFrame/reducer";
import { assignments } from "../containers/Assignments/reducer";
import { combineReducers } from "redux";
import { courses } from "../containers/Courses/reducer";
import { firebaseReducer as firebase } from "react-redux-firebase";
import { root } from "../containers/Root/reducer";
import { cohorts } from "../containers/Cohorts/reducer";
import { cohort } from "../containers/Cohort/reducer";
import { paths } from "../containers/Paths/reducer";
import { admin } from "../containers/Admin/reducer";
import { problem } from "../containers/Problem/reducer";

export default combineReducers({
  firebase,
  admin,
  appFrame,
  courses,
  root,
  assignments,
  account,
  cohorts,
  cohort,
  paths,
  problem
});
