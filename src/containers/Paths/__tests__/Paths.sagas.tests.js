/* eslint-disable space-before-function-paren */
import { runSaga } from "redux-saga";
import sinon from "sinon";

import { pathActivityChangeRequestHandler } from "../sagas";
import { pathsService } from "../../../services/paths";

describe("Paths sagas", () => {
  let dispatched;
  beforeEach(() => {
    dispatched = [];
    sinon.stub(pathsService, "validateProblem");
    sinon.stub(pathsService, "problemChange");
  });

  afterEach(() => {
    pathsService.validateProblem.restore();
    pathsService.problemChange.restore();
  });

  it("should create new problem", async () => {
    pathsService.problemChange.returns("testKey");

    await runSaga(
      {
        dispatch: action => dispatched.push(action),
        getState: () => ({
          firebase: { auth: { uid: "deadbeef" } }
        })
      },
      pathActivityChangeRequestHandler,
      {
        type: "PATH_ACTIVITY_CHANGE_REQUEST",
        pathId: "testPath",
        activityInfo: {
          type: "codeCombat",
          level: "test-level",
          name: "test"
        }
      }
    ).done;

    expect(dispatched).toEqual([
      { type: "PATH_DIALOG_HIDE" },
      {
        pathId: "testPath",
        activityInfo: { level: "test-level", name: "test", type: "codeCombat" },
        problemKey: "testKey",
        type: "PATH_ACTIVITY_CHANGE_SUCCESS"
      },
      { type: "PATH_CLOSE_DIALOG" }
    ]);
  });

  it("should report a issue at problem creation", async () => {
    pathsService.validateProblem.throws(new Error("Test Error"));

    await runSaga(
      {
        dispatch: action => dispatched.push(action),
        getState: () => ({
          firebase: { auth: { uid: "deadbeef" } }
        })
      },
      pathActivityChangeRequestHandler,
      {
        type: "PATH_ACTIVITY_CHANGE_REQUEST",
        pathId: "testPath",
        activityInfo: {
          type: "codeCombat",
          level: "test-level",
          name: "test"
        }
      }
    ).done;

    expect(dispatched).toEqual([
      {
        pathId: "testPath",
        activityInfo: { level: "test-level", name: "test", type: "codeCombat" },
        reason: "Test Error",
        type: "PATH_ACTIVITY_CHANGE_FAIL"
      },
      { message: "Test Error", type: "NOTIFICATION_SHOW" }
    ]);
  });
});
