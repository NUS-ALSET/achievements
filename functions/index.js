/* eslint-disable no-magic-numbers */

const functions = require("firebase-functions");
const admin = require("firebase-admin");
const Queue = require("firebase-queue");
const axios = require("axios");

const ERROR_401 = 401;
const profilesRefreshApproach =
  (functions.config().profiles &&
    functions.config().profiles["refresh-approach"]) ||
  "none";
const jupyterLambdaProcessor =
  "https://9ceqb24lg2.execute-api.ap-southeast-1.amazonaws.com/Prod";

admin.initializeApp();

function processProfileRefreshRequest(data, resolve) {
  switch (data.service) {
    case "CodeCombat":
      return admin
        .database()
        .ref(`/userAchievements/${data.uid}/${data.service}/achievements`)
        .once("value")
        .then(existing => existing.val() || {})
        .then(existing =>
          axios
            .get(
              `https://codecombat.com/db/user/${data.serviceId
                .toLowerCase()
                .replace(/[ _]/g, "-")
                .replace(
                  /[!@#$%^&*()]/g,
                  ""
                )}/level.sessions?project=state.complete,levelID,` +
                "levelName,playtime,codeLanguage,created"
            )
            .then(response =>
              response.data.filter(
                levelInfo =>
                  levelInfo &&
                  levelInfo.levelID &&
                  levelInfo.state &&
                  levelInfo.state.complete
              )
            )
            .then(levels => {
              let achievements = false;
              let events = false;

              levels.forEach(levelInfo => {
                if (!existing[levelInfo.levelID]) {
                  achievements = achievements || {};
                  events = events || {};
                  achievements[levelInfo.levelID] = {
                    name: levelInfo.levelName,
                    created: levelInfo.created || "",
                    playtime: (levelInfo && levelInfo.playtime) || 0,
                    complete: true
                  };
                  const newEventKey = admin
                    .database()
                    .ref("/logged_events")
                    .push().key;
                  events[newEventKey] = {
                    createdAt: {
                      ".sv": "timestamp"
                    },
                    isAnonymous: true,
                    type: "UPDATE_ACHIEVEMENTS_DATA",
                    otherActionData: {
                      uid: data.uid,
                      levelId: levelInfo.levelID,
                      complete: true,
                      created: levelInfo.created || "",
                      playtime: (levelInfo && levelInfo.playtime) || 0
                    }
                  };
                }
                return true;
              });

              return admin
                .database()
                .ref(`/userAchievements/${data.uid}/${data.service}`)
                .update({
                  lastUpdate: new Date().getTime(),
                  totalAchievements: levels.filter(
                    levelInfo =>
                      levelInfo && levelInfo.state && levelInfo.state.complete
                  ).length
                })
                .then(
                  achievements
                    ? admin
                        .database()
                        .ref(
                          `/userAchievements/${data.uid}/${
                            data.service
                          }/achievements`
                        )
                        .update(achievements)
                    : Promise.resolve()
                )
                .then(
                  events
                    ? admin
                        .database()
                        .ref("/logged_events")
                        .update(events)
                    : Promise.resolve()
                );
            })

            .then(() => resolve())
        )
        .catch(err => console.error(err.message) || resolve());
    default:
      return Promise.resolve();
  }
}

exports.handleNewProblemSolution =
  ["trigger", "both"].includes(profilesRefreshApproach) &&
  functions.database
    .ref("/jupyterSolutionsQueue/solutions/{studentId}/{problemId}/{requestId}")
    .onWrite((change, context) => {
      const { requestId } = context.params;
      axios({
        url: jupyterLambdaProcessor,
        method: "post",
        data: change.after.val()
      })
        .then(() =>
          admin
            .database()
            .ref(`/jupyterSolutionsQueue/answers/${requestId}`)
            .set(true)
        )
        .catch(() =>
          admin
            .database()
            .ref(`/jupyterSolutionsQueue/answers/${requestId}`)
            .set(false)
        );
    });

exports.handleProblemSolutionQueue = functions.https.onRequest((req, res) => {
  const { token } = req.query;

  if (!token) {
    return res.status(ERROR_401).send("Token is missing");
  }

  admin
    .database()
    .ref("api_tokens/" + token)
    .once("value")
    .then(snapshot => {
      if (!snapshot.val()) {
        return res.status(ERROR_401).send("Invalid token");
      }

      const queue = new Queue(
        admin.database().ref("/jupyterSolutionsQueue"),
        (data, progress, resolve) =>
          axios({
            url: jupyterLambdaProcessor,
            method: "post",
            data: data.solution
          })
            .then(() =>
              admin
                .database()
                .ref(`/jupyterSolutionsQueue/answers/${data.taskKey}`)
                .set(true)
            )
            .catch(() =>
              admin
                .database()
                .ref(`/jupyterSolutionsQueue/answers/${data.taskKey}`)
                .set(false)
            )
            .then(() => resolve())
      );
      queue.addWorker();
      res.send("Done");
    });
});

exports.handleNewSolution = functions.database
  .ref("/solutions/{courseId}/{studentId}/{assignmentId}")
  .onWrite((change, context) => {
    const { courseId, studentId, assignmentId } = context.params;

    return admin
      .database()
      .ref(`/assignments/${courseId}/${assignmentId}`)
      .once("value")
      .then(assignment => {
        assignment = assignment.val();
        // Fixit: add more assignment conditions
        // We should process only solutions for actual assignments
        if (assignment.visible) {
          return admin
            .database()
            .ref(`/visibleSolutions/${courseId}/${studentId}/${assignmentId}`)
            .set(
              assignment.solutionVisible
                ? change.after.val()
                : Object.assign(change.after.val(), { value: "Complete" })
            );
        }
        return true;
      });
  });

exports.handleProfileRefreshRequest =
  ["trigger", "both"].includes(profilesRefreshApproach) &&
  functions.database
    .ref("/updateProfileQueue/tasks/{requestId}")
    .onCreate((snap, context) =>
      new Promise(resolve =>
        processProfileRefreshRequest(snap.val(), resolve)
      ).then(() =>
        admin.database
          .ref(`/updateProfileQueue/tasks/${context.params.requestId}`)
          .remove()
      )
    );

exports.handleProfileQueue = functions.https.onRequest((req, res) => {
  const { token } = req.query;

  if (!token) {
    return res.status(ERROR_401).send("Token is missing");
  }

  admin
    .database()
    .ref("api_tokens/" + token)
    .once("value")
    .then(snapshot => {
      if (!snapshot.val()) {
        return res.status(ERROR_401).send("Invalid token");
      }

      const queue = new Queue(
        admin.database().ref("/updateProfileQueue"),
        (data, progress, resolve) => {
          return processProfileRefreshRequest(data, resolve);
        }
      );

      queue.addWorker();
      res.send("Done");
    });
});

exports.downloadEvents = functions.https.onRequest((req, res) => {
  const { token, start, stop = 0 } = req.query;

  if (token) {
    admin
      .database()
      .ref("api_tokens/" + token)
      .once("value")
      .then(snapshot => {
        if (snapshot.val()) {
          const ref = admin.database().ref("logged_events");
          let promise;
          let startFrom;
          let stopAt;

          if (!start) {
            if (stop) {
              stopAt = Date.now() - stop * 24 * 60 * 60 * 1000;
              promise = ref
                .once("value")
                .orderByChild("createdAt")
                .endAt(stopAt);
            } else {
              promise = ref.once("value");
            }
          } else {
            if (stop) {
              stopAt = Date.now() - stop * 24 * 60 * 60 * 1000;
              startFrom = Date.now() - (start + 1) * 24 * 60 * 60 * 1000;
              promise = ref
                .orderByChild("createdAt")
                .startAt(startFrom)
                .endAt(stopAt)
                .once("value");
            } else {
              startFrom = Date.now() - (start + 1) * 24 * 60 * 60 * 1000;
              promise = ref
                .orderByChild("createdAt")
                .startAt(startFrom)
                .once("value");
            }
          }

          promise.then(snapshot2 => {
            const log_object = snapshot2.val();
            if (log_object) {
              res.send(log_object);
            } else {
              res.send("No data");
            }
          });
        } else {
          res.send("Invalid token");
        }
      });
  } else {
    res.send("Token is missing ");
  }
});
