import assert from "assert";
import targaryen from "targaryen";
import json from "firebase-json";
import { getTestState } from "../../../tests/fixtures/getState";

const rulesTest = json.loadSync("./database.rules.json");

describe("security rules tests", () => {
  let database;
  let data;

  beforeEach(() => {
    data = getTestState({}).firebase.data;
    database = targaryen.database(rulesTest, data);
  });

  it("should disallow write blacklistActions", () => {
    const { permitted } = database.write("/blacklistActions", true);

    assert.equal(permitted, false);
  });

  describe("courses rules", () => {
    it("should allow write", () => {
      const { permitted } = database
        .as({ uid: "abcTestUser1" })
        .write("/courses/newCourseId", {
          owner: "abcTestUser1"
        });

      assert.equal(permitted, true);
    });

    it("should disallow public write", () => {
      const { permitted } = database
        .as({ uid: "abcTestUser1" })
        .write("/courses/newCourseId", {
          owner: "abcTestUser1",
          isPublic: true
        });

      assert.equal(permitted, false);
    });

    it("should allow studentCoursePassword write", () => {
      const { permitted } = database
        .as({ uid: "abcTestUser1" })
        .write(
          "/studentCoursePasswords/abcTestCourseId/abcTestUser1",
          "abcTestCoursePassword"
        );

      assert.equal(permitted, true);
    });
  });

  describe("userAchievements rules", () => {
    it("should disallow anonymous write", () => {
      const { permitted } = database.write(
        "/userAchievements/testUserId/foo",
        "bar"
      );

      assert.equal(permitted, false);
    });

    it("should disallow non-student write", () => {
      const { permitted } = database
        .as({ uid: "abcTestUser2" })

        .write("/userAchievements/abcTestUser1/foo", "bar");

      assert.equal(permitted, false);
    });

    it("should allow student write", () => {
      const { permitted } = database
        .as({ uid: "abcTestUser1" })
        .write("/userAchievements/abcTestUser1/foo", "bar");

      assert.equal(permitted, true);
    });

    it("should disallow student write achievements", () => {
      const { permitted, validated } = database
        .as({ uid: "abcTestUser1" })
        .write(
          "/userAchievements/abcTestUser1/CodeCombat/achievements/foo",
          "bar"
        );

      assert.equal(permitted, true, "permitted");
      assert.equal(validated, false, "validated");
    });
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

    it("should allow assistant write to assignments", () => {
      const { permitted } = database
        .as({ uid: "abcTestAssistant1" })
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
