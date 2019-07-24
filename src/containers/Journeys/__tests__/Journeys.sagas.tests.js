import { runSaga } from "redux-saga";
import firebase from "firebase/app";
import {
  // journeyUpsertRequest,
  // journeyUpsertSuccess,
  // journeyUpsertFail,
  journeyAddActivitiesRequest,
  journeyAddActivitiesSuccess,
  journeyDeleteActivityRequest,
  journeyDeleteActivitySuccess,
  journeyMoveActivityRequest,
  journeyMoveActivitySuccess,
  journeysOpen,
  journeysPathsLoaded,
  journeyPathActivitiesFetchRequest,
  journeyPathActivitiesFetchSuccess,
  journeyDialogClose,
  journeyActivitiesFetchRequest,
  journeyActivitiesFetchSuccess
} from "../actions";
import {
  // journeyUpsertRequestHandler,
  journeyAddActivitiesRequestHandler,
  journeyDeleteActivityRequestHandler,
  journeyMoveActivityRequestHandler,
  journeysOpenHandler,
  journeyPathActivitiesFetchRequestHandler,
  journeyActivitiesFetchRequestHandler
} from "../sagas";
// import { notificationShow } from "../../Root/actions";

describe("Journeys sagas", () => {
  let dispatched = [];
  const mockStore = {
    dispatch: action => dispatched.push(action),
    getState: () => ({
      firebase: { auth: { uid: "cafebabe" } }
    })
  };
  beforeEach(() => {
    dispatched = [];
    firebase.restore();
    firebase.refStub.withArgs("/journeys").returns({
      push: () => ({ key: "deadbeef" })
    });
  });

  afterEach(() => {
    firebase.restore();
  });

  describe("open journeys", () => {
    it("should request paths", async() => {
      firebase.refStub.withArgs("/paths").returns({
        orderByChild: type => ({
          equalTo: () => ({
            once: async() => ({
              val: () => (type === "owner" ? "foo" : "bar")
            })
          })
        })
      });
      await runSaga(mockStore, journeysOpenHandler, journeysOpen()).done;

      expect(dispatched).toEqual([
        journeysPathsLoaded({ myPaths: "foo", publicPaths: "bar" })
      ]);
    });
  });

  /*
  describe("create journey", () => {
    it("should create new journey", async() => {
      const journeyData = {
        uid: "cafebabe",
        description: "test-description",
        name: "test-name"
      };
      firebase.refStub
        .withArgs("/journeys/deadbeef")
        .returns({ set: () => ({}) });
      await runSaga(
        mockStore,
        journeyUpsertRequestHandler,
        journeyUpsertRequest(journeyData)
      ).done;
      expect(dispatched).toEqual([
        notificationShow("New journey created"),
        journeyUpsertSuccess(journeyData)
      ]);
    });

    it("should fail on create w/o name", async() => {
      const journeyData = { name: "" };
      await runSaga(
        mockStore,
        journeyUpsertRequestHandler,
        journeyUpsertRequest(journeyData)
      ).done;
      expect(dispatched).toEqual([
        notificationShow("Missing journey name"),
        journeyUpsertFail(journeyData, "Missing journey name")
      ]);
    });
  });

  describe("update journey", () => {
    it("should update existing store", async() => {
      const journeyData = { id: "test-id", name: "something" };
      firebase.refStub
        .withArgs("/journeys/test-id")
        // We update instead of set
        .returns({ update: request => expect(request).toBe(journeyData) });
      await runSaga(
        mockStore,
        journeyUpsertRequestHandler,
        journeyUpsertRequest(journeyData)
      ).done;
      expect(dispatched).toEqual([
        notificationShow("Journey updated"),
        journeyUpsertSuccess(journeyData)
      ]);
    });

    it("should fail on update w/o name", async() => {
      const journeyData = { id: "test-id", name: "" };
      await runSaga(
        mockStore,
        journeyUpsertRequestHandler,
        journeyUpsertRequest(journeyData)
      ).done;
      expect(dispatched).toEqual([
        notificationShow("Missing journey name"),
        journeyUpsertFail(journeyData, "Missing journey name")
      ]);
    });
  });
  */

  it("should add activities", async() => {
    const update = jest.fn();
    firebase.refStub
      .withArgs("/journeyActivities/deadbeef")

      // We update instead of set
      .returns({
        once: () => ({ val: () => ({ existingId1: 1, existingId2: 2 }) }),
        update
      });
    firebase.refStub.withArgs("/paths/deadf00d").returns({
      once: async() => ({
        val: async() => ({ id: "deadf00d", name: "test path 1" })
      })
    });
    firebase.refStub.withArgs("/paths/cafef00d").returns({
      once: async() => ({
        val: async() => ({ id: "cafef00d", name: "test path 2" })
      })
    });
    firebase.refStub.withArgs("/activities/activityId1").returns({
      once: async() => ({
        val: async() => ({
          id: "activityId1",
          name: "activityId1",
          description: "activity 1",
          path: "deadf00d"
        })
      })
    });
    firebase.refStub.withArgs("/activities/activityId2").returns({
      once: async() => ({
        val: async() => ({
          id: "activityId2",
          name: "activityId2",
          description: "activity 2",
          path: "deadf00d"
        })
      })
    });
    firebase.refStub.withArgs("/activities/activityId3").returns({
      once: async() => ({
        val: async() => ({
          id: "activityId3",
          name: "activityId3",
          description: "activity 3",
          path: "cafef00d"
        })
      })
    });
    await runSaga(
      {
        dispatch: action => dispatched.push(action),
        getState: () => ({
          firebase: { auth: { uid: "cafebabe" } },
          journeys: { journeyActivities: { deadbeef: [{ id: "existingId1" }] } }
        })
      },
      journeyAddActivitiesRequestHandler,
      journeyAddActivitiesRequest("deadbeef", [
        "activityId1",
        "activityId2",
        "existingId1",
        "activityId3"
      ])
    ).done;
    expect(dispatched).toEqual([
      journeyAddActivitiesSuccess("deadbeef", [
        {
          id: "activityId1",
          name: "activityId1",
          pathId: "deadf00d",
          pathName: "test path 1",
          description: "activity 1"
        },
        {
          id: "activityId2",
          name: "activityId2",
          pathId: "deadf00d",
          pathName: "test path 1",
          description: "activity 2"
        },
        {
          id: "activityId3",
          name: "activityId3",
          pathId: "cafef00d",
          pathName: "test path 2",
          description: "activity 3"
        }
      ]),
      journeyDialogClose()
    ]);
    // expect(update).toHaveBeenCalledWith({
    //   activityId1: 3,
    //   activityId2: 4,
    //   activityId3: 5
    // });
  });

  describe("delete activity", () => {
    let remove;
    let update;

    beforeEach(() => {
      remove = jest.fn();
      update = jest.fn();
      firebase.refStub.withArgs("/journeyActivities/deadbeef").returns({
        once: () => ({
          val: () => ({
            existingId1: 1,
            existingTargetId: 2,
            existingId3: 3,
            existingId4: 4,
            existingId5: 5
          })
        }),
        update
      });
      firebase.refStub
        .withArgs("/journeyActivities/deadbeef/existingTargetId")
        .returns({
          remove
        });
    });

    it("should delete activity", async() => {
      await runSaga(
        mockStore,
        journeyDeleteActivityRequestHandler,
        journeyDeleteActivityRequest("deadbeef", "existingTargetId")
      ).done;
      expect(dispatched).toEqual([
        journeyDeleteActivitySuccess("deadbeef", "existingTargetId")
      ]);
      expect(remove).toHaveBeenCalled();
      expect(update).toHaveBeenCalledWith({
        existingId3: 2,
        existingId4: 3,
        existingId5: 4
      });
    });

    it("should delete activity and don't reorder other activities", async() => {
      firebase.refStub
        .withArgs("/journeyActivities/deadbeef/existingId5")
        .returns({
          remove
        });
      await runSaga(
        mockStore,
        journeyDeleteActivityRequestHandler,
        journeyDeleteActivityRequest("deadbeef", "existingId5")
      ).done;
      expect(dispatched).toEqual([
        journeyDeleteActivitySuccess("deadbeef", "existingId5")
      ]);
      expect(remove).toHaveBeenCalled();
      expect(update).not.toHaveBeenCalled();
    });

    it("should delete activity and don't reorder other activities", async() => {
      await runSaga(
        mockStore,
        journeyDeleteActivityRequestHandler,
        journeyDeleteActivityRequest("deadbeef", "nonExistingTargetId")
      ).done;
      expect(dispatched).toEqual([
        journeyDeleteActivitySuccess("deadbeef", "nonExistingTargetId")
      ]);
      expect(remove).not.toHaveBeenCalled();
      expect(update).not.toHaveBeenCalled();
    });
  });

  describe("reoder activity", () => {
    let update;
    beforeEach(() => {
      update = jest.fn();
      firebase.refStub.withArgs("/journeyActivities/deadbeef").returns({
        once: () => ({
          val: () => ({
            existingId1: 1,
            existingTargetId: 2,
            existingId3: 3,
            existingId4: 4,
            existingId5: 5
          })
        }),
        update
      });
    });

    it("should move activity up", async() => {
      await runSaga(
        mockStore,
        journeyMoveActivityRequestHandler,
        journeyMoveActivityRequest("deadbeef", "existingTargetId", "up")
      ).done;
      expect(dispatched).toEqual([
        journeyMoveActivitySuccess("deadbeef", "existingTargetId", "up")
      ]);
      // expect(update).toHaveBeenCalledWith({
      //   existingId1: 2,
      //   existingTargetId: 1
      // });
    });
    it("should move activity up", async() => {
      await runSaga(
        mockStore,
        journeyMoveActivityRequestHandler,
        journeyMoveActivityRequest("deadbeef", "existingTargetId", "down")
      ).done;
      expect(dispatched).toEqual([
        journeyMoveActivitySuccess("deadbeef", "existingTargetId", "down")
      ]);
      // expect(update).toHaveBeenCalledWith({
      //   existingId3: 2,
      //   existingTargetId: 3
      // });
    });
  });

  describe("load activities", () => {
    it("should load activities", async() => {
      firebase.refStub.withArgs("/activities").returns({
        orderByChild: () => ({
          equalTo: () => ({
            once: async() => ({
              val: async() => ({
                activityId1: {
                  foo: "bar"
                },
                activityId2: {
                  foo: "bar"
                }
              })
            })
          })
        })
      });
      await runSaga(
        mockStore,
        journeyPathActivitiesFetchRequestHandler,
        journeyPathActivitiesFetchRequest("test-path")
      ).done;

      expect(dispatched).toEqual([
        journeyPathActivitiesFetchSuccess("test-path", [
          {
            id: "activityId1",
            foo: "bar"
          },
          {
            id: "activityId2",
            foo: "bar"
          }
        ])
      ]);
    });
  });

  describe("fetch journey activities", () => {
    it("should fetch journey activities", async() => {
      firebase.refStub.withArgs("/journeyActivities/test-journey").returns({
        once: async() => ({
          val: async() => ({
            "test-activity": 1
          })
        })
      });
      firebase.refStub.withArgs("/activities/test-activity").returns({
        once: async() => ({
          val: async() => ({
            id: "test-activity",
            name: "Test Activity",
            path: "test-path",
            description: "Activity Description"
          })
        })
      });
      firebase.refStub.withArgs("/paths/test-path").returns({
        once: async() => ({
          val: async() => ({
            id: "test-path",
            name: "Test Path"
          })
        })
      });
      await runSaga(
        mockStore,
        journeyActivitiesFetchRequestHandler,
        journeyActivitiesFetchRequest("test-journey")
      ).done;
      expect(dispatched).toEqual([
        journeyActivitiesFetchSuccess("test-journey", [
          {
            description: "Activity Description",
            id: "test-activity",
            name: "Test Activity",
            pathId: "test-path",
            pathName: "Test Path"
          }
        ])
      ]);
    });
  });
});
