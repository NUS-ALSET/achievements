const admin = require("firebase-admin");
const httpUtil = require("./utils/http").httpUtil;
const ONE_HOURS = 3600000;

/**
 * Checks Python activities solutions for skills via lambda function
 * and store result into firestore
 * @param {String} activityKey
 * @param {String} userKey
 * @param {Object} data
 */

function analyzeDiffPythonCode(activityKey, userKey, data) {
  let logged_data = Object.assign({}, data);
  if ("solution" in logged_data) {
    delete logged_data.solution;
  }
  logged_data["triggerType"] = "processActivitySolution";
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
    switch (activity.type) {
      case "jupyterInline":
        let solution = JSON.parse(data.solution);
        let b1 = solution.result.cells; //given notebook cells
        let b2 = solution.cells; // solution notebook cells
        let result = {};
        // get given and solution code by comparing the code cell for changes
        b1.filter(
          o =>
            !b2.some(v => {
              if (
                "code" === v.cell_type &&
                v.cell_type === o.cell_type &&
                v.metadata.id === o.metadata.id &&
                !(v.source.join() === o.source.join())
              ) {
                result = {
                  solutionCode: v.source.join(""),
                  givenCode: o.source.join("")
                };
              }
            })
        );
        return httpUtil
          .post(analyzeUrl, result)
          .then(response =>
            admin
              .firestore()
              .collection("/logged_events")
              .add({
                uid: userKey,
                createdAt: admin.firestore.Timestamp.now().toMillis(),
                activityKey: activityKey,
                sGen: true,
                language: "Python 3",
                difference: response.difference,
                solutionFeatures: response.solutionFeatures,
                type: "CODE_ANALYSIS",
                pathKey: activity.path,
                activityId: activityKey,
                pathId: activity.path
              })
          )
          .catch(err =>
            admin
              .firestore()
              .collection("/logged_events")
              .add({
                uid: userKey,
                createdAt: admin.firestore.Timestamp.now().toMillis(),
                activityKey: activityKey,
                sGen: true,
                type: "CODE_ANALYSIS_ERROR",
                errorMsg: String(err),
                pathKey: activity.path,
                activityId: activityKey,
                pathId: activity.path
              })
          );
      default:
        return Promise.resolve();
    }
  });
}

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
    analyzeDiffPythonCode(activityKey, userKey, solution),
    admin
      .firestore()
      .collection("/logged_events")
      .orderBy("createdAt")
      .startAt(new Date().getTime() - ONE_HOURS)
      .get()
      .then(querySnapshot => {
        let temp = [];
        querySnapshot.forEach(doc => {
          temp.push(doc.data());
        });
        return temp;
      })
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
      .catch(err => console.error(err))
  ]);
