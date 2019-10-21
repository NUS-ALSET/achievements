/* eslint-disable no-magic-numbers */
// Import the Firebase SDK for Google Cloud Functions.
const functions = require("firebase-functions");
// Import the Firebase Admin SDK.
const admin = require("firebase-admin");
const checkToken = require("./src/utils/checkToken");
const api = require("./src/api");
const ltiLogin = require("./src/ltiLogin");
const profileTriggers = require("./src/updateProfile");
const jupyterTrigger = require("./src/executeJupyterSolution");
const githubTrigger = require("./src/fetchGithubFiles");
const downloadEvents = require("./src/downloadEvents");
const solutionTriggers = require("./src/updateSolutionVisibility");
const httpUtil = require("./src/utils/http").httpUtil;
const migrateActivities = require("./src/migrateActivities");
const updateUserRecommendations = require("./src/updateUserRecommendations");
const updateUserPySkills = require("./src/updateUserPySkills.js");
const processActivitySolution = require("./src/processActivitySolution");
const downloadAnalyzeReports = require("./src/downloadAnalyzeReports");
const cohortRecalculate = require("./src/cohortRecalculate");
const cohortAnalytics = require("./src/cohortAnalytics");
const userJSONTrigger = require("./src/fetchUserJSON");
const cohortCalulateQualifiedUser = require("./src/cohortCalulateQualifiedUser");
const createCustomToken = require("./src/createCustomToken");
const runLocalTask = require("./src/runLocalTask");
const runCustomAnalyis = require("./src/runCustomAnalysis");
const fetchNotebookFromGitTrigger = require("./src/fetchNotebookFromGit");
const pathStatsTrigger = require("./src/pathStatsGenerator")
const getTeamAssignmentSolutions = require("./src/getTeamAssignmentSolutions");
const runCreatedPathStats =require("./src/createdPathStatsGenerator")

//  dev-db is paid account now
// const profilesRefreshApproach =
//   (functions.config().profiles &&
//     functions.config().profiles["refresh-approach"]) ||
//   "none";
const ERROR_500 = 500;

// initialize the Firebase Admin SDK
admin.initializeApp();
admin.firestore().settings({ timestampsInSnapshots: true });

exports.handleNewProblemSolution =
  // ["trigger", "both"].includes(profilesRefreshApproach) && // dev-db is paid account now
  functions.database
    .ref("/jupyterSolutionsQueue/tasks/{requestId}")
    .onWrite(change => {
      const data = change.after.val();
      return jupyterTrigger.handler(
        data,
        data.taskKey,
        data.owner,
        "handleNewProblemSolution"
      );
    });


exports.pathStatsScheduler = functions.pubsub.schedule('00 07 * * *')
  .timeZone("Asia/Singapore").
  onRun((context) => {    
    return pathStatsTrigger.handler();
  });

 
exports.handleGithubFilesFetchRequest = functions.database
  .ref("/fetchGithubFilesQueue/tasks/{requestId}")
  .onWrite(change => {
    const data = change.after.val();
    if (data) {
      return githubTrigger.handler(data, data.taskKey, data.owner);
    }
    return Promise.resolve();
  });

exports.handleProblemSolutionQueue = functions.https.onRequest((req, res) => {
  return checkToken(req)
    .then(() => {
      jupyterTrigger.queueHandler();
      res.send("Done");
    })
    .catch(err => res.status(err.code || ERROR_500).send(err.message));
});

exports.handleActivitySolution = functions.database
  .ref("/problemSolutions/{activityKey}/{userKey}")
  .onWrite((change, context) =>
    processActivitySolution.handler(
      context.params.activityKey,
      context.params.userKey,
      change.after.val()
    )
  );

exports.downloadActivitiesSolutionsReport = functions.https.onRequest(
  (req, res) =>
    checkToken(req)
      .then(() =>
        downloadAnalyzeReports.handler({
          node: "/analyze/processActivities",
          limit: req.query.limit,
          skipHeader: req.query.skipHeader,
          fields: [
            "userKey",
            "activityKey",
            "completedAt",
            "attemptsCount",
            "spentTime"
          ]
        })
      )
      .then(data => res.send(data))
      .catch(err => res.status(err.code || ERROR_500).send(err.message))
);

exports.downloadOpenedRecommendations = functions.https.onRequest((req, res) =>
  checkToken(req)
    .then(() =>
      downloadAnalyzeReports.handler({
        node: "/logged_events",
        filterChild: "type",
        filterValue: "HOME_OPEN_RECOMMENDATION",
        limit: req.query.limit,
        skipHeader: req.query.skipHeader,
        fields: [
          "createdAt",
          "uid",
          "otherActionData.recommendationType",
          "otherActionData.recommendations",
          "otherActionData.activityId",
          "otherActionData.pathId"
        ]
      })
    )
    .then(data => res.send(data))
    .catch(err => res.status(err.code || ERROR_500).send(err.message))
);

exports.handleNewSolution = functions.database
  .ref("/solutions/{courseId}/{studentId}/{assignmentId}")
  .onWrite((change, context) => {
    const { courseId, studentId, assignmentId } = context.params;

    solutionTriggers.handler(
      change.after.val(),
      courseId,
      studentId,
      assignmentId
    );
  });

exports.getTeamAssignmentSolutions = functions.https.onCall(
  getTeamAssignmentSolutions.handler
);

/**
 * Method that allows to run advanced activities with CORS workaround
 */
exports.runLocalTask = functions.https.onCall(runLocalTask.handler);

/**
 * Method that allows to run custom Analysis with CORS workaround
 */
exports.runCustomAnalysis = functions.https.onCall(runCustomAnalyis.handler);

exports.runCreatedPathStats = functions.https.onCall(runCreatedPathStats.handler);

exports.handleUserSkills = functions.database
  .ref("/solutions/{courseId}/{studentId}/{assignmentId}")
  .onWrite((change, context) => {
    const { studentId, assignmentId } = context.params;
    return updateUserPySkills.handler(
      change.after.val(),
      studentId,
      assignmentId
    );
  });

exports.handleProfileRefreshRequest =
  // ["trigger", "both"].includes(profilesRefreshApproach) && // dev-db is paid account now
  functions.database
    .ref("/updateProfileQueue/tasks/{requestId}")
    .onCreate((snap, context) =>
      new Promise(resolve => profileTriggers.handler(snap.val(), resolve)).then(
        () =>
          admin
            .database()
            .ref(`/updateProfileQueue/tasks/${context.params.requestId}`)
            .remove()
      )
    );
exports.handleProfileQueue = functions.https.onRequest((req, res) => {
  return checkToken(req)
    .then(() => {
      profileTriggers.queueHandler();
      res.send("Done");
    })
    .catch(err => res.status(err.code || ERROR_500).send(err.message));
});

exports.api = functions.https.onRequest((req, res) => {
  let { token, data } = req.query;

  api.handler(token, data).then(output => res.send(output));
});

exports.ltiLogin = functions.https.onRequest(ltiLogin.handler);

exports.downloadEvents = downloadEvents.httpTrigger;

// Fetch some JSON data from a remote site when npm start is running.
exports.getTest = functions.https.onRequest((req, res) => {
  const url =
    "https://s3-ap-southeast-1.amazonaws.com/alset-public/" +
    "example_solutions.json";
  const data = {};
  httpUtil.call(url, "get", data).then(resp => {
    res.status(200).send(resp);
  });
});

// Post data to a remote url and get json data back.
exports.postTest = functions.https.onRequest((req, res) => {
  const url =
    "https://9dq7wcv20e.execute-api.us-west-2.amazonaws.com/dev/yrtest2";
  // Example of a ast parsing tasks sent to AWS lambda.
  const data = { A: { B: "print('hi')" } };
  httpUtil.call(url, "post", data).then(resp => {
    res.status(200).send(resp);
  });
});

exports.migrateActivities = functions.https.onRequest((req, res) => {
  return checkToken(req)
    .then(() => migrateActivities.handler())
    .then(() => res.send("Done"))
    .catch(err => res.status(err.code || ERROR_500).send(err.message));
});

exports.checkUserRecommendations = functions.https.onRequest((req, res) =>
  updateUserRecommendations
    .handler(req.query.userId)
    .then(data => res.send(data))
    .catch(err => res.status(err.code || ERROR_500).send(err.message))
);

exports.handleUserAuth = functions.database
  .ref("/users/{userKey}/lastAuthTime")
  .onWrite((snap, context) =>
    updateUserRecommendations.handler(context.params.userKey)
  );

exports.cohortRecalculate = functions.database
  .ref("/cohortRecalculateQueue/{cohortKey}/{taskKey}")
  .onCreate((change, context) => {
    const { cohortKey, taskKey } = context.params;
    return cohortRecalculate.handler(cohortKey, taskKey);
  });

exports.handleCohortAnalyticsRequest = functions.database
  .ref("/cohortAnalyticsQueue/tasks/{taskKey}")
  .onWrite(change => {
    const data = change.after.val();
    if (data) {
      return cohortAnalytics.handler(data.cohortId, data.taskKey, data.owner);
    }
    return Promise.resolve();
  });

exports.handleUserJSONFetchRequest = functions.database
  .ref("/newFetchUserJSONQueue/tasks/{taskKey}")
  .onWrite(change => {
    const data = (change.after || {}).val();
    if (data && data.taskKey) {
      return userJSONTrigger.handler(data.taskKey, data.owner);
    }
    return Promise.resolve();
  });

exports.handleFetchNotebookFromGit = functions.database
  .ref("/notebookFromGitQueue/tasks/{taskKey}")
  .onWrite(change => {
    const data = (change.after || {}).val();
    if (data && data.taskKey) {
      return fetchNotebookFromGitTrigger.handler(
        data.taskKey,
        data.owner,
        data.url
      );
    }
    return Promise.resolve();
  });

exports.cohortCalulateQualifiedUser = functions.database
  .ref("/cohorts/{cohortKey}")
  .onWrite((change, context) => {
    const dataAfter = change.after.val();
    const dataBefore = change.before.exists() ? change.before.val() : null;
    const { cohortKey } = context.params;
    if (dataAfter) {
      return cohortCalulateQualifiedUser.handler(
        dataBefore,
        dataAfter,
        cohortKey
      );
    }
    return Promise.resolve();
  });

/**
 * Create custom token for auth. It requires enabled
 * `Service Account Token Creator` role for Google Cloud Function Service Agent
 * https://firebase.google.com/docs/auth/admin/create-custom-tokens#troubleshooting
 *
 * @returns {token|false|undefined} returns token or "falsable" value
 */
exports.createCustomToken = functions.https.onCall(createCustomToken.handler);
