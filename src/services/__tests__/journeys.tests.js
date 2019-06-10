import firebase from "firebase/app";

import { JourneysService } from "../journeys";

describe("Journeys service tests", () => {
  let jService;

  beforeEach(() => {
    firebase.restore();
    jService = new JourneysService();
    firebase.refStub.withArgs("/journeys").returns({
      push: () => ({ key: "deadbeef" })
    });
  });

  afterEach(() => {
    firebase.restore();
  });

  it("should create new journey", async() => {
    const set = jest.fn();
    firebase.refStub.withArgs("/journeys/deadbeef").returns({
      set
    });
    await jService.setJourney("cafebabe", {
      name: "test-name",
      description: "test-description"
    });
    expect(set).toHaveBeenCalledWith({
      id: "deadbeef",
      name: "test-name",
      description: "test-description",
      owner: "cafebabe"
    });
  });

  it("should fail on no name", async() => {
    await expect(jService.setJourney("cafebabe", {})).rejects.toThrow(
      "Missing journey name"
    );
  });
});
