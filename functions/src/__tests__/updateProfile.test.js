const admin = require("firebase-admin");
const sinon = require("sinon");
const axios = require("axios");

const updateProfile = require("../updateProfile").handler;

describe("Update Profile tests", () => {
  let axiosStub;
  beforeEach(() => {
    // Mock outgoing http requests
    axiosStub = sinon.stub(axios, "get");
    admin.restore();
  });
  afterEach(() => {
    axiosStub.restore();
    admin.restore();
  });

  it("should update userAchievements", () => {
    // Set mock responses for `admin.database().ref(..)
    admin.refStub
      .withArgs("/userAchievements/abcd/CodeCombat/achievements")
      .returns({
        // Mock data for `once("value")` response
        once: () => admin.snap({}),
        // Assert update data
        update: data => {
          expect(data).toEqual({
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

    // Mock responses for `...ref("/logged_events")
    admin.refStub.withArgs("/logged_events").returns({
      // Reponse for `ref("/logged_events").push().key`
      push: () => ({ key: "deadbeef" }),

      // Assert update data
      update: data => {
        expect(data).toEqual({
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
    admin.refStub.withArgs("/userAchievements/abcd/CodeCombat").returns({
      update: data => {
        expect(data.totalAchievements).toBe(1);
        return Promise.resolve();
      }
    });

    // HTTP mock response
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

    // Invoke test
    return updateProfile(
      {
        uid: "abcd",
        service: "CodeCombat",
        serviceId: "test"
      },
      () => {}
    );
  });
});
