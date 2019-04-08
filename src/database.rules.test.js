import assert from "assert";
import targaryen from "targaryen/plugins/jest";
import json from "firebase-json";
import { getTestState } from "../tests/fixtures/getState";

// This command allows you put newlines and comments in your rules.
const rules = json.loadSync("./database.rules.json");
expect.extend({
  toAllowRead: targaryen.toAllowRead,
  toAllowUpdate: targaryen.toAllowUpdate,
  toAllowWrite: targaryen.toAllowWrite
});

let isEmulating = false; // or some ENV variable

if (isEmulating) {
  // const firebase = require("@firebase/testing");
  // const fs = require("fs");

  /*
   * ============
   *    Setup
   * ============
   */

  // this sample test.js needs the 9000 database serve to work
  // so should first firebase serve --only database
  // const databaseName = "achievements-emulator";

  // const rules = fs.readFileSync("database.rules.json", "utf8");

  /**
   * Creates a new app with authentication data matching the input.
   *
   * @param {object} auth the object to use for authentication (typically {uid: some-uid})
   * @return {object} the app.
   */
  // function authedApp(auth) {
  //   return firebase
  //     .initializeTestApp({
  //       databaseName: databaseName,
  //       auth: { uid: "alice" }
  //     })
  //     .database();
  // }

  /**
   * Creates a new admin app.
   *
   * @return {object} the app.
   */
  // function adminApp() {
  //   return firebase
  //     .initializeAdminApp({ databaseName: databaseName })
  //     .database();
  // }
}

describe("security rules tests", () => {
  let database;
  let data;

  if (isEmulating) {
    /*
     * ============
     *  Test Cases
     * ============
     */
    beforeAll(async () => {
      // Set database rules before running these tests
      await firebase.loadDatabaseRules({
        databaseName: databaseName,
        rules: rules
      });
    });

    beforeEach(async () => {
      // Clear the database between tests
      await adminApp()
        .ref()
        .set(null);
    });

    afterAll(async () => {
      // Close any open apps
      await Promise.all(firebase.apps().map(app => app.delete()));
    });
  } else {
    beforeEach(() => {
      data = getTestState({}).firebase.data;
      database = targaryen.getDatabase(rules, data);
    });
  }

  describe("activities tests", () => {
    /*
    it("should only allow auth user to view activities", async () => {
      expect(database.as(null)).toAllowRead("/activities");
      if (isEmulating) {
        const alice = authedApp({ uid: "alice" });
        const bob = authedApp({ uid: "bob" });
        const noone = authedApp(null);

        await adminApp()
          .ref("activities/")
          .set({
            id: "L8jkji8uxkjwU"
          });

        await firebase.assertSucceeds(alice.ref("activities/").once("value"));
        await firebase.assertSucceeds(bob.ref("activities/").once("value"));
        await firebase.assertFails(noone.ref("activities/").once("value"));
      }
    });
    */

    it("should only allow auth user to access activityData node", () => {
      expect(database.as(null)).not.toAllowRead("/activityData");
    });

    it("should allow assistant write to activities", () => {
      const { permitted } = database
        .as({ uid: "abcTestAssistant1" })
        .write("/activities/abcTestActivitiyId", {
          path: "abcTestPathId"
        });

      assert.strictEqual(permitted, true);
    });
  });

  describe("blacklistActions rules", () => {
    it("should disallow write blacklistActions", () => {
      const { permitted } = database.write("/blacklistActions", true);

      expect(permitted).toEqual(false);
    });

    it("should allow read blacklistActions", () => {
      const { permitted } = database.read("/blacklistActions", true);

      expect(permitted).toEqual(true);
    });
  });

  describe("courses rules", () => {
    it("should allow write", () => {
      const { permitted } = database
        .as({ uid: "abcTestUser1" })
        .write("/courses/newCourseId", {
          owner: "abcTestUser1"
        });

      assert.strictEqual(permitted, true);
    });

    it("should disallow public write", () => {
      const { permitted } = database
        .as({ uid: "abcTestUser1" })
        .write("/courses/newCourseId", {
          owner: "abcTestUser1",
          isPublic: true
        });

      assert.strictEqual(permitted, false);
    });

    it("should allow studentCoursePassword write", () => {
      const { permitted } = database
        .as({ uid: "abcTestUser1" })
        .write(
          "/studentCoursePasswords/abcTestCourseId/abcTestUser1",
          "abcTestCoursePassword"
        );

      assert.strictEqual(permitted, true);
    });
  });

  describe("userAchievements rules", () => {
    it("should disallow anonymous write", () => {
      const { permitted } = database.write(
        "/userAchievements/testUserId/foo",
        "bar"
      );

      assert.strictEqual(permitted, false);
    });

    it("should disallow non-student write", () => {
      const { permitted } = database
        .as({ uid: "abcTestUser2" })

        .write("/userAchievements/abcTestUser1/foo", "bar");

      assert.strictEqual(permitted, false);
    });

    it("should allow student write", () => {
      const { permitted } = database
        .as({ uid: "abcTestUser1" })
        .write("/userAchievements/abcTestUser1/foo", "bar");

      assert.strictEqual(permitted, true);
    });

    it("should disallow student write achievements", () => {
      const { permitted, validated } = database
        .as({ uid: "abcTestUser1" })
        .write(
          "/userAchievements/abcTestUser1/CodeCombat/achievements/foo",
          "bar"
        );

      assert.strictEqual(permitted, true, "permitted");
      assert.strictEqual(validated, false, "validated");
    });
  });

  describe("assignments rules", () => {
    it("should disallow anonymous write to assignments", () => {
      const { permitted } = database.write(
        "/assignments/abcTestCourseId/newAssignmentId",
        { foo: "bar" }
      );

      assert.strictEqual(permitted, false);
    });

    it("should disallow non-instructor write to assignments", () => {
      const { permitted } = database
        .as({ uid: "SomeUID" })
        .write("/assignments/abcTestCourseId/newAssignmentId", { foo: "bar" });

      assert.strictEqual(permitted, false);
    });

    it("should allow instructor write to assignments", () => {
      const { permitted } = database
        .as({ uid: "abcTestUserOwner" })
        .write("/assignments/abcTestCourseId/newAssignmentId", { foo: "bar" });

      assert.strictEqual(permitted, true);
    });

    it("should allow assistant write to assignments", () => {
      const { permitted } = database
        .as({ uid: "abcTestAssistant1" })
        .write("/assignments/abcTestCourseId/newAssignmentId", { foo: "bar" });

      assert.strictEqual(permitted, true);
    });
  });

  describe("solutions tests", () => {
    it("should disallow anonymous write", () => {
      const { permitted } = database.write(
        "/solutions/abcTestCourseId/abcTestUser1/abcTestAssignmentId",
        { foo: "bar" }
      );

      assert.strictEqual(permitted, false);
    });

    it("should disallow non-student write", () => {
      const { permitted } = database
        .as({ uid: "abcTestUser2" })
        .write("/solutions/abcTestCourseId/abcTestUser1/abcTestAssignmentId", {
          foo: "bar"
        });

      assert.strictEqual(permitted, false);
    });

    it("should disallow non-course-member student write", () => {
      const { permitted } = database
        .as({ uid: "abcTestUser3" })
        .write("/solutions/abcTestCourseId/abcTestUser3/abcTestAssignmentId", {
          foo: "bar"
        });

      assert.strictEqual(permitted, false);
    });

    it("should allow student write", () => {
      const { permitted } = database
        .as({ uid: "abcTestUser1" })
        .write("/solutions/abcTestCourseId/abcTestUser1/abcTestAssignmentId", {
          foo: "bar"
        });

      assert.strictEqual(permitted, true);
    });
  });

  describe("moreProblemsRequests rules", () => {
    it("should not allow non-logged user to read", () => {
      const { permitted } = database.read("/moreProblemsRequests", true);

      expect(permitted).toEqual(false);
    });
  });

  describe("analytics rules", () => {
    it("should allow any user to read CRUDdemo data", () => {
      const { permitted } = database.read("/analytics/CRUDdemo", true);

      expect(permitted).toEqual(true);
    });

    it("should only allow users themselves to write to their data in CRUDdemo", () => {
      const { permitted } = database
        .as({ uid: "bobby" })
        .write("/analytics/CRUDdemo/kris", { someData: "123" });

      expect(permitted).toEqual(false);
    });
  });
});
