const admin = require("firebase-admin");
const functions = require("firebase-functions");
const assert = require("assert");
const sinon = require("sinon");
const axios = require("axios");
const test = require("firebase-functions-test")();

const updateProfile = require("../updateProfile").updateProfile;

describe("Update Profile tests", () => {
  let oldDatabase;
  beforeEach(() => {
    oldDatabase = admin.database;
  });
  afterEach(() => {
    admin.database = oldDatabase;
    test.cleanup();
  });

  it("should do something", done => {
    const databaseStub = sinon.stub();
    const axiosStub = sinon.stub(axios, "get");
    const refStub = sinon.stub();

    Object.defineProperty(admin, "database", { get: () => databaseStub });

    databaseStub.returns({
      ref: refStub
    });
    refStub.withArgs("/userAchievements/abcd/CodeCombat/achievements").returns({
      once: () => Promise.resolve(new functions.database.DataSnapshot({})),
      update: data => {
        assert.deepEqual(data, {});
        return Promise.resolve();
      }
    });
    refStub.withArgs("/logged_events").returns({
      push: () => ({ key: "deadbeef" }),
      update: data => {
        assert.deepEqual(data, {});
        return Promise.resolve();
      }
    });
    refStub.withArgs("/userAchievements/abcd/CodeCombat").returns({
      update: data => {
        assert.equal(data.totalAchievements, 0);
        return Promise.resolve();
      }
    });

    axiosStub.returns(Promise.resolve({ data: [] }));

    updateProfile(
      {
        uid: "abcd",
        service: "CodeCombat",
        serviceId: "test"
      },
      () => done()
    )
      .catch(done)
      .then(() => {
        axiosStub.restore();
      });
  });
});
