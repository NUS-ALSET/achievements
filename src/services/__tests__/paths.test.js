/* eslint-disable no-magic-numbers */
import firebase from "firebase/app";
import assert from "assert";
import sinon from "sinon";
import Promise from "bluebird";
import { PathsService, ACTIVITY_TYPES } from "../paths";

import correctProblems from "./data/correctProblems";
import incorrectProblems from "./data/incorrectProblems";

describe("Paths service tests", () => {
  /** @type {PathsService} */
  let pathsService;
  beforeEach(() => {
    firebase.restore();
    pathsService = new PathsService();
    sinon
      .stub(pathsService, "fetchFile")
      .callsFake(() => Promise.resolve({ foo: "bar" }));
  });

  afterEach(() => firebase.restore());

  it("should fetch file id", () => {
    expect(
      pathsService.getFileId("https://drive.google.com/file/d/THE_FILE_ID/view")
    ).toBe("THE_FILE_ID");
    expect(
      pathsService.getFileId(
        "https://colab.research.google.com/drive/THE_FILE_ID"
      )
    ).toBe("THE_FILE_ID");
    expect(pathsService.getFileId("THE_FILE_ID")).toBe("THE_FILE_ID");
  });

  it("should validate problem", () => {
    return Promise.all(
      correctProblems.map(problem =>
        Promise.resolve(pathsService.validateProblem(problem))
      )
    ).then(() =>
      Promise.all(
        incorrectProblems.map(item =>
          expect(() => pathsService.validateProblem(item.problem)).toThrow(
            item.error
          )
        )
      )
    );
  });

  it("should create new path", () => {
    let spy = jest.fn();
    firebase.refStub.withArgs("/paths").returns({
      push: () => ({ key: "deadbeef" })
    });
    firebase.refStub.withArgs("/paths/deadbeef").returns({
      set: data =>
        Promise.resolve()
          .then(() => spy())
          .then(() =>
            expect(data).toEqual({
              id: "deadbeef",
              name: "test",
              owner: "testOwner",
              totalActivities: 0
            })
          )
    });

    return pathsService
      .pathChange("testOwner", {
        name: "test"
      })
      .then(result => expect(result).toBe("deadbeef"))
      .then(() => expect(spy.mock.calls.length).toBe(1));
  });

  it("should update existing path", () => {
    let spy = jest.fn();
    firebase.refStub.withArgs("/paths/deadbeef").returns({
      update: data =>
        Promise.resolve()
          .then(() => spy())
          .then(() =>
            expect(data).toEqual({
              id: "deadbeef",
              name: "test",
              owner: "testOwner"
            })
          )
    });

    return pathsService
      .pathChange("testOwner", {
        id: "deadbeef",
        name: "test"
      })
      .then(result => expect(result).toBe("deadbeef"))
      .then(() => expect(spy.mock.calls.length).toBe(1));
  });

  it("should join path", () => {
    firebase.refStub
      .withArgs("/completedActivities/deadbeef/testPath")
      .returns({
        once: () => firebase.snap({})
      });
    firebase.refStub.withArgs("/paths/testPath").returns({
      once: () =>
        firebase.snap({
          owner: "cafebabe",
          totalActivities: 0
        })
    });
    firebase.refStub.withArgs("/paths/testPath/totalActivities").returns({
      once: () => firebase.snap(0)
    });
    firebase.refStub.withArgs("/studentJoinedPaths/deadbeef/testPath").returns({
      set: value => {
        expect(value).toBe(true);
      }
    });
    return pathsService
      .togglePathJoinStatus("deadbeef", "testPath", true)
      .then(result =>
        expect(result).toEqual({
          id: "testPath",
          owner: "cafebabe",
          solutions: 0,
          totalActivities: 0
        })
      );
  });

  it("should leave path", done => {
    firebase.refStub.withArgs("/studentJoinedPaths/deadbeef/testPath").returns({
      remove: () => done()
    });
    pathsService.togglePathJoinStatus("deadbeef", "testPath", false);
  });

  it("should return PathActivity", () => {
    firebase.refStub.withArgs("/paths/-testPathId").returns({
      once: () => firebase.snap({ owner: "testOwner", name: "Test Path" })
    });
    firebase.refStub.withArgs("/activities/testProblemId").returns({
      once: () =>
        firebase.snap({
          frozen: "2",
          name: "Test Jupyter Notebook",
          owner: "testOwner",
          problemURL:
            "https://drive.google.com/file/d/" +
            "1kW5Zfe79S8mowBZOa2rDAxRxOsDP2wjF/view",
          type: "jupyter"
        })
    });
    return pathsService
      .fetchPathProblem("-testPathId", "testProblemId")
      .then(pathProblem =>
        assert.deepStrictEqual(pathProblem, {
          pathId: "-testPathId",
          pathName: "Test Path",
          problemId: "testProblemId",
          problemName: "Test Jupyter Notebook",
          owner: "testOwner",
          frozen: "2",
          name: "Test Jupyter Notebook",
          problemFileId: "1kW5Zfe79S8mowBZOa2rDAxRxOsDP2wjF",
          problemColabURL:
            "https://colab.research.google.com/" +
            "notebook#fileId=1kW5Zfe79S8mowBZOa2rDAxRxOsDP2wjF",
          problemJSON: {
            foo: "bar"
          },
          problemURL:
            "https://drive.google.com/file/d/" +
            "1kW5Zfe79S8mowBZOa2rDAxRxOsDP2wjF/view",
          type: "jupyter"
        })
      );
  });

  describe("submit solutions variants", () => {
    let spy;

    beforeEach(() => (spy = jest.fn()));

    it("should submit text solution", () => {
      firebase.refStub
        .withArgs("/completedActivities/deadbeef/testPath/testProblem")
        .returns({
          set: data => {
            spy();
            expect(data).toEqual({
              ".sv": "timestamp"
            });
          }
        });
      firebase.refStub
        .withArgs("/problemSolutions/testProblem/deadbeef")
        .returns({
          set: data => {
            spy();
            expect(data).toBe("test solution");
          }
        });

      return pathsService
        .submitSolution(
          "deadbeef",
          {
            owner: "deadbeef",
            pathId: "testPath",
            path: "testPath",
            pathName: "Test Path",
            problemId: "testProblem",
            problemName: "Test Problem",
            type: ACTIVITY_TYPES.text.id
          },
          "test solution"
        )
        .then(() => {
          expect(spy.mock.calls.length).toBe(2);
        });
    });
  });

  describe("moving activity", () => {
    beforeEach(() => sinon.stub(pathsService, "checkActivitiesOrder"));
    afterEach(() => pathsService.checkActivitiesOrder.restore());

    it("should move activity", () => {
      let calls = 0;
      const activities = [
        {
          id: "cafebabe",
          orderIndex: 1
        },
        {
          id: "deadbeef",
          orderIndex: 2
        }
      ];
      firebase.refStub.returns({
        set: () => {
          calls += 1;
          return Promise.resolve();
        }
      });

      pathsService.checkActivitiesOrder.returns(Promise.resolve(activities));
      return pathsService
        .moveActivity("testUser", "testPath", activities, "deadbeef", "up")
        .then(() => {
          expect(pathsService.checkActivitiesOrder.calledOnce).toBe(true);
          expect(calls).toBe(2);
        });
    });
  });
});
