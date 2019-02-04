/* eslint-disable space-before-function-paren */
import { runSaga } from "redux-saga";
import {
  PATH_ACTIVITY_CHANGE_REQUEST,
  PATH_ACTIVITY_CHANGE_SUCCESS,
  PATH_ACTIVITY_CHANGE_FAIL
} from "./actions";
import { pathActivityChangeRequestHandler } from "./sagas";
import { pathsService } from "../../services/paths";
import { NOTIFICATION_SHOW } from "../Root/actions";
import { CLOSE_ACTIVITY_DIALOG } from "../Path/actions";

describe("Paths sagas", () => {
  it("pathActivityChangeRequestHandler should handle PATH_ACTIVITY_CHANGE_REQUEST", async () => {
    const mockActivityInfo = {
      description: "YouTube Video Activity",
      isCorrectInput: true,
      name: "Watch this Youtube to learn Redux-saga",
      orderIndex: 1,
      owner: "Kunkka",
      type: "text",
      id: "problemID076"
    };
    const mockUid = "someUID001";
    const mockPathId = "somePathId009";
    const dispatchedActions = [];
    const fakeStore = {
      dispatch: action => dispatchedActions.push(action),
      getState: () => ({
        firebase: {
          auth: {
            uid: mockUid,
            displayName: "Tay Xin"
          }
        }
      })
    };
    // validateProblem only throw Error
    pathsService.validateProblem = jest.fn(() => Promise.resolve());
    pathsService.problemChange = jest.fn(() =>
      Promise.resolve("activityKey002")
    );
    await runSaga(fakeStore, pathActivityChangeRequestHandler, {
      type: PATH_ACTIVITY_CHANGE_REQUEST,
      pathId: mockPathId,
      activityInfo: mockActivityInfo
    }).done;

    expect(dispatchedActions).toEqual([
      {
        type: PATH_ACTIVITY_CHANGE_SUCCESS,
        pathId: mockPathId,
        activityInfo: mockActivityInfo,
        problemKey: "activityKey002"
      },
      {
        type: NOTIFICATION_SHOW,
        message: "Problem Saved"
      },
      { type: CLOSE_ACTIVITY_DIALOG }
    ]);
  });

  it("should report a issue at problem creation", async () => {
    pathsService.validateProblem = jest.fn(() =>
      Promise.reject({ message: "Missing activity name" })
    );
    const dispatchedActions = [];
    await runSaga(
      {
        dispatch: action => dispatchedActions.push(action),
        getState: () => ({
          firebase: {
            auth: {
              uid: "someUID008",
              displayName: "Tay Xin"
            }
          }
        })
      },
      pathActivityChangeRequestHandler,
      {
        type: PATH_ACTIVITY_CHANGE_REQUEST,
        pathId: "testPath",
        activityInfo: {
          type: "codeCombat",
          level: "test-level"
        }
      }
    ).done;

    expect(dispatchedActions).toEqual([
      {
        type: PATH_ACTIVITY_CHANGE_FAIL,
        pathId: "testPath",
        activityInfo: { level: "test-level", type: "codeCombat" },
        reason: "Missing activity name"
      },
      {
        type: NOTIFICATION_SHOW,
        message: "Missing activity name"
      }
    ]);
  });
});
