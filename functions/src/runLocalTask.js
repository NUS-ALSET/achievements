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

  const checkIfUrlIsFromColab = /https:\/\/colab.research.google.com\/drive\/([^/&?#]+)/.exec(
    task.url
  );
  if (
    checkIfUrlIsFromColab &&
    checkIfUrlIsFromColab[0] &&
    checkIfUrlIsFromColab[1]
  ) {
    // fetch notebook from url
    const docId = checkIfUrlIsFromColab[1];
    const googleUrl = "https://drive.google.com/uc?export=download&id=" + docId;
    return axios({
      url: googleUrl,
      method: "get"
    }).then(response => {
      // post to jupyter execution lambda function
      // important to return nested promises
      return admin
        .database()
        .ref("/config/jupyterLambdaProcessor")
        .once("value")
        .then(lambdaProcessor => lambdaProcessor.val())
        .then(lambdaProcessor => {
          return axios({
            url: lambdaProcessor || jupyterLambdaProcessor,
            method: "post",
            data: {
              notebook: response.data,
              files: {
                "data.json": Buffer.from(
                  JSON.stringify(request["editable"][0])
                ).toString("base64")
              }
            }
          }).then(nextResponse => {
            const {
              data: data,
              data: { results, result }
            } = nextResponse;
            if (results) {
              if ("jsonFeedback" in results) {
                results.jsonFeedback =
                  typeof results.jsonFeedback == "string"
                    ? JSON.parse(results.jsonFeedback)
                    : results.jsonFeedback;
              }
              if ("ipynb" in data) {
                results["ipynbFeedback"] = "";
                results["ipynbFeedback"] = data["ipynb"];
              }
              return results;
            } else if (result) {
              const parsedResult = JSON.parse(result);
              if ("jsonFeedback" in parsedResult) {
                parsedResult.jsonFeedback =
                  typeof parsedResult.jsonFeedback == "string"
                    ? JSON.parse(parsedResult.jsonFeedback)
                    : parsedResult.jsonFeedback;
              }
              if ("ipynb" in data) {
                parsedResult["ipynbFeedback"] = "";
                parsedResult["ipynbFeedback"] = data["ipynb"];
              }
              return parsedResult;
            }
          });
        });
    });
  } else {
    return axios({
      method: "post",
      headers: { "content-type": "application/json" },
      timeout: CALL_TIMEOUT,
      url: task.url,
      data: request
    }).then(response => {
      return response.data;
    });
  }
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
