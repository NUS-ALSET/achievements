import { combineReducers } from "redux";
import { firebaseReducer as firebase } from "react-redux-firebase";

import { account } from "../containers/Account/reducer";
import { admin } from "../containers/Admin/reducer";
import { appFrame } from "../containers/AppFrame/reducer";
import { assignments } from "../containers/Assignments/reducer";
import { cohorts } from "../containers/Cohorts/reducer";
import { cohort } from "../containers/Cohort/reducer";
import { courses } from "../containers/Courses/reducer";
import { CRUDdemo } from "../containers/IdeaLab/reducer";
import { journeys } from "../containers/Journeys/reducer";
import { message } from "../containers/Message/reducer";
import { path } from "../containers/Path/reducer";
import { paths } from "../containers/Paths/reducer";
import { problem } from "../containers/Activity/reducer";
import { root } from "../containers/Root/reducer";
import { task } from "../containers/Task/reducer";
import { tasks } from "../containers/Tasks/reducer";

export default combineReducers({
  account,
  admin,
  appFrame,
  assignments,
  cohorts,
  cohort,
  courses,
  CRUDdemo,
  firebase,
  journeys,
  message,
  path,
  paths,
  problem,
  root,
  task,
  tasks
});
