/* eslint no-console: 0 */

import { APP_SETTING } from "../../achievementsApp/config";
import {
  // courseMemberAchievementsRefetch,
  ASSIGNMENTS_SOLUTIONS_REFRESH_REQUEST,
  assignmentsSolutionsRefreshSuccess,
  assignmentsSolutionsRefreshFail
} from "./actions";

import {
  call,
  put,
  select,
  takeLatest
} from "redux-saga/effects";

import { notificationShow } from "../Root/actions";

import { solutionsService } from "../../services/solutions";
import { getCourseProps } from "./selectors";


export default [
  
];
