/* eslint-disable space-before-function-paren */
import { runSaga } from "redux-saga";

import { pathProblemOpenHandler } from "../sagas";
import { PATH_TOGGLE_JOIN_STATUS_REQUEST } from "../actions";

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
      pathProblemOpenHandler,
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
});
