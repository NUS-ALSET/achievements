import assert from "assert";
import { CoursesService } from "../courses";

describe("courses service tests", () => {
  /** @type {CoursesService} */
  let service;

  beforeEach(() => (service = new CoursesService()));

  it("should validate new course", () => {
    service.validateNewCourse({
      name: "test",
      password: "test"
    });
    assert("We should get here");
  });

  it("shouldn't validate new course", () =>
    Promise.resolve()
      .then(() =>
        service.validateNewCourse({
          name: "",
          password: "test"
        })
      )
      .catch(err => {
        assert.strictEqual(err.message, "Missing name or password");
      }));

  it("should validate existing course", () => {
    service.validateNewCourse({
      id: "test"
    });
  });
});
