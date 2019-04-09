/* eslint-disable space-before-function-paren */
import sinon from "sinon";
import * as cohortsSagas from "../sagas";
import { coursesService } from "../../../services/courses";
import { runSaga } from "redux-saga";
import {
  addCohortRequest
} from "../actions";

describe("assignemnts sagas tests", () => {
  beforeEach(() =>
    sinon.stub(coursesService, "addAssignment").callsFake(() => {})
  );

  afterEach(() => coursesService.addAssignment.restore());

  it("should process cohorts creation", async () => {
    const dispatched = [];

    await runSaga(
      {
        dispatch: action => dispatched.push(action),
        getState: () => ({ firebase: { data: { cohorts: {} } } })
      },
      cohortsSagas.addCohortRequestHandler,
      addCohortRequest({
        name: 'this.state.cohortName',
        description: 'this.state.cohortDescription',
        threshold: 1,
        paths: 'this.getPaths()',
      })
    ).done;
  });

  it("should fail cohorts creation", async () => {
    const dispatched = [];

    await runSaga(
      {
        dispatch: action => dispatched.push(action),
        getState: () => ({ firebase: { data: { assignments: {} } } })
      },
      cohortsSagas.addCohortRequestHandler,
      addCohortRequest({})
    ).done;
    
  });
});
