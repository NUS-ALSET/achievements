const admin = require("firebase-admin");
const axios = require("axios");
const Queue = require("firebase-queue");

const jupyterLambdaProcessor =
  "https://o6rpv1ofri.execute-api.ap-southeast-1.amazonaws.com/Prod";

const executeJupyterSolution = (data, taskKey, owner) => {
  return admin
    .database()
    .ref("/config/jupyterLambdaProcessor")
    .once("value")
    .then(lambdaProcessor => lambdaProcessor.val())
    .then(lambdaProcessor =>
      axios({
        url: lambdaProcessor || jupyterLambdaProcessor,
        method: "post",
        data: { notebook: data.solution }
      })
    )
    .then(response =>
      admin
        .database()
        .ref(`/jupyterSolutionsQueue/responses/${taskKey}`)
        .set({
          owner: owner,
          solution: JSON.stringify(response.data.ipynb)
        })
    )
    .catch(err => {
      return (
        console.error(err.message) ||
        admin
          .database()
          .ref(`/jupyterSolutionsQueue/responses/${taskKey}`)
          .set(false)
      );
    })
    .then(() =>
      admin
        .database()
        .ref(`/jupyterSolutionsQueue/answers/${taskKey}`)
        .remove()
    );
};

exports.handler = executeJupyterSolution;

exports.queueHandler = () => {
  const queue = new Queue(
    admin.database().ref("/jupyterSolutionsQueue"),
    (data, progress, resolve) =>
      executeJupyterSolution(data, data.taskKey, data.owner).then(() =>
        resolve()
      )
  );
  queue.addWorker();
};
