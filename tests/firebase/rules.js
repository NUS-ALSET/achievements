import assert from "assert";
import targaryen from "targaryen";
import json from "firebase-json";
import { getTestState } from "../fixtures/getState";

const rules = json.loadSync("./database.rules.json");

describe("security rules tests", () => {
  let database;
  let data;

  beforeEach(() => {
    data = getTestState({}).firebase.data;
    database = targaryen.database(rules, data);
  });

  it("should disallow write blacklistActions", () => {
    const { permitted } = database.write("/blacklistActions", true);

    assert.equal(permitted, false);
  });

  describe("assignments rules", () => {
    it("should disallow anonymous write to assignments", () => {
      const { permitted } = database.write(
        "/assignments/abcTestCourseId/newAssignmentId",
        { foo: "bar" }
      );

      assert.equal(permitted, false);
    });

    it("should disallow non-instructor write to assignments", () => {
      const { permitted } = database
        .as({ uid: "SomeUID" })
        .write("/assignments/abcTestCourseId/newAssignmentId", { foo: "bar" });

      assert.equal(permitted, false);
    });

    it("should allow instructor write to assignments", () => {
      const { permitted } = database
        .as({ uid: "abcTestUserOwner" })
        .write("/assignments/abcTestCourseId/newAssignmentId", { foo: "bar" });

      assert.equal(permitted, true);
    });
  });

  describe("solutions tests", () => {
    it("should disallow anonymous write", () => {
      const { permitted } = database.write(
        "/solutions/abcTestCourseId/abcTestUser1/abcTestAssignmentId",
        { foo: "bar" }
      );

      assert.equal(permitted, false);
    });

    it("should disallow non-student write", () => {
      const { permitted } = database
        .as({ uid: "abcTestUser2" })
        .write("/solutions/abcTestCourseId/abcTestUser1/abcTestAssignmentId", {
          foo: "bar"
        });

      assert.equal(permitted, false);
    });

    it("should disallow non-course-member student write", () => {
      const { permitted } = database
        .as({ uid: "abcTestUser3" })
        .write("/solutions/abcTestCourseId/abcTestUser3/abcTestAssignmentId", {
          foo: "bar"
        });

      assert.equal(permitted, false);
    });

    it("should allow student write", () => {
      const { permitted } = database
        .as({ uid: "abcTestUser1" })
        .write("/solutions/abcTestCourseId/abcTestUser1/abcTestAssignmentId", {
          foo: "bar"
        });

      assert.equal(permitted, true);
    });
  });
});
