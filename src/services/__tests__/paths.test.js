import firebase from "firebase";
import assert from "assert";
import sinon from "sinon";
import Promise from "bluebird";
import { PathsService } from "../paths";

describe("Paths service tests", () => {
  /** @type {PathsService} */
  let pathsService;
  beforeEach(() => {
    pathsService = new PathsService();
    sinon
      .stub(pathsService, "fetchFile")
      .callsFake(() => Promise.resolve({ foo: "bar" }));
  });

  afterEach(() => firebase.restore());

  it("should fetch file id", () => {
    assert.equal(
      pathsService.getFileId(
        "https://drive.google.com/file/d/" +
          "1kW5Zfe79S8mowBZOa2rDAxRxOsDP2wjF/view"
      ),
      "1kW5Zfe79S8mowBZOa2rDAxRxOsDP2wjF"
    );
  });

  it("should validate problem", () =>
    pathsService.validateProblem({
      name: "test",
      type: "jupyter",
      problemURL: "test",
      solutionURL: "test",
      frozen: 2
    }));

  it("should join path", () => {
    sinon.stub(pathsService, "fetchPathProgress");

    firebase.refStub.withArgs("/paths/testPath").returns({
      once: () => firebase.snap("test value")
    });
    firebase.refStub.withArgs("/studentJoinedPaths/deadbeef/testPath").returns({
      set: value => {
        expect(value).toBe(true);
      }
    });
    return pathsService
      .togglePathJoinStatus("deadbeef", "testPath", true)
      .then(result => expect(result).toBe("test value"));
  });

  it("should leave path", done => {
    firebase.refStub.withArgs("/studentJoinedPaths/deadbeef/testPath").returns({
      remove: () => done()
    });
    pathsService.togglePathJoinStatus("deadbeef", "testPath", false);
  });

  it("should return PathProblem", () => {
    firebase.refStub.withArgs("/paths/-testPathId").returns({
      once: () => firebase.snap({ owner: "testOwner", name: "Test Path" })
    });
    firebase.refStub.withArgs("/problems/testOwner/testProblemId").returns({
      once: () =>
        firebase.snap({
          frozen: "2",
          name: "Test Jupyter Notebook",
          owner: "testOwner",
          problemURL:
            "https://drive.google.com/file/d/" +
            "1kW5Zfe79S8mowBZOa2rDAxRxOsDP2wjF/view",
          solutionURL:
            "https://drive.google.com/file/d/" +
            "1xVSKXrVqY2lgNkCfSA7KPWU9B9vaj0_i/view",
          type: "jupyter"
        })
    });
    return pathsService
      .fetchPathProblem("-testPathId", "testProblemId")
      .then(pathProblem =>
        assert.deepEqual(pathProblem, {
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
          solutionFileId: "1xVSKXrVqY2lgNkCfSA7KPWU9B9vaj0_i",
          solutionColabURL:
            "https://colab.research.google.com/" +
            "notebook#fileId=1xVSKXrVqY2lgNkCfSA7KPWU9B9vaj0_i",
          solutionJSON: {
            foo: "bar"
          },
          solutionURL:
            "https://drive.google.com/file/d/" +
            "1xVSKXrVqY2lgNkCfSA7KPWU9B9vaj0_i/view",
          type: "jupyter"
        })
      );
  });
});
