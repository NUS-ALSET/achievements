const admin = require("firebase-admin");
const axios = require("axios");
const Queue = require("firebase-queue");

const jupyterLambdaProcessor =
  "https://bi3umkz9u7.execute-api.ap-southeast-1.amazonaws.com" +
  "/prod/notebook_runner";

const executeJupyterSolution = (data, taskKey, owner, triggerName) => {
  let logged_data = Object.assign({}, data);
  if ("solution" in logged_data) {
    delete logged_data.solution;
  }
  logged_data["triggerType"] = triggerName;
  let lambdaReqData = { notebook: JSON.parse(data.solution) };
  if (data.files) {
    let file = JSON.parse(data.files);
    lambdaReqData.files = {
      [file.name]: file.content
    };
  }
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
      .then(snap => snap.val())
      .then(activity =>
        admin
          .firestore()
          .collection("/logged_events")
          .add({
            createdAt: Date.now(),
            type: "FIREBASE_TRIGGERS",
            uid: owner,
            sGen: true,
            activityKey: data.problem,
            pathKey: activity.path,
            pathId: activity.path,
            activityId: data.problem,
            otherActionData: logged_data
          })
      )
  ])
    .then(([lambdaProcessor]) =>
      axios({
        url: lambdaProcessor || jupyterLambdaProcessor,
        method: "post",
        data: lambdaReqData
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
      executeJupyterSolution(
        data,
        data.taskKey,
        data.owner,
        "handleProblemSolutionQueue"
      ).then(() => resolve())
  );
  queue.addWorker();
};
