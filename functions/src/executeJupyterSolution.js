const admin = require("firebase-admin");
const axios = require("axios");
const Queue = require("firebase-queue");

const jupyterLambdaProcessor =
  "https://bi3umkz9u7.execute-api.ap-southeast-1.amazonaws.com" +
  "/prod/notebook_runner";

const executeJupyterSolution = (data, taskKey, owner) => {
  let activity;
  return Promise.all([
    admin
      .database()
      .ref("/config/jupyterLambdaProcessor")
      .once("value")
      .then(lambdaProcessor => lambdaProcessor.val()),
    admin
      .database()
      .ref(`/activities/${data.problem}`)
      .once("value")
      .then(snap => (activity = snap.val()))
  ])
    .then(([lambdaProcessor]) =>
      axios({
        url: lambdaProcessor || jupyterLambdaProcessor,
        method: "post",
        data: { notebook: JSON.parse(data.solution) }
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
        .then(() => response.data.ipynb)
    )
    .catch(() =>
      admin
        .database()
        .ref(`/jupyterSolutionsQueue/responses/${taskKey}`)
        .set(false)
    )
    .then(() =>
      admin
        .database()
        .ref(`/jupyterSolutionsQueue/answers/${taskKey}`)
        .remove()
    )
    .then(() =>
      admin
        .database()
        .ref(`/jupyterSolutionsQueue/tasks/${taskKey}`)
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
