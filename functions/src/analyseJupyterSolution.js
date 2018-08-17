const admin = require("firebase-admin");
const axios = require("axios");
const Queue = require("firebase-queue");

const jupyterAnalysisLambdaProcessor =
  "https://ltp7y8q1ak.execute-api.ap-southeast-1.amazonaws.com/default/code_analysis";

const analyseJupyterSolution = (data, taskKey, owner) => {
  return admin
    .database()
    .ref("/config/jupyterAnalysisLambdaProcessor")
    .once("value")
    .then(lambdaProcessor => lambdaProcessor.val())
    .then(lambdaProcessor =>
      axios({
        url: lambdaProcessor || jupyterAnalysisLambdaProcessor,
        method: "post",
        data: {
          "problemAA": {
            "userBB":  data.solution
          }
        }
      })
    )
    .then(response =>
      admin
        .database()
        .ref(`/jupyterSolutionAnalysisQueue/responses/${taskKey}`)
        .set({
          owner: owner,
          solution:response.data,
          d : data.solution
        })
    )
    .catch(err => {
      return (
        console.error(err.message) ||
        admin
          .database()
          .ref(`/jupyterSolutionAnalysisQueue/responses/${taskKey}`)
          .set(false)
      );
    })
    .then(() =>
      admin
        .database()
        .ref(`/jupyterSolutionAnalysisQueue/answers/${taskKey}`)
        .remove()
    );
};

exports.handler = analyseJupyterSolution;

exports.queueHandler = () => {
  const queue = new Queue(
    admin.database().ref("/jupyterSolutionAnalysisQueue"),
    (data, progress, resolve) =>
    analyseJupyterSolution(data, data.taskKey, data.owner).then(() =>
        resolve()
      )
    
  );
  queue.addWorker();
};
