/* eslint-disable no-magic-numbers */
import firebase from "firebase/app";
import { _CRUDdemoService } from "../CRUDdemo";

describe("CRUD demo service tests", () => {
  /** @type {CRUDdemoService} */
  beforeEach(() => {
    firebase.restore();
  });

  afterEach(() => firebase.restore());

  it("should delete", async () => {
    firebase.authStub.returns({
      currentUser: {
        uid: "abc"
      }
    });

    const remove = jest.fn();

    firebase.refStub.withArgs("/analytics/CRUDdemo/abc/").returns({
      remove
    });
    await _CRUDdemoService.DeleteCRUDdemoData();

    expect(remove).toHaveBeenCalled();
  });

  it("should create", async () => {
    firebase.authStub.returns({
      currentUser: {
        uid: "abc"
      }
    });

    const set = jest.fn();

    firebase.refStub.withArgs("/analytics/CRUDdemo/abc/").returns({
      set
    });

    await _CRUDdemoService.WriteToCRUDdemo("xyz");

    expect(set).toHaveBeenCalledWith("xyz");
  });

  it("should throw error", async () => {
    firebase.authStub.returns(undefined);

    expect(() => _CRUDdemoService.WriteToCRUDdemo("xyz")).toThrow(
      "Not logged in"
    );
  });

  it("should read", async () => {
    firebase.refStub.withArgs("/analytics/activityAttempts/").returns({
      orderByChild: type => ({
        equalTo: uid => ({
          once: value =>
            Promise.resolve({
              val: () => "Test value"
            })
        })
      })
    });

    expect(await _CRUDdemoService.fetchActivityAttempts("xyz")).toEqual(
      "Test value"
    );
  });
});
