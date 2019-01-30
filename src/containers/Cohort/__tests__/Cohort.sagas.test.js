/* eslint-disable space-before-function-paren */
import { runSaga } from "redux-saga";
import * as cohortSagas from "../sagas";
import {
  cohortOpen,
  cohortCoursesRecalculateRequest,
  cohortCourseUpdateRequest,
  cohortUpdateAssistantsRequest
} from "../actions";

describe("cohort sagas tests", () => {

  it("should process cohort opening", async () => {
    const dispatched = [];

    await runSaga(
      {
        dispatch: action => dispatched.push(action),
        getState: () => ({ firebase: { data: { cohort: {} } } })
      },
      cohortSagas.cohortOpenHandle,
      cohortOpen("cohortId")
    ).done;
  });

  it("should fail cohort opening", async () => {
    const dispatched = [];

    await runSaga(
      {
        dispatch: action => dispatched.push(action),
        getState: () => ({ firebase: { data: { cohort: {} } } })
      },
      cohortSagas.cohortOpenHandle,
      cohortOpen()
    ).done;
  });

  it("should process cohort courses recalculation", async () => {
    const dispatched = [];

    await runSaga(
      {
        dispatch: action => dispatched.push(action),
        getState: () => ({ firebase: { data: { cohort: {} } } })
      },
      cohortSagas.cohortRecalculationRequestHandler,
      cohortCoursesRecalculateRequest("cohortId")
    ).done;
  });

  it("should fail cohort courses recalculation", async () => {
    const dispatched = [];

    await runSaga(
      {
        dispatch: action => dispatched.push(action),
        getState: () => ({ firebase: { data: { cohort: {} } } })
      },
      cohortSagas.cohortRecalculationRequestHandler,
      cohortCoursesRecalculateRequest()
    ).done;
  });

  it("should process cohort courses update request", async () => {
    const dispatched = [];

    await runSaga(
      {
        dispatch: action => dispatched.push(action),
        getState: () => ({ firebase: { data: { cohort: {} } } })
      },
      cohortSagas.cohortCourseUpdateRequestHandler,
      cohortCourseUpdateRequest("cohortId", "courseId", "add")
    ).done;
  });

  it("should fail cohort courses updation", async () => {
    const dispatched = [];

    await runSaga(
      {
        dispatch: action => dispatched.push(action),
        getState: () => ({ firebase: { data: { cohort: {} } } })
      },
      cohortSagas.cohortCourseUpdateRequestHandler,
      cohortCourseUpdateRequest()
    ).done;
  });

  it("should process cohort assistant update request", async () => {
    const dispatched = [];

    await runSaga(
      {
        dispatch: action => dispatched.push(action),
        getState: () => ({ firebase: { data: { cohort: {} } } })
      },
      cohortSagas.cohortCourseUpdateRequestHandler,
      cohortUpdateAssistantsRequest("cohortId", "assistantId", "add")
    ).done;
  });

  it("should fail cohort assistant updation", async () => {
    const dispatched = [];

    await runSaga(
      {
        dispatch: action => dispatched.push(action),
        getState: () => ({ firebase: { data: { cohort: {} } } })
      },
      cohortSagas.cohortCourseUpdateRequestHandler,
      cohortUpdateAssistantsRequest()
    ).done;
  });
});
