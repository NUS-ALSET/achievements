const admin = require("firebase-admin");
const functions = require("firebase-functions");
const assert = require("assert");
const sinon = require("sinon");
const axios = require("axios");
const test = require("firebase-functions-test")();

const updateProfile = require("../updateProfile").handler;

describe("Update Profile tests", () => {
  let oldDatabase;
  beforeEach(() => {
    oldDatabase = admin.database;
  });
  afterEach(() => {
    admin.database = oldDatabase;
    test.cleanup();
  });

  it("should update userAchievements", done => {
    const axiosStub = sinon.stub(axios, "get");

    // These stubs required for `admin.database().ref(...
    const databaseStub = sinon.stub();
    const refStub = sinon.stub();

    // Replace admin.database() method
    Object.defineProperty(admin, "database", {
      configurable: true,
      get: () => databaseStub
    });

    databaseStub.returns({
      ref: refStub
    });
    refStub.withArgs("/userAchievements/abcd/CodeCombat/achievements").returns({
      once: () => Promise.resolve(new functions.database.DataSnapshot({})),
      update: data => {
        assert.deepEqual(data, {
          testID: {
            name: "testName",
            created: "now",
            playtime: 0,
            complete: true
          }
        });
        return Promise.resolve();
      }
    });
    refStub.withArgs("/logged_events").returns({
      push: () => ({ key: "deadbeef" }),
      update: data => {
        assert.deepEqual(data, {
          deadbeef: {
            createdAt: {
              ".sv": "timestamp"
            },
            isAnonymous: true,
            otherActionData: {
              complete: true,
              created: "now",
              levelId: "testID",
              playtime: 0,
              uid: "abcd"
            },
            type: "UPDATE_ACHIEVEMENTS_DATA"
          }
        });
        return Promise.resolve();
      }
    });
    refStub.withArgs("/userAchievements/abcd/CodeCombat").returns({
      update: data => {
        assert.equal(data.totalAchievements, 1);
        return Promise.resolve();
      }
    });

    axiosStub.returns(
      Promise.resolve({
        data: [
          {
            created: "now",
            levelID: "testID",
            levelName: "testName",
            state: {
              playtime: 100,
              complete: true
            }
          }
        ]
      })
    );

    updateProfile(
      {
        uid: "abcd",
        service: "CodeCombat",
        serviceId: "test"
      },
      () => {}
    )
      .catch(err => err)
      .then(err => {
        axiosStub.restore();
        if (err instanceof Error) {
          return done(err);
        }
        done();
      });
  });
});
