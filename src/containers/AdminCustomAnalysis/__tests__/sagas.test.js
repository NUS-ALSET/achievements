import { runSaga } from "redux-saga";
import firebase from "firebase/app";
import { adminCustomAnalysisOpen, adminStatusLoaded } from "../actions";
import { adminCustomAnalysisOpenHandler } from "../sagas";

describe("Admin Custom Analysis sagas", () => {
  let dispatched = [];
  const mockStore = {
    dispatch: action => dispatched.push(action),
    getState: () => ({
      firebase: { auth: { uid: "-admintestUser" } }
    })
  };
  beforeEach(() => {
    dispatched = [];

    firebase.restore();
  });

  afterEach(() => {
    firebase.restore();
  });

  describe("open Admin custom Analysis", () => {
    it("should check admin status", async () => {
      firebase.refStub.withArgs("/admins/-admintestUser").returns({
        once: () =>
          Promise.resolve({
            val() {
              return true;
            }
          })
      });
      await runSaga(
        mockStore,
        adminCustomAnalysisOpenHandler,
        adminCustomAnalysisOpen()
      ).done;

      expect(dispatched).toEqual([adminStatusLoaded(true)]);
    });
  });
});
