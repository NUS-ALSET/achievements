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
  courseMemberAchievementsRefetch,
  COURSE_REMOVE_STUDENT_REQUEST,
  courseRemoveStudentSuccess,
  courseRemoveStudentFail,
  assignmentPathsFetchSuccess,
  assignmentProblemsFetchSuccess,
  assignmentPathProblemFetchSuccess,
  ASSIGNMENT_PATH_PROBLEM_SOLUTION_REQUEST,
  assignmentSubmitRequest
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

import { coursesService } from "../../services/courses";
import { notificationShow } from "../Root/actions";
import { pathsService } from "../../services/paths";

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
  if (action.field === "details") {
    return yield Promise.resolve();
  }

  const data = yield select(state => ({
    assignment: state.assignments.dialog.value,
    uid: state.firebase.auth.uid
  }));
  let problems;
  let assignment = data.assignment;

  assignment = assignment || {};
  if (["CodeCombat_Number", "Profile"].includes(assignment.questionType)) {
    yield put(updateNewAssignmentField("details", "https://codecombat.com"));
  }

  switch (action.field) {
    case "questionType":
      if (action.value === "PathProblem") {
        const paths = yield call(
          [pathsService, pathsService.fetchPaths],
          data.uid
        );

        yield put(assignmentPathsFetchSuccess(paths));
      }
      break;
    case "level":
      yield put(
        updateNewAssignmentField(
          "details",
          APP_SETTING.levels[action.value].url
        )
      );
      break;
    case "path":
      problems = yield call(pathsService.fetchProblems, data.uid, action.value);

      yield put(assignmentProblemsFetchSuccess(problems));
      break;
    default:
  }
}

export function* assignmentSolutionRequestHandler(action) {
  const assignment = yield select(
    state =>
      state.firebase.data.assignments[action.courseId][action.assignmentId]
  );

  try {
    yield call(
      [coursesService, coursesService.submitSolution],
      action.courseId,
      { ...assignment, id: action.assignmentId },
      action.solution
    );
    yield put(assignmentSolutionSuccess(action.courseId, action.assignmentId));
    yield put(
      notificationShow(`Solution submitted for assignment "${assignment.name}"`)
    );
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

    if (
      existingAssistants.filter(
        assistant => assistant.id === action.assistantId
      ).length
    ) {
      const error = "Assistant already assigned";
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

export function* courseAssignmentsOpenHandler(action) {
  let uid = yield select(state => state.firebase.auth.uid);

  if (!uid) {
    yield take("@@reactReduxFirebase/LOGIN");
    yield select(state => state.firebase.auth.uid);
  }

  const channel = yield call(createCourseMembersChannel, action.courseId);

  while (true) {
    const { courseMembers, err, stop, achievements, studentId } = yield take(
      channel
    );

    if (stop) {
      channel.close();
      break;
    }
    if (err)
      if (err) {
        yield put(courseMembersFetchFail(action.courseId, err.message));
        break;
      }
    if (courseMembers) {
      yield put(courseMembersFetchSuccess(action.courseId, courseMembers));
    }
    if (achievements && studentId) {
      yield put(
        courseMemberAchievementsRefetch(
          action.courseId,
          studentId,
          achievements
        )
      );
    }
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
      action.problemOwner,
      action.problemId
    );
    yield put(assignmentPathProblemFetchSuccess(pathProblem));
  } catch (err) {
    yield put(notificationShow(err.message));
  }
}

export default [
  function* watchNewAssignmentRequest() {
    yield takeLatest(ASSIGNMENT_ADD_REQUEST, addAssignmentRequestHandle);
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
      assignmentSolutionRequestHandler
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
  function* watchCourseAssignmentsOpen() {
    yield takeLatest(COURSE_ASSIGNMENTS_OPEN, courseAssignmentsOpenHandler);
  },
  function* watchCourseAssignmentsClose() {
    yield takeLatest(COURSE_ASSIGNMENTS_CLOSE, courseAssignmentsCloseHandler);
  },
  function* watchAssignmentSubmitRequest() {
    yield takeLatest(
      ASSIGNMENT_PATH_PROBLEM_SOLUTION_REQUEST,
      assignmentPathProblemSolutionRequestHandler
    );
  }
];
