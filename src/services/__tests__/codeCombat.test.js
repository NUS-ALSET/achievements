import { CodeCombatService } from "../codeCombat";

describe("courses service tests", () => {
  /** @type {CodeCombatService} */
  let service;

  beforeEach(() => (service = new CodeCombatService()));

  it("Sliggify should work", () => {
    let result = service.sliggify("hap py");
    expect(result).toEqual("hap-py");
  });
});
