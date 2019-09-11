const firebase = require("@firebase/testing");
const fs = require("fs");

/*
 * ============
 *    Setup
 * ============
 */
// const databaseName = 'database-emulator-example';
const databaseName = "achievements";

const rules = fs.readFileSync("../database.rules.json", "utf8");

/**
 * Creates a new app with authentication data matching the input.
 *
 * @param {object} auth the object to use for authentication (typically {uid: some-uid})
 * @return {object} the app.
 */
function authedApp(auth) {
  return firebase
    .initializeTestApp({
      databaseName: databaseName,
      auth: auth
    })
    .database();
}

/**
 * Creates a new admin app.
 *
 * @return {object} the app.
 */
function adminApp() {
  return firebase.initializeAdminApp({ databaseName: databaseName }).database();
}

/*
 * ============
 *  Test Cases
 * ============
 */
before(async() => {
  // Set database rules before running these tests
  await firebase.loadDatabaseRules({
    databaseName: databaseName,
    rules: rules
  });
});

beforeEach(async() => {
  // Clear the database between tests
  await adminApp()
    .ref()
    .set(null);
});

after(async() => {
  // Close any open apps
  await Promise.all(firebase.apps().map(app => app.delete()));
});

// mock users
const alice = authedApp({ uid: "alice" });
const bob = authedApp({ uid: "bob" });
const mahler = authedApp({ uid: "mahler" });
const noone = authedApp(null);

// all achievements-dev db notes as of Nov 27th 2018
const allAchievementsNodes = [
  "activities",
  "activityData",
  "activityExampleSolutions",
  "admins",
  "analytics",
  "analyze",
  "apiTracking",
  "api_tokens",
  "assignments",
  "blacklistActions",
  "cohortAssistants",
  "cohortCourses",
  "cohortRecalculateQueue",
  "cohorts",
  "completedActivities",
  "config",
  "courseAssistants",
  "courseMembers",
  "coursePasswords",
  "courses",
  "destinations",
  "featureProblemPercentiles",
  "featureRanking",
  "fetchGithubFilesQueue",
  "fetchGithubFilesQueue-temp",
  "jupyterSolutionAnalysisQueue",
  "jupyterSolutionsQueue",
  "logged_events",
  "lti",
  "moreProblemsRequests",
  "outgoingRequestsQueue",
  "pathAssistants",
  "paths",
  "problemCodingSkills",
  "problemSkills",
  "problemSolutions",
  "problems",
  "profileData",
  "solutions",
  "studentCoursePasswords",
  "studentJoinedCourses",
  "studentJoinedPaths",
  "userAchievements",
  "userCodingSkills",
  "userRecommendations",
  "userSkills",
  "users",
  "usersPrivate",
  "visibleSolutions"
];

// root nodes that any non-logged in user can access/read
const NonLoggedAccessNodes = [
  "blacklistActions",
  "cohortCourses",
  "cohorts", // This is needed to search for public cohorts.
  "paths", // This is needed to search for public paths.
  "profileData",
  "users" // Why let everyone download all users?
];

// root nodes that Logged users can read all data
const LoggedAccessRootNodes = [
  "activities",
  "courseAssistants",
  "courseMembers",
  "courses",
  "destinations",
  "logged_events", // Do we need to let developers download every child?
  "userAchievements"
];

// root nodes' childNodes that logged users can read
const LoggedAccessChildNodes = [
  "activityData",
  "admins",
  "cohortAssistants",
  "cohortRecalculateQueue",
  "completedActivities",
  "pathAssistants",
  "problemSolutions",
  "studentJoinedPaths"
];

// root nodes that logged users can overwrite
const UserOverWritableNodes = [
  "completedActivities", // Users can write their own completed activities
  "userAchievements", // Users can write their own achievements nodes
  "users", // Users can update their own users node
  "usersPrivate" // Users can update their own usersPrivate node
];

describe("Non-logged in user", () => {
  it("should be able to read ALL of the data for NonLoggedAccessNodes", async() => {
    for (let childNode of NonLoggedAccessNodes) {
      let location = childNode + "/";
      await firebase.assertSucceeds(noone.ref(location).once("value"));
    }
  });

  it("should be able to read child nodes for certain root nodes", async() => {
    const childNodes = ["cohortAssistants", "completedActivities"];
    for (let childNode of childNodes) {
      let location = childNode + "/" + "someChildNode";
      await firebase.assertSucceeds(noone.ref(location).once("value"));
    }
  });

  it("should NOT be able to read all the data for nodes other than the NonLoggedAccessNodes", async() => {
    const needAuthAccess = allAchievementsNodes.filter(
      item => !NonLoggedAccessNodes.includes(item)
    );
    for (let childNode of needAuthAccess) {
      let location = childNode + "/";
      await firebase.assertFails(noone.ref(location).once("value"));
    }
  });

  it("should NOT be able to write data to any node", async() => {
    for (let childNode of allAchievementsNodes) {
      let location = childNode + "/";
      await firebase.assertFails(noone.ref(location).set("SOME_DATA"));
      location = childNode + "/" + "someChildNode";
      await firebase.assertFails(noone.ref(location).set("SOME_DATA"));
    }
  });
});

describe("Logged in user", () => {
  it("should be able to read all the data for LoggedAccessRootNodes", async() => {
    for (let childNode of LoggedAccessRootNodes) {
      let location = childNode + "/";
      await firebase.assertSucceeds(alice.ref(location).once("value"));
    }
  });

  it("should be able to read specific child data for certain nodes", async() => {
    for (let childNode of LoggedAccessChildNodes) {
      let location = childNode + "/" + "someNode";
      await firebase.assertSucceeds(alice.ref(location).once("value"));
    }
  });

  it("should NOT be able to read nodes or childNodes other than LoggedAccessRootNodes/LoggedAccessChildNodes", async() => {
    const DeniedReadForLoggedNodes = allAchievementsNodes.filter(
      item =>
        !NonLoggedAccessNodes.includes(item) &&
        !LoggedAccessRootNodes.includes(item) &&
        !LoggedAccessChildNodes.includes(item)
    );
    for (let childNode of DeniedReadForLoggedNodes) {
      let entireNode = childNode + "/";
      let specificChild = childNode + "/" + "someNode";
      await firebase.assertFails(alice.ref(entireNode).once("value"));
      await firebase.assertFails(alice.ref(specificChild).once("value"));
    }
  });

  it("should NOT be able to overwrite entire nodes of any root nodes", async() => {
    for (let childNode of allAchievementsNodes) {
      let location = childNode + "/";
      await firebase.assertFails(alice.ref(location).set("SOME_DATA"));
    }
  });

  it("should NOT be able to overwrite random child nodes", async() => {
    for (let childNode of allAchievementsNodes) {
      let location = childNode + "/" + "someRandomChildNode";
      await firebase.assertFails(alice.ref(location).set("SOME_DATA"));
    }
  });

  it("should NOT be able to overwrite a child node for their userId", async() => {
    const childNodes = allAchievementsNodes.filter(
      item => !UserOverWritableNodes.includes(item)
    );
    for (let childNode of childNodes) {
      let location = childNode + "/" + "alice";
      await firebase.assertFails(alice.ref(location).set("SOME_DATA"));
    }
  });

  it("should be able to overwrite a child node for their userId ie UserOverWritableNodes", async() => {
    for (let childNode of UserOverWritableNodes) {
      let location = childNode + "/" + "alice";
      await firebase.assertSucceeds(alice.ref(location).set("SOME_DATA"));
    }
  });
});

// =====================
// Individual Root Nodes
// =====================

describe("Activities rules", () => {
  it("anyone can read activities from public path", async() => {
    // public path
    await adminApp()
      .ref("/paths/ourPath1")
      .set({
        name: "our Path1",
        isPublic: true
      });
    // non-public path
    await adminApp()
      .ref("/paths/ourPath2")
      .set({
        name: "our Path2",
        isPublic: false
      });
    await adminApp()
      .ref("/activities/activity1")
      .set({
        name: "jupyter activity1",
        path: "ourPath1"
      });
    await adminApp()
      .ref("/activities/activity2")
      .set({
        name: "youtube activity1",
        path: "ourPath2"
      });
    await firebase.assertSucceeds(
      noone.ref("/activities/activity1").once("value")
    );
    await firebase.assertFails(
      noone.ref("/activities/activity2").once("value")
    );
  });
});

// ActivityData looks like specifically for githubURL based activities
describe("ActivityData rules", () => {
  it("only logged in users that met requirements have write access", async() => {
    await firebase.assertFails(
      noone.ref("/activityData/activity1").set({ name: "bob" })
    );
    await firebase.assertFails(
      alice.ref("/activityData/activity1").set({ name: "bob" })
    );
  });
});

describe("Assignments rules", () => {
  it("course owner can read and write assignments", async() => {
    // create some courses
    await adminApp()
      .ref("/courses/ourCourse1")
      .set({
        name: "our course1",
        owner: "alice"
      });
    await firebase.assertFails(
      noone.ref("/assignments/ourCourse1").once("value")
    );
    await firebase.assertSucceeds(
      alice.ref("/assignments/ourCourse1").once("value")
    );
    await firebase.assertSucceeds(
      alice
        .ref("/assignments/ourCourse1")
        .set({ name: "updated version of course1" })
    );
  });

  it("course assistants can read and write assignments", async() => {
    // create some courses
    await adminApp()
      .ref("/courses/ourCourse1")
      .set({
        name: "our course1",
        owner: "alice"
      });
    // create some courses assistants
    await adminApp()
      .ref("/courseAssistants/ourCourse1")
      .set({
        mahler: true
      });
    await firebase.assertSucceeds(
      mahler.ref("/assignments/ourCourse1").once("value")
    );
    await firebase.assertSucceeds(
      mahler
        .ref("/assignments/ourCourse1")
        .set({ name: "updated version of course1" })
    );
  });

  it("course members can only read the assignments", async() => {
    // create some courses
    await adminApp()
      .ref("/courses/ourCourse1")
      .set({
        name: "our course1",
        owner: "alice"
      });
    // create some courses members
    await adminApp()
      .ref("/courseMembers/ourCourse1")
      .set({
        bob: true
      });
    await firebase.assertSucceeds(
      bob.ref("/assignments/ourCourse1").once("value")
    );
  });
});

describe("cohortAssistant Rules", () => {
  it("should allow cohort owner to add cohort assistant", async() => {
    // Add additional tests here.
    // first create a cohort1 under cohort as alice
    await firebase.assertSucceeds(
      alice.ref("/cohorts/cohort1").set({ owner: "alice" })
    );
    // alice is the cohort owner of cohort1
    await firebase.assertSucceeds(
      alice.ref("/cohortAssistants/cohort1").set({ bob: true })
    );
  });
});

describe("cohortCourses rules", () => {
  it("should allow cohort owner to add courses to a cohort", async() => {
    // first create a cohort1 under cohort as alice
    await firebase.assertSucceeds(
      alice.ref("/cohorts/cohort1").set({ owner: "alice" })
    );
    await firebase.assertSucceeds(
      alice.ref("/courses/course1").set({ owner: "alice" })
    );
    // alice is the cohort owner of cohort1
    // alice is also the course owner of course1
    await firebase.assertSucceeds(
      alice
        .ref("/cohortCourses/cohort1/course1")
        .set({ name: "Alice Course 1" })
    );
    // alice now made bob an assistant to cohort1
    await firebase.assertSucceeds(
      alice.ref("/cohortAssistants/cohort1").set({ bob: true })
    );
    await firebase.assertSucceeds(
      bob.ref("/cohortCourses/cohort1/course1").set({ name: "Alice Course 1" })
    );
  });
});

describe("Config rules", () => {
  it("should allow non-logged users to read defaultRecommendations", async() => {
    // Add additional tests here.
    await firebase.assertSucceeds(
      noone.ref("/config/defaultRecommendations").once("value")
    );
  });

  it("should allow non-logged users to read config version", async() => {
    await firebase.assertSucceeds(noone.ref("/config/version").once("value"));
  });
});

describe("courseMembers rules", () => {
  it("course owner and assistants can set up a course under the courseMembers node", async() => {
    // create some courses
    await adminApp()
      .ref("/courses/ourCourse1")
      .set({
        name: "our course1",
        owner: "alice"
      });
    // create some courses assistants
    await adminApp()
      .ref("/courseAssistants/ourCourse1")
      .set({
        mahler: true
      });
    await firebase.assertSucceeds(
      alice.ref("/courseMembers/ourCourse1").set(true)
    );
    await firebase.assertSucceeds(
      mahler.ref("/courseMembers/ourCourse1").set(true)
    );
  });

  it("logged-in users can add themselves to a course as courseMembers if they know the password to that course", async() => {
    // create some courses
    await adminApp()
      .ref("/courses/ourCourse1")
      .set({
        name: "our course1",
        owner: "alice"
      });
    await adminApp()
      .ref("/courses/ourCourse2")
      .set({
        name: "our course2",
        owner: "bob"
      });
    await adminApp()
      .ref("/studentCoursePasswords/")
      .set({ ourCourse1: "hello" });
    await adminApp()
      .ref("/studentCoursePasswords/ourCourse1/someuid")
      .set({ uid: "test123" });
    await adminApp()
      .ref("/studentCoursePasswords/")
      .set({
        ourCourse2: {
          mahler: "test123"
        }
      });

    await firebase.assertFails(
      noone.ref("/courseMembers/ourCourse1/mahler").set(true)
    );
    // bob should not be able to add mahler
    await firebase.assertFails(
      bob.ref("/courseMembers/ourCourse1/mahler").set(true)
    );
    // mahler should be able to add himself
    await firebase.assertFails(
      mahler.ref("/courseMembers/ourCourse1/mahler").set({ mahler: "test123" })
    );
    await firebase.assertSucceeds(
      mahler.ref("/courseMembers/ourCourse2/mahler").set({ mahler: "test123" })
    );
  });
});

describe("coursePasswords rules", () => {
  it("only the course owner can set the course password", async() => {
    // create some courses
    await adminApp()
      .ref("/courses/ourCourse1")
      .set({
        name: "our course1",
        owner: "alice"
      });
    await adminApp()
      .ref("/courses/ourCourse2")
      .set({
        name: "our course2",
        owner: "bob"
      });

    await firebase.assertFails(
      mahler.ref("coursePasswords/ourCourse1").set({ pwd: "SOMEPWD" })
    );
    await firebase.assertSucceeds(
      alice.ref("coursePasswords/ourCourse1").set({ pwd: "SOMEPWD" })
    );
  });
});

describe("courseAssistants rules", () => {
  it("only logged in users can access the courseKeys", async() => {
    await firebase.assertFails(
      noone.ref("courseAssistants/ourCourse1").once("value")
    );
    await firebase.assertSucceeds(
      bob.ref("courseAssistants/ourCourse1").once("value")
    );
  });
});

describe("courses rules", () => {
  it("only logged in users can access the courseKeys", async() => {
    // create some courses
    await adminApp()
      .ref("/courses/ourCourse1")
      .set({
        name: "our course1",
        owner: "alice"
      });

    await firebase.assertFails(noone.ref("courses/ourCourse1").once("value"));
    await firebase.assertSucceeds(bob.ref("courses/ourCourse1").once("value"));
  });
});

describe("secrets node rules", () => {
  it("only admin can access the secrets node", async() => {
    // create some admin user
    await adminApp()
      .ref("/admins/alice")
      .set({
        uid: "alice"
      });

    await firebase.assertFails(bob.ref("/secrets").once("value"));
    await firebase.assertSucceeds(alice.ref("/secrets").once("value"));
  });
});

describe("solutions rules", () => {
  it("userKey under courseKey can only be accessed by the user or the course owner", async() => {
    // create some courses
    await adminApp()
      .ref("/courses/ourCourse1")
      .set({
        name: "our course1",
        owner: "alice"
      });
    // create some courses members
    await adminApp()
      .ref("/courseMembers/ourCourse1")
      .set({
        bob: true,
        mahler: true
      });

    await firebase.assertFails(
      noone.ref("/solutions/ourCourse1/bob").once("value")
    );
    await firebase.assertSucceeds(
      bob.ref("/solutions/ourCourse1/bob").once("value")
    );
    await firebase.assertFails(
      mahler.ref("/solutions/ourCourse1/bob").once("value")
    );
    await firebase.assertSucceeds(
      alice.ref("/solutions/ourCourse1/bob").once("value")
    );
  });

  it("userKey under courseKey can only be edited by the user or the course owner", async() => {
    // create some courses
    await adminApp()
      .ref("/courses/ourCourse1")
      .set({
        name: "our course1",
        owner: "alice"
      });
    // create some courses members
    await adminApp()
      .ref("/courseMembers/ourCourse1")
      .set({
        bob: true,
        mahler: true
      });

    await firebase.assertFails(
      noone.ref("/solutions/ourCourse1/bob").set({ name: "SOME_DATA" })
    );
    await firebase.assertSucceeds(
      bob.ref("/solutions/ourCourse1/bob").set({ name: "SOME_DATA" })
    );
    await firebase.assertFails(
      mahler.ref("/solutions/ourCourse1/bob").set({ name: "SOME_DATA" })
    );
  });
});

describe("studentJoinedCourses rules", () => {
  it("student under that course or course owner/assistants can edit the courseKey", async() => {
    // create some courses
    await adminApp()
      .ref("/courses/ourCourse1")
      .set({
        name: "our course1",
        owner: "alice"
      });
    await adminApp()
      .ref("/courseAssistants/ourCourse1")
      .set({
        mahler: true
      });
    // create some courses members
    await adminApp()
      .ref("/courseMembers/ourCourse1")
      .set({
        bob: true,
        mahler: true
      });
    await adminApp()
      .ref("/studentCoursePasswords/ourCourse1")
      .set({
        bob: true,
        mahler: true
      });

    await firebase.assertFails(
      noone
        .ref("/studentJoinedCourses/bob/ourCourse1/")
        .set({ course: "calculus2" })
    );
    await firebase.assertSucceeds(
      bob
        .ref("/studentJoinedCourses/bob/ourCourse1/")
        .set({ course: "calculus2" })
    );

    await firebase.assertSucceeds(
      alice
        .ref("/studentJoinedCourses/bob/ourCourse1/")
        .set({ course: "calculus2" })
    );
    await firebase.assertSucceeds(
      mahler
        .ref("/studentJoinedCourses/bob/ourCourse1/")
        .set({ course: "calculus2" })
    );
  });
});

/*
describe('profile read rules', () => {
  it('should allow anyone to read profiles', async () => {
    const alice = authedApp({uid: 'alice'});
    const bob = authedApp({uid: 'bob'});
    const noone = authedApp(null);

    await adminApp().ref('users/alice').set({
      name: 'Alice',
      profilePicture: 'http://cool_photos/alice.jpg',
    });

    await firebase.assertSucceeds(alice.ref('users/alice').once('value'));
    await firebase.assertSucceeds(bob.ref('users/alice').once('value'));
    await firebase.assertSucceeds(noone.ref('users/alice').once('value'));
  });

  it('should only allow users to modify their own profiles', async () => {
    const alice = authedApp({uid: 'alice'});
    const bob = authedApp({uid: 'bob'});
    const noone = authedApp(null);

    await firebase.assertSucceeds(alice.ref('users/alice').update({
      'favorite_color': 'blue',
    }));
    await firebase.assertFails(bob.ref('users/alice').update({
      'favorite_color': 'red',
    }));
    await firebase.assertFails(noone.ref('users/alice').update({
      'favorite_color': 'orange',
    }));
  });
});

describe('room creation', () => {
  it('should require the user creating a room to be its owner', async () => {
    const alice = authedApp({uid: 'alice'});

    // should not be able to create room owned by another user
    await firebase.assertFails(alice.ref('rooms/room1').set({owner: 'bob'}));
    // should not be able to create room with no owner
    await firebase.assertFails(alice.ref('rooms/room1').set({members: {'alice': true}}));
    // alice should be allowed to create a room she owns
    await firebase.assertSucceeds(alice.ref('rooms/room1').set({owner: 'alice'}));
  });
});

describe('room members', () => {
  it('must be added by the room owner', async () => {
    const ownerId = 'room_owner';
    const owner = authedApp({uid: ownerId});
    await owner.ref('rooms/room2').set({owner: ownerId});

    const aliceId = 'alice';
    const alice = authedApp({uid: aliceId});
    // alice cannot add random people to a room
    await firebase.assertFails(alice.ref('rooms/room2/members/rando').set(true));
    // alice cannot add herself to a room
    await firebase.assertFails(alice.ref('rooms/room2/members/alice').set(true));
    // the owner can add alice to a room
    await firebase.assertSucceeds(owner.ref('rooms/room2/members/alice').set(true));
  });
});
*/
