/* eslint-disable space-before-function-paren */
import sinon from "sinon";
import * as assignmentsSagas from "../sagas";
import { coursesService } from "../../../services/courses";
import assert from "assert";
import { runSaga } from "redux-saga";
import {
  ASSIGNMENT_ADD_FAIL,
  ASSIGNMENT_ADD_SUCCESS,
  ASSIGNMENT_CLOSE_DIALOG,
  assignmentAddRequest
} from "../actions";
import { NOTIFICATION_SHOW } from "../../Root/actions";

describe("assignemnts sagas tests", () => {
  beforeEach(() =>
    sinon.stub(coursesService, "addAssignment").callsFake(() => {})
  );

  afterEach(() => coursesService.addAssignment.restore());

  it("should process assignment creation", async () => {
    const dispatched = [];

    await runSaga(
      {
        dispatch: action => dispatched.push(action),
        getState: () => ({ firebase: { data: { assignments: {} } } })
      },
      assignmentsSagas.addAssignmentRequestHandle,
      assignmentAddRequest("testCourseId", {
        questionType: "Text",
        name: "Test Assignment"
      })
    ).done;

    assert.deepStrictEqual(dispatched, [
      {
        type: ASSIGNMENT_CLOSE_DIALOG
      },
      {
        type: ASSIGNMENT_ADD_SUCCESS
      }
    ]);
    assert(
      coursesService.addAssignment.calledWith("testCourseId", {
        questionType: "Text",
        name: "Test Assignment"
      })
    );
  });

  it("should fail assignment creation", async () => {
    const dispatched = [];

    await runSaga(
      {
        dispatch: action => dispatched.push(action),
        getState: () => ({ firebase: { data: { assignments: {} } } })
      },
      assignmentsSagas.addAssignmentRequestHandle,
      assignmentAddRequest("testCourseId", {})
    ).done;

    assert.deepStrictEqual(dispatched, [
      {
        type: ASSIGNMENT_ADD_FAIL,
        error: "Name required for Assignment"
      },
      {
        type: NOTIFICATION_SHOW,
        message: "Name required for Assignment"
      }
    ]);
    assert(!coursesService.addAssignment.called);
  });
});
