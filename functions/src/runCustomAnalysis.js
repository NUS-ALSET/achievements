const admin = require("firebase-admin");
const functions = require("firebase-functions");
const axios = require("axios");

const CALL_TIMEOUT = 50000;

const jupyterLambdaProcessor =
  "https://bi3umkz9u7.execute-api.ap-southeast-1.amazonaws.com" +
  "/prod/notebook_runner";

function runCloudFuncAnalysis(uid, customAnalysisUrl, solutions, analysisID) {
  console.log("In cloud function");
  return axios({
    method: "post",
    headers: { "content-type": "application/json" },
    timeout: CALL_TIMEOUT,
    url: customAnalysisUrl,
    data: solutions
  }).then(response => JSON.stringify(response.data));
}

function runJupyterAnalysis(analysisNotebook, solutions) {
  console.log("In jupyter");
  return admin
    .database()
    .ref("/config/jupyterLambdaProcessor")
    .once("value")
    .then(lambdaProcessor => lambdaProcessor.val())
    .then(lambdaProcessor =>
      axios({
        url: lambdaProcessor || jupyterLambdaProcessor,
        headers: { "content-type": "application/json" },
        method: "post",
        timeout: CALL_TIMEOUT,
        data: {
          notebook: JSON.parse(analysisNotebook),
          files: {
            "data.json": Buffer.from(JSON.stringify(solutions)).toString(
              "base64"
            )
          }
        }
      })
    )
    .then(response => JSON.stringify(response.data));
}
/**
 *
 * @param {Object} data
 * @param {String} data.uid
 * @param {Object} data.solutions
 * @param {String} data.analysisID
 * @param {String} data.analysisType - customAnalysis or adminCustomAnalysis
 * @param {Object} context
 */
function runCustomAnalysis(data, context) {
  console.log(data);
  let firestore_node = "customAnalysis";
  if (data.analysisType) {
    firestore_node = data.analysisType;
  }
  return admin
    .firestore()
    .collection(`/${firestore_node}`)
    .doc(data.analysisID)
    .get()
    .then(doc => {
      let customAnalysis = doc.data();
      switch (customAnalysis.type) {
        case "cloudFunction":
          console.log("Cloud function being called");
          return runCloudFuncAnalysis(
            data.uid,
            customAnalysis.url,
            data.solutions,
            data.analysisID
          );
        case "jupyter":
          console.log("Jupyter notebook being called");
          return runJupyterAnalysis(
            customAnalysis.analysisNotebook,
            data.solutions
          );
        default:
          throw new Error("Unsupported analysis type");
      }
    })
    .catch(err => {
      throw new functions.https.HttpsError("internal", err.message);
    });
}

exports.handler = runCustomAnalysis;
