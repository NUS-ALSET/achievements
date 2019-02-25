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
const processActivitySolutions = require("./src/processActivitySolution");
const downloadAnalyzeReports = require("./src/downloadAnalyzeReports");
const cohortRecalculate = require("./src/cohortRecalculate");
const userJSONTrigger = require("./src/fetchUserJSON");
const {
  addDestination,
  updateDestinationSkills
} = require("./src/destinationHandler");

const profilesRefreshApproach =
  (functions.config().profiles &&
    functions.config().profiles["refresh-approach"]) ||
  "none";
const ERROR_500 = 500;

// initialize the Firebase Admin SDK
admin.initializeApp();

exports.handleNewProblemSolution =
  ["trigger", "both"].includes(profilesRefreshApproach) &&
  functions.database
    .ref("/jupyterSolutionsQueue/tasks/{requestId}")
    .onWrite(change => {
      const data = change.after.val();
      return jupyterTrigger.handler(data, data.taskKey, data.owner);
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
    processActivitySolutions.handler(
      context.params.activityKey,
      context.params.userKey
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
  ["trigger", "both"].includes(profilesRefreshApproach) &&
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

exports.addActivityDestination = functions.database
  .ref("/activities/{activityId}")
  .onCreate((snapshot, context) => {
    const { activityId } = context.params;
    const activity = snapshot.val();
    const acceptedAcyivitiesTypes = ["jupyter", "jupyterInline"];
    if (acceptedAcyivitiesTypes.includes(activity.type)) {
      return addDestination(activity.name, activity.owner, activityId);
    }
    return Promise.resolve();
  });

exports.addPathDestination = functions.database
  .ref("/paths/{pathId}")
  .onCreate((snapshot, context) => {
    const { pathId } = context.params;
    const path = snapshot.val();
    return addDestination(path.name, path.owner, pathId, true);
  });

exports.updateDestinationSkills = functions.database
  .ref("activityExampleSolutions/{activityId}")
  .onWrite((change, context) => {
    const { activityId } = context.params;
    return updateDestinationSkills(activityId, change.after.val());
  });

exports.cohortRecalculate = functions.database
  .ref("/cohortRecalculateQueue/{cohortKey}/{taskKey}")
  .onCreate((change, context) => {
    const { cohortKey, taskKey } = context.params;
    return cohortRecalculate.handler(cohortKey, taskKey);
  });

exports.handleUserJSONFetchRequest = functions.database
  .ref("/fetchUserJSONQueue/responses/${taskKey}")
  .onWrite(change => {
    const data = change.after.val();
    if (data) {
      return userJSONTrigger.handler(data, data.taskKey, data.owner);
    }
    return Promise.resolve();
  });
