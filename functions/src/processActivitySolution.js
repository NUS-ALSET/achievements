const admin = require("firebase-admin");
const ONE_HOURS = 3600000;

/**
 *
 * @param {String} activityKey
 * @param {String} userKey
 * @returns {admin.database.ThenableReference}
 */
exports.handler = (activityKey, userKey) =>
  admin
    .database()
    .ref("/logged_events")
    .orderByChild("createdAt")
    .startAt(new Date().getTime() - ONE_HOURS)
    .once("value")
    .then(snap => snap.val())
    .then(events => Object.keys(events).map(key => events[key]))
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
    );
