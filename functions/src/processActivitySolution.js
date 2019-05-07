const admin = require("firebase-admin");
const httpUtil = require("./utils/http").httpUtil;
const ONE_HOURS = 3600000;

/**
 * Checks Python activities solutions for skills via lambda function
 * and store result into firebase
 * @param {String} activityKey
 * @param {String} userKey
 * @param {Object} data
 * @param {String} data.solution JSON with jupyter solution
 * @param {Number} data.updatedAt
 */
function analyzePythonCode(activityKey, userKey, data) {
  return Promise.all([
    admin
      .database()
      .ref("/config/jupyterAnalysisLambdaProcessor")
      .once("value")
      .then(snap => snap.val()),
    admin
      .database()
      .ref(`/activities/${activityKey}`)
      .once("value")
      .then(snap => snap.val())
  ]).then(([analyzeUrl, activity]) => {
    let code, solution;
    switch (activity.type) {
      case "jupyterInline":
        solution = JSON.parse(data.solution);
        code = solution.cells[activity.code].source.join("");

        return httpUtil
          .post(analyzeUrl, { [activityKey]: { [userKey]: code } })
          .then(response =>
            admin
              .database()
              .ref("/analyze/skills")
              .update(response)
          )
          .catch(err => console.error(err));
      default:
        return Promise.resolve();
    }
  });
}

function analyzeDiffPythonCode(activityKey, userKey, data) {
  return Promise.all([
    admin
      .database()
      .ref("/config/jupyterDiffAnalysisLambdaProcessor")
      .once("value")
      .then(snap => snap.val()),
    admin
      .database()
      .ref(`/activities/${activityKey}`)
      .once("value")
      .then(snap => snap.val())
  ]).then(([analyzeUrl, activity]) => {
    let code, solution;
    switch (activity.type) {
      case "jupyterInline":
        solution = JSON.parse(data.solution);
        code = solution.cells[activity.code].source.join("");

        return httpUtil
          .post(analyzeUrl, { givenCode: code, solutionCode: code })
          .then(response =>
            admin
              .firestore()
              .collection("/diffCodeAnalysis")
              .add({
                ...response,
                uid: userKey,
                //createdAt: firebase.firestore.Timestamp.now().toMillis(),
                activityKey: activityKey,
                sGen: True
              })
          )
          .catch(err => console.error(err));
      default:
        return Promise.resolve();
    }
  });
}

exports.analyzePythonCode = analyzePythonCode;
exports.analyzeDiffPythonCode = analyzeDiffPythonCode;
/**
 * This function executes 2 tasks:
 *  * analyze activity attempts and store result into firebase
 *  * analyze python code (for jupyter-related activities)
 *
 * @param {String} activityKey
 * @param {String} userKey
 * @param {*} solution
 * @returns {admin.database.ThenableReference}
 */
exports.handler = (activityKey, userKey, solution) =>
  Promise.all([
    analyzePythonCode(activityKey, userKey, solution),
    analyzeDiffPythonCode(activityKey, userKey, solution),
    admin
      .database()
      .ref("/logged_events")
      .orderByChild("createdAt")
      .startAt(new Date().getTime() - ONE_HOURS)
      .once("value")
      .then(snap => snap.val())
      .then(events => Object.keys(events || {}).map(key => events[key]))
      .then(data => {
        let inSession = true;
        let startedTime = 0;
        let attemptsCount = 0;

        // Filter actions only related to last user session
        for (let i = data.length - 1; i >= 0; i--) {
          const action = data[i];
          if (
            action.type === "PROBLEM_INIT_SUCCESS" &&
            action.otherActionData.problemId === activityKey
          ) {
            startedTime = action.createdAt;
            inSession = false;
          }
          if (!inSession) break;
          switch (action.type) {
            case "PROBLEM_SOLUTION_REFRESH_REQUEST":
              if (action.otherActionData.problemId === activityKey) {
                attemptsCount += 1;
              }
              break;
            // FIXIT: add problemId key to action creator invocation
            case "PROBLEM_SOLUTION_SUBMIT_FAIL":
              attemptsCount += 1;
              break;
            default:
          }
        }
        return {
          startedTime,
          attemptsCount
        };
      })
      .then(processingResult =>
        admin
          .database()
          .ref("/analyze/processActivities")
          .push({
            activityKey: activityKey,
            userKey: userKey,
            spentTime:
              processingResult.startedTime &&
              new Date().getTime() - processingResult.startedTime,
            attemptsCount: processingResult.attemptsCount,
            completedAt: {
              ".sv": "timestamp"
            }
          })
      )
  ]);
