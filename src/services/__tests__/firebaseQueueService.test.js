/* eslint-disable no-magic-numbers */
import firebase from "firebase/app";
import sinon from "sinon";
import { firebaseService } from "../firebaseQueueService";

describe("Firebase Queue service tests", () => {
  /** @type {firebaseService} */
  let testFn = sinon.stub();
  beforeEach(() => {
    firebase.restore();
    let store = { dispatch: testFn };
    firebaseService.setStore(store);
  });

  afterEach(() => firebase.restore());

  it("should set store", () => {
    let newTestFn = sinon.stub();
    firebaseService.setStore({ dispatch: newTestFn });
    expect(firebaseService.store).toEqual({ dispatch: newTestFn });
  });

  it("should start queue process", () => {
    firebase.refStub.withArgs("/testCollection/tasks").returns({
      push: () => ({ key: "testKey" })
    });

    let on = jest.fn();
    firebase.refStub.withArgs("/testCollection/responses/testKey").returns({
      on
    });

    let set = jest.fn();
    firebase.refStub.withArgs("/testCollection/tasks/testKey").returns({
      set
    });

    firebaseService.startProcess({ dummKey: "dummyValue" }, "testCollection");

    expect(set).toHaveBeenCalledWith({
      dummKey: "dummyValue",
      taskKey: "testKey"
    });
  });
});
