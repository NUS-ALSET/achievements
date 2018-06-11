/* eslint-disable no-magic-numbers */

const functions = require("firebase-functions");
const admin = require("firebase-admin");
const Queue = require("firebase-queue");
const axios = require("axios");

const profileTriggers = require("./src/updateProfile");

const ERROR_401 = 401;
const profilesRefreshApproach =
  (functions.config().profiles &&
    functions.config().profiles["refresh-approach"]) ||
  "none";
const jupyterLambdaProcessor =
  "https://o6rpv1ofri.execute-api.ap-southeast-1.amazonaws.com/Prod";

admin.initializeApp();

exports.handleNewProblemSolution =
  ["trigger", "both"].includes(profilesRefreshApproach) &&
  functions.database
    .ref("/jupyterSolutionsQueue/tasks/{requestId}")
    .onWrite(change => {
      const data = change.after.val().solution;
      axios({
        url: jupyterLambdaProcessor,
        method: "post",
        data: change.after.val().solution
      })
        .then(response =>
          admin
            .database()
            .ref(`/jupyterSolutionsQueue/answers/${data.taskKey}`)
            .set({
              owner: data.owner,
              solution: JSON.stringify(response.data.ipynb)
            })
        )
        .catch(() =>
          admin
            .database()
            .ref(`/jupyterSolutionsQueue/answers/${data.taskKey}`)
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
            .then(response =>
              admin
                .database()
                .ref(`/jupyterSolutionsQueue/answers/${data.taskKey}`)
                .set({
                  owner: data.owner,
                  solution: JSON.stringify(response.data.ipynb)
                })
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

exports.handleProfileRefreshRequest = profileTriggers.updateProfileDbTrigger;
exports.handleProfileQueue = profileTriggers.updateProfileHttpTrigger;

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
