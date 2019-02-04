/* eslint-disable space-before-function-paren */
import sinon from "sinon";
import * as adminSagas from "../sagas";
import { coursesService } from "../../../services/courses";
import { runSaga } from "redux-saga";
import {
  adminUpdateConfigRequest
} from "../actions";

describe("assignemnts sagas tests", () => {
  beforeEach(() =>
    sinon.stub(coursesService, "addAssignment").callsFake(() => {})
  );

  afterEach(() => coursesService.addAssignment.restore());

  it("should process admin config", async () => {
    const dispatched = [];

    await runSaga(
      {
        dispatch: action => dispatched.push(action),
        getState: () => ({ firebase: { data: { admin: {} } } })
      },
      adminSagas.adminUpdateConfigRequestHandler,
      adminUpdateConfigRequest("config")
    ).done;
  });

  it("should fail admin config", async () => {
    const dispatched = [];

    await runSaga(
      {
        dispatch: action => dispatched.push(action),
        getState: () => ({ firebase: { data: { admin: {} } } })
      },
      adminSagas.adminUpdateConfigRequestHandler,
      adminUpdateConfigRequest()
    ).done;
  });
});
