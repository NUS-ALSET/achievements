import { PathsService } from "../../src/services/paths";

describe("Paths service tests", () => {
  /** @type {PathsService} */
  let pathsService;
  beforeEach(() => (pathsService = new PathsService()));

  it("should validate problem", () =>
    pathsService.validateProblem({
      name: "test",
      type: "jupyter",
      problemURL: "test",
      solutionURL: "test",
      frozen: 2
    }));
});
