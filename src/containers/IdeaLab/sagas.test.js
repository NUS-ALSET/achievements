import { runSaga } from "redux-saga";
import {
  createToCRUDdemo,
  CREATE_TO_CRUD_DEMO,
  createValueSuccess,
  deleteCRUDdemoData,
  deleteValueSuccess
} from "./actions";
import {
  handleCreateRequest,
  handleDeleteRequest
 } from "./sagas";
 import { _CRUDdemoService } from "../../services/CRUDdemo"
import { NOTIFICATION_SHOW } from "../Root/actions";
import { APP_SETTING } from "../../achievementsApp/config";

describe("CRUDdemo sagas", () => {
  // Reduce timeouts for tests passing
  let defaultTimeout = APP_SETTING.defaultTimeout;

  beforeEach(() => {
    APP_SETTING.defaultTimeout = 0;
  });

  afterEach(() => {
    APP_SETTING.defaultTimeout = defaultTimeout;
  });

  it("handleCreateRequest should handle CREATE_TO_CRUD_DEMO action", async () => {
    const dispatchedActions = []
    const fakeStore = {
      dispatch: action => dispatchedActions.push(action),
      getState: () => ({
        firebase: {
          auth: {
            uid: "someUID12345"
          }
        }
      })
    }

    _CRUDdemoService.WriteToCRUDdemo = jest.fn(() => Promise.resolve())
    await runSaga(
      fakeStore,
      handleCreateRequest,
      {
        type: CREATE_TO_CRUD_DEMO,
        solution: "input solution text"
      }
    ).done;

    expect(dispatchedActions).toEqual([
      {
        type: NOTIFICATION_SHOW,
        message: "Received the command to Create @ CRUDdemo node"
      },
      {
        type: NOTIFICATION_SHOW,
        message: "will now write [input solution text] to analyticsCRUDdemo node"
      },
      {
        type: "CRUDdemo/CREATE_VALUE_SUCCESS"
      },
      {
        type: NOTIFICATION_SHOW,
        message: "Created successfully!!"
      }
    ]);
  });
});
