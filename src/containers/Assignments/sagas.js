/* eslint no-console: 0 */

import { APP_SETTING } from "../../achievementsApp/config";
import {
  ASSIGNMENTS_EDITOR_TABLE_SHOWN,
  ASSIGNMENT_ADD_REQUEST,
  ASSIGNMENT_QUICK_UPDATE_REQUEST,
  ASSIGNMENT_REORDER_REQUEST,
  ASSIGNMENT_SOLUTION_REQUEST,
  UPDATE_NEW_ASSIGNMENT_FIELD,
  assignmentAddFail,
  assignmentAddSuccess,
  assignmentCloseDialog,
  assignmentQuickUpdateFail,
  assignmentQuickUpdateSuccess,
  assignmentReorderFail,
  assignmentReorderSuccess,
  assignmentSolutionFail,
  assignmentSolutionSuccess,
  updateNewAssignmentField,
  setDefaultAssignmentFields,
  ASSIGNMENT_REFRESH_PROFILES_REQUEST,
  assignmentRefreshProfilesSuccess,
  assignmentRefreshProfilesFail,
  ASSIGNMENTS_ASSISTANTS_SHOW_REQUEST,
  assignmentsAssistantsDialogShow,
  ASSIGNMENT_ASSISTANT_KEY_CHANGE,
  assignmentAssistantFound,
  ASSIGNMENT_ADD_ASSISTANT_REQUEST,
  assignmentAddAssistantFail,
  assignmentAddAssistantSuccess,
  ASSIGNMENT_REMOVE_ASSISTANT_REQUEST,
  assignmentRemoveAssistantSuccess,
  assignmentRemoveAssistantFail,
  COURSE_ASSIGNMENTS_OPEN,
  COURSE_ASSIGNMENTS_CLOSE,
  courseMembersFetchFail,
  courseMembersFetchSuccess,
  // courseMemberAchievementsRefetch,
  COURSE_REMOVE_STUDENT_REQUEST,
  courseRemoveStudentSuccess,
  courseRemoveStudentFail,
  assignmentPathsFetchSuccess,
  assignmentProblemsFetchSuccess,
  ASSIGNMENT_PATH_PROBLEM_SOLUTION_REQUEST,
  assignmentSubmitRequest,
  COURSE_MOVE_STUDENT_DIALOG_SHOW,
  courseMyCoursesFetchSuccess,
  COURSE_MOVE_STUDENT_REQUEST,
  courseMoveStudentFail,
  courseMoveStudentSuccess,
  ASSIGNMENT_PATH_PROGRESS_SOLUTION_REQUEST,
  assignmentPathProgressFetchSuccess,
  ASSIGNMENT_SHOW_EDIT_DIALOG,
  ASSIGNMENTS_SOLUTIONS_REFRESH_REQUEST,
  assignmentsSolutionsRefreshSuccess,
  assignmentsSolutionsRefreshFail,
  coursePathsFetchSuccess,
  enableCommitAfterAutofill,
  ASSIGNMENT_TEAM_CHOICE_SOLUTION_REQUEST,
  assignmentTeamChoiceSolutionSuccess
} from "./actions";

import { eventChannel } from "redux-saga";
import {
  call,
  put,
  select,
  take,
  takeLatest,
  throttle
} from "redux-saga/effects";

import { ASSIGNMENTS_TYPES, coursesService } from "../../services/courses";
import { notificationShow } from "../Root/actions";
import { pathsService } from "../../services/paths";
import {
  problemInitRequest,
  problemSolutionRefreshSuccess,
  problemSolveUpdate
} from "../Activity/actions";
import { solutionsService } from "../../services/solutions";
import { getCourseProps } from "./selectors";

// Since we're able to check 1 and only 1 course at once then we'll keep
// course members channel at almost global variable...
const courseMembersChannels = {};

// FIXIT: implement buffering
function createCourseMembersChannel(courseId) {
  return eventChannel(emit => {
    courseMembersChannels[courseId] = emit;
    coursesService.watchCourseMembers(courseId, response => emit(response));

    return coursesService.unWatchCourseMembers;
  });
}

const ONE_SECOND = 1000;

export function* courseAssignmentsOpenHandler(action) {
  let uid = yield select(state => state.firebase.auth.uid);

  if (!uid) {
    yield take("@@reactReduxFirebase/LOGIN");
  }

  try {
    const pathsData = yield call(
      coursesService.fetchCoursePaths,
      action.courseId
    );
    yield put(coursePathsFetchSuccess(action.courseId, pathsData));
  } catch (err) {
    // That's normal behavior if user isn't course member
    if (err.code && err.code !== "PERMISSION_DENIED") {
      yield put(notificationShow(err.message));
    }
  }

  const channel = yield call(createCourseMembersChannel, action.courseId);

  while (true) {
    const {
      courseMembers,
      err,
      stop
      /* , achievements, studentId*/
    } = yield take(channel);

    if (stop) {
      channel.close();
      break;
    }
    if (err) {
      yield put(courseMembersFetchFail(action.courseId, err.message));
      break;
    }
    if (courseMembers) {
      yield put(courseMembersFetchSuccess(action.courseId, courseMembers));
    }
    /*
    if (achievements && studentId) {
      yield put(
        courseMemberAchievementsRefetch(
          action.courseId,
          studentId,
          achievements
        )
      );
    }
    */
  }
}

export function* addAssignmentRequestHandle(action) {
  try {
    const assignments = yield select(
      state => state.firebase.data.assignments[action.courseId]
    );
    yield call(coursesService.validateAssignment, action.assignment);
    yield put(assignmentCloseDialog());
    yield call(
      coursesService.addAssignment,
      action.courseId,
      action.assignment,
      assignments
    );
    yield put(assignmentAddSuccess());
  } catch (err) {
    yield put(assignmentAddFail(err.message));
    yield put(notificationShow(err.message));
  }
}

export function* updateNewAssignmentFieldHandler(action) {
  if (["details", "name"].includes(action.field)) {
    return;
  }

  const location = window.location.href.replace(/#.*$/, "");
  const data = yield select(state => ({
    assignment: state.assignments.dialog.value,
    manualUpdates: state.assignments.dialog.manualUpdates || {},
    uid: state.firebase.auth.uid,
    paths: state.assignments.dialog.paths
  }));
  let activity;
  let activities;
  let assignment = data.assignment;
  let updatedFields = {};

  // updateNewAssignmentField AUTOFILL text field
  assignment = assignment || {};
  if (["CodeCombat_Number", "Profile"].includes(assignment.questionType)) {
    updatedFields.details = "https://codecombat.com";
  } else {
    console.log("assignment questionTypes are:", assignment.questionType);
  }

  switch (action.field) {
    case "questionType":
      if (
        [
          ASSIGNMENTS_TYPES.PathActivity.id,
          ASSIGNMENTS_TYPES.PathProgress.id
        ].includes(action.value)
      ) {
        const paths = yield call(
          [pathsService, pathsService.fetchPaths],
          data.uid
        );
        yield put(assignmentPathsFetchSuccess(paths));
          updatedFields.path = ASSIGNMENTS_TYPES.PathProgress.id === action.value ?  "" : assignment.path || data.uid;
        
          if (!data.manualUpdates.details) {
          updatedFields.details = `${location}#/paths/${updatedFields.path}`;
        }
      } else if (
        [
          ASSIGNMENTS_TYPES.TeamFormation.id,
          ASSIGNMENTS_TYPES.TeamText.id
        ].includes(action.value)
      ) {
        updatedFields.details = "";
      }
      break;
    case "level":
      updatedFields.details = APP_SETTING.CodeCombatLevels[action.value].url;
      break;
    case "path":
      activities = yield call(
        [pathsService, pathsService.fetchProblems],
        data.uid,
        action.value
      );

      yield put(assignmentProblemsFetchSuccess(activities));

      updatedFields.details = `${location}#/paths/${data.assignment.path}`;

      if (assignment.questionType === ASSIGNMENTS_TYPES.PathProgress.id) {
        const paths = Object.assign(
          {},
          data.paths.myPaths,
          data.paths.publicPaths
        );
        updatedFields.name = `Path progress for ${paths[data.assignment.path]
          .name || "..."}`;
        yield put(enableCommitAfterAutofill());
      }

      updatedFields.pathActivity = "";
      break;
    case "pathActivity":
      activities = yield select(state => state.assignments.dialog.activities);
      activities = activities || [];

      activity = activities.find(
        activity => activity.id === assignment.pathActivity
      );

      if (
        !data.manualUpdates.details &&
        activity &&
        activity.type !== "jupyterInline"
      ) {
        updatedFields.details =
          activity.youtubeURL || activity.problemURL || "";
      }
      if (!data.manualUpdates.name && activity) {
        updatedFields.name = activity.name;
        yield put(enableCommitAfterAutofill());
      }

      break;
    default:
  }
  // do not dispatch updateNewAssignmentField action in this handler, otherwise result will be infinite loop.
  // because if you dispatch updateNewAssignmentField action then this handler will run again
  yield put(setDefaultAssignmentFields(updatedFields));
}

export function* assignmentSubmitRequestHandler(action) {
  const assignment = yield select(
    state =>
      state.firebase.data.assignments[action.courseId][action.assignmentId]
  );
  const problemJSON = yield select(state => state.problem.pathProblem);
  const status = yield select(
    state => state.problem.solution && state.problem.solution.status
  );

  try {
    yield call(
      [coursesService, coursesService.submitSolution],
      action.courseId,
      { ...assignment, id: action.assignmentId, problemJSON },
      action.solution,
      null,
      status
    );
    yield put(assignmentSolutionSuccess(action.courseId, action.assignmentId));
    yield put(
      notificationShow(`Solution submitted for assignment "${assignment.name}"`)
    );
    yield put(assignmentCloseDialog());
  } catch (err) {
    yield put(
      assignmentSolutionFail(action.courseId, action.assignmentId, err.message)
    );
    yield put(notificationShow(err.message));
  }
}

export function* assignmentQuickUpdateRequestHandler(action) {
  try {
    yield call(
      [coursesService, coursesService.updateAssignment],
      action.courseId,
      action.assignmentId,
      action.field,
      action.value
    );
    yield put(assignmentQuickUpdateSuccess(action));
  } catch (err) {
    yield put(assignmentQuickUpdateFail({ ...action, reason: err.message }));
    yield put(notificationShow(err.message));
  }
}

export function* assignmentReorderRequestHandler(action) {
  try {
    const assignments = yield select(state => state.firebase.data.assignments);
    yield call(
      [coursesService, coursesService.reorderAssignment],
      assignments,
      action.courseId,
      action.assignmentId,
      action.increase
    );
    yield put(
      assignmentReorderSuccess(
        action.courseId,
        action.assignmentId,
        action.increase
      )
    );
  } catch (err) {
    yield put(
      assignmentReorderFail(action.courseId, action.assignmentId, err.message)
    );
    yield put(notificationShow(err.message));
  }
}

export function* assignmentsEditorTableShownHandler(action) {
  const assignments = yield select(
    state => state.firebase.data.assignments[action.courseId]
  );
  try {
    yield call(
      coursesService.processAssignmentsOrderIndexes,
      action.courseId,
      assignments
    );
  } catch (err) {
    yield put(
      notificationShow(
        `Error occurs during assignments default order indexes set: ${
          err.message
        }`
      )
    );
  }
}

export function* assignmentRefreshProfilesRequestHandler(action) {
  try {
    yield call(coursesService.refreshProfileSolutions, action.courseId);
    yield put(assignmentRefreshProfilesSuccess(action.courseId));
  } catch (err) {
    yield put(assignmentRefreshProfilesFail(action.courseId, err.message));
    yield put(notificationShow(err.message));
  }
}

export function* watchAssistantsControlRequestHandler(action) {
  try {
    const assistants = yield call(
      coursesService.getAssistants,
      action.courseId
    );
    yield put(assignmentsAssistantsDialogShow(action.courseId, assistants));
  } catch (err) {
    yield put(notificationShow(err.message));
  }
}

export function* assignmentShowEditDialogHandler(action) {
  try {
    switch (action.assignment.questionType) {
      case ASSIGNMENTS_TYPES.PathActivity.id:
        yield put(
          updateNewAssignmentField({
            questionType: ASSIGNMENTS_TYPES.PathActivity.id
          })
        );
        yield put(updateNewAssignmentField({ path: action.assignment.path }));
        break;
      default:
    }
  } catch (err) {
    yield put(notificationShow(err.message));
  }
}

export function* assistantKeyInputHandler(action) {
  try {
    const assistant = yield call(coursesService.fetchUser, action.assistantKey);
    yield put(assignmentAssistantFound(assistant));
  } catch (err) {
    yield put(notificationShow(err.message));
  }
}

export function* assignmentAddAssistantRequestHandler(action) {
  try {
    const existingAssistants = yield select(
      state => state.assignments.dialog.assistants
    );

    const ownerUID = yield select(state => state.firebase.auth.uid);

    if (ownerUID === action.assistantId) {
      let error = "Cannot add self as assistant";
      yield put(
        assignmentAddAssistantFail(action.courseId, action.assistantId, error)
      );
      return yield put(notificationShow(error));
    }

    if (
      existingAssistants.filter(
        assistant => assistant.id === action.assistantId
      ).length
    ) {
      let error = "Assistant already assigned";
      yield put(
        assignmentAddAssistantFail(action.courseId, action.assistantId, error)
      );
      return yield put(notificationShow(error));
    }

    yield call(
      coursesService.addAssistant,
      action.courseId,
      action.assistantId
    );
    yield put(
      assignmentAddAssistantSuccess(action.courseId, action.assistantId)
    );
  } catch (err) {
    yield put(
      assignmentAddAssistantFail(
        action.courseId,
        action.assistantId,
        err.message
      )
    );
    yield notificationShow(err.message);
  }
}

function* assignmentRemoveAssistantRequestHandler(action) {
  try {
    yield call(
      coursesService.removeAssistant,
      action.courseId,
      action.assistantId
    );
    yield put(
      assignmentRemoveAssistantSuccess(action.courseId, action.assistantId)
    );
  } catch (err) {
    yield put(
      assignmentRemoveAssistantFail(
        action.courseId,
        action.assistantId,
        err.message
      )
    );
    yield put(notificationShow(err.message));
  }
}

export function* courseAssignmentsCloseHandler(action) {
  const emitToChannel = courseMembersChannels[action.courseId];

  if (emitToChannel) {
    yield emitToChannel({ stop: true });
  }
}

export function* courseRemoveStudentRequestHandler(action) {
  try {
    yield call(
      coursesService.removeStudentFromCourse,
      action.courseId,
      action.studentId
    );
    yield put(assignmentCloseDialog());
    yield put(courseRemoveStudentSuccess(action.courseId, action.studentId));
  } catch (err) {
    yield put(
      courseRemoveStudentFail(action.courseId, action.studentId, err.message)
    );
    yield put(notificationShow(err.message));
  }
}

export function* assignmentPathProblemSolutionRequestHandler(action) {
  try {
    yield put(assignmentSubmitRequest(action.assignment, null));
    const pathProblem = yield call(
      [pathsService, pathsService.fetchPathProblem],
      action.assignment.path || action.problemOwner,
      action.problemId
    );
    yield put(
      problemInitRequest(
        pathProblem.pathId,
        pathProblem.problemId,
        action.solution,
        action.readOnly
      )
    );

    if (Math.random()) {
      return Promise.resolve();
    }
    if (pathProblem.type === "youtube") {
      yield put(
        problemSolutionRefreshSuccess(
          pathProblem.problemId,
          action.solution || {}
        )
      );
    }

    if (
      action.solution &&
      action.solution.originalSolution &&
      action.solution.originalSolution.value
    ) {
      switch (pathProblem.type) {
        case "jupyter":
        case "jupyterInline":
          yield put(
            problemSolveUpdate(
              pathProblem.pathId,
              pathProblem.problemId,
              action.solution.originalSolution.value
            )
          );
          break;
        case "youtube":
          yield put(
            problemSolutionRefreshSuccess(
              pathProblem.problemId,
              action.solution
            )
          );
          break;
        default:
      }
    }
  } catch (err) {
    yield put(notificationShow(err.message));
  }
}

export function* assignmentPathProgressSolutionRequestHandler(action) {
  try {
    yield put(assignmentSubmitRequest(action.assignment, null));
    const uid = yield select(state => state.firebase.auth.uid);
    const pathProgress = yield call(
      [pathsService, pathsService.fetchPathProgress],
      uid,
      action.pathOwner,
      action.pathId
    );
    yield put(assignmentPathProgressFetchSuccess(pathProgress));
  } catch (err) {
    console.error(err.stack);
    yield put(notificationShow(err.message));
  }
}

export function* courseMoveStudentDialogShowHandler() {
  try {
    const uid = yield select(state => state.firebase.auth.uid);
    const courses = yield call(coursesService.fetchCourses, uid);
    yield put(courseMyCoursesFetchSuccess(courses));
  } catch (err) {
    yield put(notificationShow(err.message));
  }
}

export function* courseMoveStudentRequestHandler(action) {
  if (!(action.sourceCourseId || action.targetCourseId || action.studentId)) {
    yield put(notificationShow("Unable move student"));
  }
  try {
    yield put(assignmentCloseDialog());
    yield call(
      [coursesService, coursesService.moveStudent],
      action.sourceCourseId,
      action.targetCourseId,
      action.studentId
    );
    yield put(
      courseMoveStudentSuccess(
        action.sourceCourseId,
        action.targetCourseId,
        action.studentId
      )
    );
  } catch (err) {
    yield put(
      courseMoveStudentFail(
        action.sourceCourseId,
        action.targetCourseId,
        action.studentId,
        err.message
      )
    );
  }
}

export function* assignmentsSolutionsRefreshRequestHandler(action) {
  try {
    const course = yield select(state =>
      getCourseProps(state, { match: { params: action } })
    );

    yield call(solutionsService.refreshSolutions, course);
    yield put(assignmentsSolutionsRefreshSuccess(action.courseId));
  } catch (err) {
    yield put(assignmentsSolutionsRefreshFail(action.courseId, err.message));
    yield put(notificationShow(err.message));
  }
}

export function* assignmentTeamChoiceSolutionRequestHandler(action) {
  const options = yield call(
    solutionsService.getTeamChoiceOptions,
    action.courseId,
    action.assignment
  );
  yield put(
    assignmentTeamChoiceSolutionSuccess(
      action.courseId,
      action.assignment,
      action.solution,
      options
    )
  );
  yield put(assignmentSubmitRequest(action.assignment, action.solution));
}

export default [
  function* watchCourseAssignmentsOpen() {
    yield takeLatest(COURSE_ASSIGNMENTS_OPEN, courseAssignmentsOpenHandler);
  },
  function* watchNewAssignmentRequest() {
    yield takeLatest(ASSIGNMENT_ADD_REQUEST, addAssignmentRequestHandle);
  },
  function* watchAssignmentShowEditDialog() {
    yield takeLatest(
      ASSIGNMENT_SHOW_EDIT_DIALOG,
      assignmentShowEditDialogHandler
    );
  },
  function* watchUpdateNewAssignmentField() {
    yield takeLatest(
      UPDATE_NEW_ASSIGNMENT_FIELD,
      updateNewAssignmentFieldHandler
    );
  },
  function* watchAssignmentSubmitRequest() {
    yield takeLatest(
      ASSIGNMENT_SOLUTION_REQUEST,
      assignmentSubmitRequestHandler
    );
  },
  function* watchUpdateAssignmentRequest() {
    yield takeLatest(
      ASSIGNMENT_QUICK_UPDATE_REQUEST,
      assignmentQuickUpdateRequestHandler
    );
  },
  function* watchAssignmentReorderRequest() {
    yield takeLatest(
      ASSIGNMENT_REORDER_REQUEST,
      assignmentReorderRequestHandler
    );
  },
  function* watchAssignmentsEditorTableShown() {
    yield takeLatest(
      ASSIGNMENTS_EDITOR_TABLE_SHOWN,
      assignmentsEditorTableShownHandler
    );
  },
  function* watchRefreshProfilesRequest() {
    yield takeLatest(
      ASSIGNMENT_REFRESH_PROFILES_REQUEST,
      assignmentRefreshProfilesRequestHandler
    );
  },
  function* watchAssistantsControlRequest() {
    yield takeLatest(
      ASSIGNMENTS_ASSISTANTS_SHOW_REQUEST,
      watchAssistantsControlRequestHandler
    );
  },
  function* watchAssistantKeyInput() {
    yield throttle(
      ONE_SECOND,
      ASSIGNMENT_ASSISTANT_KEY_CHANGE,
      assistantKeyInputHandler
    );
  },
  function* watchAssignmentAddAssistantRequest() {
    yield takeLatest(
      ASSIGNMENT_ADD_ASSISTANT_REQUEST,
      assignmentAddAssistantRequestHandler
    );
  },
  function* watchAssignmentRemoveAssistantRequest() {
    yield takeLatest(
      ASSIGNMENT_REMOVE_ASSISTANT_REQUEST,
      assignmentRemoveAssistantRequestHandler
    );
  },
  function* watchCourseRemoveStudentRequest() {
    yield takeLatest(
      COURSE_REMOVE_STUDENT_REQUEST,
      courseRemoveStudentRequestHandler
    );
  },
  function* watchCourseAssignmentsClose() {
    yield takeLatest(COURSE_ASSIGNMENTS_CLOSE, courseAssignmentsCloseHandler);
  },
  function* watchAssignmentPathProblemSubmitRequest() {
    yield takeLatest(
      ASSIGNMENT_PATH_PROBLEM_SOLUTION_REQUEST,
      assignmentPathProblemSolutionRequestHandler
    );
  },
  function* watchAssignmentPathProgressSolutionRequest() {
    yield takeLatest(
      ASSIGNMENT_PATH_PROGRESS_SOLUTION_REQUEST,
      assignmentPathProgressSolutionRequestHandler
    );
  },
  function* watchCourseMoveStudentDialogShow() {
    yield takeLatest(
      COURSE_MOVE_STUDENT_DIALOG_SHOW,
      courseMoveStudentDialogShowHandler
    );
  },
  function* watchCourseMoveStudentRequest() {
    yield takeLatest(
      COURSE_MOVE_STUDENT_REQUEST,
      courseMoveStudentRequestHandler
    );
  },
  function* watchAssignmentsSolutionsRefreshRequest() {
    yield takeLatest(
      ASSIGNMENTS_SOLUTIONS_REFRESH_REQUEST,
      assignmentsSolutionsRefreshRequestHandler
    );
  },
  function* watchAssignmentTeamChoiceSolutionRequest() {
    yield takeLatest(
      ASSIGNMENT_TEAM_CHOICE_SOLUTION_REQUEST,
      assignmentTeamChoiceSolutionRequestHandler
    );
  } /* ,
  function* watchAssignmentsTestSomething() {
    yield takeLatest(
      ASSIGNMENTS_TEST_SOMETHING,
      assignmentsTestSomethingHandler
    );
  }*/
];
