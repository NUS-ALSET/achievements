import { runSaga } from "redux-saga";
import {
  ADMIN_UPDATE_CONFIG_REQUEST
} from "./actions";
import { accountService } from "../../services/account";
import { adminUpdateConfigRequestHandler } from "./sagas";


describe("Admin sagas", () => {
  it("adminUpdateConfigRequestHandler should update home screen configs", async () => {
    const dispatchedActions = [];
    accountService.updateAdminConfig = jest.fn(() =>
      Promise.resolve(
        {
          recommendations: {
            youtube: true,
            jupyterInline: true
          }
        }
      )
    )
    const fakeStore = {
        getState: () => {},
        dispatch: action => dispatchedActions.push(action)
    };

    await runSaga(
      fakeStore,
      adminUpdateConfigRequestHandler,
      {
        type: ADMIN_UPDATE_CONFIG_REQUEST,
        config: {
          recommendations: {
            youtube: true,
            jupyterInline: true
          }
        }
      }
    ).done;

    expect(dispatchedActions).toEqual(
      [
        {
          type: "ADMIN_UPDATE_CONFIG_SUCCESS",
          config: {"recommendations": {"jupyterInline": true, "youtube": true}}
        },
        {
          type: "NOTIFICATION_SHOW",
          message: "Config updated"
        }
      ]
    );
  })

  it("adminUpdateConfigRequestHandler should handle config update error in case of failure", async () => {
    const dispatchedActions = [];
    accountService.updateAdminConfig = jest.fn(() =>
      Promise.reject({ message: "firebase down" })
    )
    const fakeStore = {
        getState: () => {},
        dispatch: action => dispatchedActions.push(action)
    };

    await runSaga(
      fakeStore,
      adminUpdateConfigRequestHandler,
      {
        type: ADMIN_UPDATE_CONFIG_REQUEST,
        config: {
          recommendations: {
            youtube: true,
            jupyterInline: true
          }
        }
      }
    ).done;

    expect(dispatchedActions).toEqual(
      [
        {
          type: "ADMIN_UPDATE_CONFIG_FAIL",
          config: {"recommendations": {"jupyterInline": true, "youtube": true}},
          reason: "firebase down"
        },
        {
          type: "NOTIFICATION_SHOW",
          message: "firebase down"
        }
      ]
    );
  })
});