/* eslint-disable space-before-function-paren */
import { runSaga } from "redux-saga";
import sinon from "sinon";

import {
  pathActivityOpenHandler,
  pathToggleJoinStatusRequestHandler
} from "../sagas";
import {
  PATH_TOGGLE_JOIN_STATUS_FAIL,
  PATH_TOGGLE_JOIN_STATUS_REQUEST,
  PATH_TOGGLE_JOIN_STATUS_SUCCESS
} from "../actions";
import { pathsService } from "../../../services/paths";

describe("Path sagas", () => {
  it("should join path on open problem", async () => {
    const dispatched = [];

    await runSaga(
      {
        dispatch: action => dispatched.push(action),
        getState: () => ({
          firebase: {
            auth: {
              uid: "deadbeef"
            }
          },
          paths: {
            joinedPaths: {}
          }
        })
      },
      pathActivityOpenHandler,
      {
        pathId: "testPath",
        problemId: "testProblem"
      }
    ).done;

    expect(dispatched).toEqual([
      {
        type: PATH_TOGGLE_JOIN_STATUS_REQUEST,
        userId: "deadbeef",
        pathId: "testPath",
        status: true
      }
    ]);
  });

  it("should process joining path", async () => {
    const dispatched = [];

    sinon.stub(pathsService, "togglePathJoinStatus").returns({
      foo: "bar",
      owner: "testOwner"
    });
    await runSaga(
      {
        getState: () => ({ firebase: { auth: { uid: "deadbeef" } } }),
        dispatch: action => dispatched.push(action)
      },
      pathToggleJoinStatusRequestHandler,
      {
        pathId: "testPath",
        status: true
      }
    ).done;

    expect(
      pathsService.togglePathJoinStatus.calledWith("deadbeef", "testPath", true)
    ).toBe(true);
    pathsService.togglePathJoinStatus.restore();

    expect(dispatched).toEqual([
      {
        type: PATH_TOGGLE_JOIN_STATUS_SUCCESS,
        pathId: "testPath",
        status: {
          foo: "bar",
          owner: "testOwner"
        }
      }
    ]);
  });

  it("should fail joining path", async () => {
    const dispatched = [];

    sinon
      .stub(pathsService, "togglePathJoinStatus")
      .throws(new Error("foobar"));

    await runSaga(
      {
        getState: () => ({ firebase: { auth: { uid: "deadbeef" } } }),
        dispatch: action => dispatched.push(action)
      },
      pathToggleJoinStatusRequestHandler,
      {
        pathId: "testPath",
        status: true
      }
    ).done;

    pathsService.togglePathJoinStatus.restore();

    expect(dispatched).toEqual([
      {
        type: PATH_TOGGLE_JOIN_STATUS_FAIL,
        pathId: "testPath",
        status: true,
        reason: "foobar"
      }
    ]);
  });
});
