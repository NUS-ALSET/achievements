const admin = require("firebase-admin");
const functions = require("firebase-functions");
const axios = require("axios");

// const executeJupyterSolution = require("./executeJupyterSolution");

const CALL_TIMEOUT = 50000;

function runCustomTask(task, solution) {
  const json = JSON.parse(task.json);
  const request = {};
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
 */
function runLocalTask(data) {
  return admin
    .database()
    .ref(`/tasks/${data.taskId}`)
    .once("value")
    .then(snap => snap.val())
    .then(task => {
      switch (task.type) {
        case "custom":
          return runCustomTask(task, data.solution);
        default:
          throw new Error("Unsupported task/activity type");
      }
    })
    .catch(err => {
      throw new functions.https.HttpsError("internal", err.message);
    });
}

exports.handler = runLocalTask;
