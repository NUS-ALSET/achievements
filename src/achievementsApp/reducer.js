import { combineReducers } from "redux";
import { firebaseReducer as firebase } from "react-redux-firebase";

import { account } from "../containers/Account/reducer";
import { appFrame } from "../containers/AppFrame/reducer";
import { assignments } from "../containers/Assignments/reducer";
import { courses } from "../containers/Courses/reducer";
import { root } from "../containers/Root/reducer";
import { cohorts } from "../containers/Cohorts/reducer";
import { cohort } from "../containers/Cohort/reducer";
import { path } from "../containers/Path/reducer";
import { paths } from "../containers/Paths/reducer";
import { problem } from "../containers/Activity/reducer";
import { CRUDdemo } from "../containers/IdeaLab/reducer";

export default combineReducers({
  firebase,
  appFrame,
  courses,
  root,
  assignments,
  account,
  cohorts,
  cohort,
  path,
  paths,
  problem,
  CRUDdemo
});
