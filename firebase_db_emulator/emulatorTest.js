const firebase = require('@firebase/testing');
const fs = require('fs');

/*
 * ============
 *    Setup
 * ============
 */
//const databaseName = 'database-emulator-example';
const databaseName = 'achievements';

const rules = fs.readFileSync('../database.rules.json', 'utf8');

/**
 * Creates a new app with authentication data matching the input.
 *
 * @param {object} auth the object to use for authentication (typically {uid: some-uid})
 * @return {object} the app.
 */
function authedApp(auth) {
  return firebase.initializeTestApp({
    databaseName: databaseName,
    auth: auth,
  }).database();
}

/**
 * Creates a new admin app.
 *
 * @return {object} the app.
 */
function adminApp() {
  return firebase.initializeAdminApp({databaseName: databaseName}).database();
}

/*
 * ============
 *  Test Cases
 * ============
 */
before(async () => {
  // Set database rules before running these tests
  await firebase.loadDatabaseRules({
    databaseName: databaseName,
    rules: rules,
  });
});

beforeEach(async () => {
  // Clear the database between tests
  await adminApp().ref().set(null);
});

after(async () => {
  // Close any open apps
  await Promise.all(firebase.apps().map((app) => app.delete()));
});

let allAchievementsNodes = ["activityData",
  "activityExampleSolutions",
  "admins",
  "analytics",
  "analyze",
  "api_tokens",
  "apiTracking",
  "assignments",
  "blackListActions",
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
  "logged_events",
  "moreProblemsRequests",
  "pathAssistants",
  "paths",
  "problems",
  "problemSolutions",
  "solutions",
  "studentCoursePasswords",
  "studentJoinedCourses",
  "studentJoinedPaths",
  "userAchievements",
  "userRecommendations",
  "users",
  "usersPrivate",
  "visibleSolutions"
  ]

  describe('A non-logged in user', () => {
    it('should be able to read all of the data for certain nodes', async () => {
      const noone = authedApp(null);
      const childNodes = [
      "cohortCourses",
      "cohorts",
      "paths",
      "users"
      ]
      for (let childNode of childNodes) {
        //console.log(childNode);
        let location = childNode+'/'//+'alice';
        await firebase.assertSucceeds(noone.ref(location).once('value'));
        let someChild = childNode+'/'+'someChildNode';
        await firebase.assertSucceeds(noone.ref(someChild).once('value'));
      }
    });

    it('should be able to read specific child nodes for certain root nodes', async () => {
      const noone = authedApp(null);
      const childNodes = [
      "cohortAssistants",
      "completedActivities"
      ]
      for (let childNode of childNodes) {
        //console.log(childNode);
        let location = childNode+'/'+'someChildNode';
        await firebase.assertSucceeds(noone.ref(location).once('value'));
      }
    });

    it('should NOT be able to read all the data for certain nodes', async () => {
      const noone = authedApp(null);
      const childNodes = [
      "activities",
      "activityData",
      "activityExampleSolutions",
      "admins",
      "analytics",
      "analyze",
      "api_tokens",
      "apiTracking",
      "assignments",
      "blackListActions",
      "cohortRecalculateQueue",
      "config",
      "courseAssistants",
      "courseMembers",
      "coursePasswords",
      "courses",
      "destinations",
      "logged_events",
      "moreProblemsRequests",
      "pathAssistants",
      "problems",
      "problemSolutions",
      "solutions",
      "studentCoursePasswords",
      "studentJoinedCourses",
      "studentJoinedPaths",
      "userAchievements",
      "userRecommendations",
      "usersPrivate",
      "visibleSolutions",]
      for (let childNode of childNodes) {
        //console.log(childNode);
        let location = childNode+'/'
        await firebase.assertFails(noone.ref(location).once('value'));
      }
    });

    it('should NOT be able to write data to any node', async () => {
      const noone = authedApp(null);
      const childNodes = [
        "activityData",
        "activityExampleSolutions",
        "admins",
        "analytics",
        "analyze",
        "api_tokens",
        "apiTracking",
        "assignments",
        "blackListActions",
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
        "logged_events",
        "moreProblemsRequests",
        "pathAssistants",
        "paths",
        "problems",
        "problemSolutions",
        "solutions",
        "studentCoursePasswords",
        "studentJoinedCourses",
        "studentJoinedPaths",
        "userAchievements",
        "userRecommendations",
        "users",
        "usersPrivate",
        "visibleSolutions"]
      for (let childNode of childNodes) {
        //console.log(childNode);
        let location = childNode+'/';
        await firebase.assertFails(noone.ref(location).set("SOME_DATA"));
        location = childNode+'/'+'someChildNode';
        await firebase.assertFails(noone.ref(location).set("SOME_DATA"));
      }
    });
  });

describe('A logged in user', () => {
  it('should be able to read all the data for certain nodes', async () => {
    const alice = authedApp({uid: 'alice'});
    const childNodes = [
      "activities",
      "activityData", // Do we really need to let developers download every child?
      "cohortCourses",
      "cohorts",     // This is needed to search for public cohorts.
      "courseAssistants",
      "courseMembers",
      "courses",
      "destinations",
      "logged_events", // Do we need to let developers download every child? 
      "paths",  // This is needed to search for public paths. 
      "userAchievements",
      "users", // Why do developers need to download all users?
    ]
    for (let childNode of childNodes) {
      //console.log(childNode);
      let location = childNode+'/'
      await firebase.assertSucceeds(alice.ref(location).once('value'));
    }
  });
  it('should be able to read specific child data for certain nodes', async () => {
    const alice = authedApp({uid: 'alice'});
    const childNodes = [
      "admins",
      "cohortAssistants",
      "cohortRecalculateQueue",
      "completedActivities",
      "pathAssistants",
      "problemSolutions",
      "studentJoinedPaths"
    ]
    for (let childNode of childNodes) {
      //console.log(childNode);
      let location = childNode+'/'+'someNode';
      await firebase.assertSucceeds(alice.ref(location).once('value'));
    }
  });

  it('should NOT be able to read all or specific nodes', async () => {
    const alice = authedApp({uid: 'alice'});
    const childNodes = [
    "activityExampleSolutions",
    "analytics",
    "analyze",
    "api_tokens",
    "apiTracking",
    "assignments",
    "blackListActions",
    "config",
    "coursePasswords",
    "moreProblemsRequests",
    "problems",
    "solutions",
    "studentCoursePasswords",
    "studentJoinedCourses",
    "userRecommendations",
    "usersPrivate",
    "visibleSolutions"
    ]
    for (let childNode of childNodes) {
      //console.log(childNode);
      let entireNode = childNode+'/';
      let specificChild = childNode+'/'+'someNode';
      await firebase.assertFails(alice.ref(entireNode).once('value'));
      await firebase.assertFails(alice.ref(specificChild).once('value'));
    }
  });
  it('should NOT be able to overwrite entire nodes', async () => {
    const alice = authedApp({uid: 'alice'});
    const childNodes = [
      "activityData",
      "activityExampleSolutions",
      "admins",
      "analytics",
      "analyze",
      "api_tokens",
      "apiTracking",
      "assignments",
      "blackListActions",
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
      //"logged_events", // Issue: Anyone can overwrite all logs. 
      "moreProblemsRequests",
      "pathAssistants",
      "paths",
      "problems",
      "problemSolutions",
      "solutions",
      "studentCoursePasswords",
      "studentJoinedCourses",
      "studentJoinedPaths",
      "userAchievements",
      "userRecommendations",
      "users",
      "usersPrivate",
      "visibleSolutions"]
    for (let childNode of childNodes) {
      //console.log(childNode);
      let location = childNode+'/';
      await firebase.assertFails(alice.ref(location).set("SOME_DATA"));      
    }
  });
  it('should NOT be able to overwrite random child nodes', async () => {
    const alice = authedApp({uid: 'alice'});
    const childNodes = [
      "activityData",
      "activityExampleSolutions",
      "admins",
      "analytics",
      "analyze",
      "api_tokens",
      "apiTracking",
      "assignments",
      "blackListActions",
      "cohortAssistants",
      "cohortCourses",
      "cohortRecalculateQueue",
      "cohorts",
      "completedActivities",
      "config",
      "courseAssistants",
      "courseMembers",
      //"coursePasswords", You can write a password if the course does not exist yet.
      "courses",
      "destinations",
      //"logged_events", // Issue: Anyone can overwrite all logs.
      "moreProblemsRequests",
      "pathAssistants",
      "paths",
      "problems",
      "problemSolutions",
      "solutions",
      "studentCoursePasswords",
      "studentJoinedCourses",
      "studentJoinedPaths",
      "userAchievements",
      "userRecommendations",
      "users",
      "usersPrivate",
      "visibleSolutions"]
    for (let childNode of childNodes) {
      //console.log(childNode);
      location = childNode+'/'+'someRandomChildNode';
      await firebase.assertFails(alice.ref(location).set("SOME_DATA"));
    }
  });

  it('should be able to overwrite a child node for their userId', async () => {
    const alice = authedApp({uid: 'alice'});
    const childNodes = [
      "completedActivities", // Users can write their own completed activities
      "coursePasswords",     // A user can write a password if the course does not exist yet.
      "logged_events",       // Issue: Anyone can overwrite all logs.
      "userAchievements",    // Users can write their own achievements nodes
      "users",               // Users can update their own users node
      "usersPrivate",        // Users can update their own usersPrivate node
    ]
    for (let childNode of childNodes) {
      //console.log(childNode);
      location = childNode+'/'+'alice';
      await firebase.assertSucceeds(alice.ref(location).set("SOME_DATA"));
    }
  });
  it('should NOT be able to overwrite a child node for their userId', async () => {
    const alice = authedApp({uid: 'alice'});
    const childNodes = [
      "activityData",
      "activityExampleSolutions",
      "admins",
      "analytics",
      "analyze",
      "api_tokens",
      "apiTracking",
      "assignments",
      "blackListActions",
      "cohortAssistants",
      "cohortCourses",
      "cohorts",
      "config",
      "courseAssistants",
      "courseMembers",
      "courses",
      "destinations",
      "moreProblemsRequests",
      "pathAssistants",
      "paths",
      "problems",
      "problemSolutions",
      "solutions",
      "studentCoursePasswords",
      "studentJoinedCourses",
      "studentJoinedPaths",
      "userRecommendations",
      "visibleSolutions"]
    for (let childNode of childNodes) {
      //console.log(childNode);
      location = childNode+'/'+'alice';
      await firebase.assertFails(alice.ref(location).set("SOME_DATA"));
    }
  });
});

describe('Activities rules', () => {
  it('should .....', async () => {
    const alice = authedApp({uid: 'alice'});
    // Add additional tests here.
  });
});

// Add write nodes



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
