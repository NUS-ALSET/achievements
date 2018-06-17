import assert from "assert";
import sinon from "sinon";
import firebasemock from "firebase-mock";
import Promise from "bluebird";
import { PathsService } from "../paths";

const mockDatabase = new firebasemock.MockFirebase();
const mockAuth = new firebasemock.MockFirebase();
const mockSDK = firebasemock.MockFirebaseSdk(
  function(path) {
    return mockDatabase.child(path);
  },
  function() {
    return mockAuth;
  }
);

const WORKAROUND_DELAY = 10;

describe("Paths service tests", () => {
  /** @type {PathsService} */
  let pathsService;
  beforeEach(() => {
    pathsService = new PathsService({
      firebase: mockSDK
    });
    sinon
      .stub(pathsService, "fetchFile")
      .callsFake(() => Promise.resolve({ foo: "bar" }));
  });

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

    pathsService.togglePathJoinStatus();
  });

  it("should return PathProblem", done => {
    mockDatabase
      .child("/paths/-testPathId")
      .set({ owner: "testOwner", name: "Test Path" });
    const fetcher = pathsService.fetchPathProblem(
      "-testPathId",
      "testProblemId"
    );

    Promise.resolve()
      .then(() => {
        mockDatabase.child("/problems/testOwner/testProblemId").set({
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
        });
        mockDatabase.flush();
      })
      .delay(WORKAROUND_DELAY)
      .then(() => {
        mockDatabase
          .child("/problems/testOwner/testProblemId")
          .set({ owner: "testOwner", name: "Test Path" });
        mockDatabase.flush();
      });

    fetcher
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
      )
      .then(done)
      .catch(done);
  });
});
