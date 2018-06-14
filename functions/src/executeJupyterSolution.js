const admin = require("firebase-admin");
const axios = require("axios");
const Queue = require("firebase-queue");

const jupyterLambdaProcessor =
  "https://o6rpv1ofri.execute-api.ap-southeast-1.amazonaws.com/Prod";

const executeJupyterSolution = (data, taskKey, owner) => {
  axios({
    url: jupyterLambdaProcessor,
    method: "post",
    data: data.solution
  })
    .then(response =>
      admin
        .database()
        .ref(`/jupyterSolutionsQueue/answers/${taskKey}`)
        .set({
          owner: owner,
          solution: JSON.stringify(response.data.ipynb)
        })
    )
    .catch(
      err =>
        console.error(err.message) ||
        admin
          .database()
          .ref(`/jupyterSolutionsQueue/answers/${taskKey}`)
          .set(false)
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
