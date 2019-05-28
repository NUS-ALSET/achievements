const admin = require("firebase-admin");
const functions = require("firebase-functions");
const axios = require("axios");

// const executeJupyterSolution = require("./executeJupyterSolution");

const CALL_TIMEOUT = 50000;

const jupyterLambdaProcessor =
  "https://bi3umkz9u7.execute-api.ap-southeast-1.amazonaws.com" +
  "/prod/notebook_runner";

function runJupyterTask(owner, task, solution) {
  return admin
    .database()
    .ref("/config/jupyterLambdaProcessor")
    .once("value")
    .then(lambdaProcessor => lambdaProcessor.val())
    .then(lambdaProcessor =>
      axios({
        url: lambdaProcessor || jupyterLambdaProcessor,
        method: "post",
        data: { notebook: JSON.parse(solution) }
      })
    )
    .then(response => JSON.stringify(response.data.ipynb));
}

function runCustomTask(uid, task, solution) {
  const json = JSON.parse(task.json);
  const request = {};
  request["userToken"] = uid.slice(0, 5);
  for (const [index, cell] of json.cells.entries()) {
    switch (cell.metadata.achievements.type) {
      case "shown":
      case "hidden":
        request[cell.metadata.achievements.type] = {
          0: cell.source.join("\n")
        };
        break;
      case "editable":
        request[cell.metadata.achievements.type] = {
          0: solution
        };
        break;
      default:
        request[`public${index}`] = {
          [cell.metadata.achievements.index]: cell.source.join("\n")
        };
    }
  }
  return axios({
    method: "post",
    headers: { "content-type": "application/json" },
    timeout: CALL_TIMEOUT,
    url: task.url,
    data: request
  }).then(response => response.data);
}

/**
 *
 * @param {Object} data
 * @param {String} data.taskId
 * @param {String} data.url
 * @param {*} data.solution
 * @param {Object} context
 * @param {Object} context.auth
 * @param {String} context.auth.uid
 */
function runLocalTask(data, context) {
  return admin
    .database()
    .ref(`/tasks/${data.taskId}`)
    .once("value")
    .then(snap => snap.val())
    .then(task => {
      switch (task.type) {
        case "jupyter":
          return runJupyterTask(context.auth.uid, task, data.solution);
        case "custom":
          return runCustomTask(context.auth.uid, task, data.solution);
        default:
          throw new Error("Unsupported task/activity type");
      }
    })
    .catch(err => {
      throw new functions.https.HttpsError("internal", err.message);
    });
}

exports.handler = runLocalTask;
