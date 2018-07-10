/* eslint-disable no-magic-numbers */

const functions = require("firebase-functions");
const admin = require("firebase-admin");

const checkToken = require("./src/utils/checkToken");

const api = require("./src/api");
const ltiLogin = require("./src/ltiLogin");
const profileTriggers = require("./src/updateProfile");
const jupyterTrigger = require("./src/executeJupyterSolution");
const downloadEvents = require("./src/downloadEvents");
const solutionTriggers = require("./src/updateSolutionVisibility");
const httpUtil= require("./src/utils/http").httpUtil;
const pubPathSol = require("./src/analyzeSolutionsForPublicPaths");
const singleSol = require("./src/analyzeSolution");


const profilesRefreshApproach =
  (functions.config().profiles &&
    functions.config().profiles["refresh-approach"]) ||
  "none";
const ERROR_500 = 500;

admin.initializeApp();

exports.handleNewProblemSolution =
  ["trigger", "both"].includes(profilesRefreshApproach) &&
  functions.database
    .ref("/jupyterSolutionsQueue/tasks/{requestId}")
    .onWrite(change => {
      const data = change.after.val();
      jupyterTrigger.handler(data, data.taskKey, data.owner);
    });

exports.handleProblemSolutionQueue = functions.https.onRequest((req, res) => {
  return checkToken(req)
    .then(() => {
      exports.queueHandler();
      res.send("Done");
    })
    .catch(err => res.status(err.code || ERROR_500).send(err.message));
});

exports.handleNewSolution = functions.database
  .ref("/solutions/{courseId}/{studentId}/{assignmentId}")
  .onWrite((change, context) => {
    const { courseId, studentId, assignmentId } = context.params;

    solutionTriggers.handler(
      change.after.val(),
      courseId,
      studentId,
      assignmentId
    );
  });

exports.handleProfileRefreshRequest =
  ["trigger", "both"].includes(profilesRefreshApproach) &&
  functions.database
    .ref("/updateProfileQueue/tasks/{requestId}")
    .onCreate((snap, context) =>
      new Promise(resolve => profileTriggers.handler(snap.val(), resolve)).then(
        () =>
          admin
            .database()
            .ref(`/updateProfileQueue/tasks/${context.params.requestId}`)
            .remove()
      )
    );
exports.handleProfileQueue = functions.https.onRequest((req, res) => {
  return checkToken(req)
    .then(() => {
      exports.queueHandler();
      res.send("Done");
    })
    .catch(err => res.status(err.code || ERROR_500).send(err.message));
});

exports.api = functions.https.onRequest((req, res) => {
  let { token, data } = req.query;

  api.handler(token, data).then(output => res.send(output));
});

exports.ltiLogin = functions.https.onRequest(ltiLogin.handler);

exports.downloadEvents = downloadEvents.httpTrigger;

// Fetch some JSON data from a remote site when npm start is running.
exports.getTest = functions.https.onRequest((req, res) => {
  const url = "https://s3-ap-southeast-1.amazonaws.com/alset-public/example_solutions.json"
  data = {};
  httpUtil.call(url, "get", data).then((resp) => {
    res.status(200).send(resp);
  })
});

// Post data to a remote url and get json data back.
exports.postTest = functions.https.onRequest((req, res) => {
  const url = "https://9dq7wcv20e.execute-api.us-west-2.amazonaws.com/dev/yrtest2"
  // Example of a ast parsing tasks sent to AWS lambda.
  data = {"A":{"B":"print('hi')"}};
  httpUtil.call(url, "post", data).then((resp) => {
    res.status(200).send(resp);
  })

});

exports.updateFPP = functions.https.onRequest((request, response) => {

  async function getUserandProblemSkills() {
    var allUserSkills = {}
    const userskillsroute = admin.database().ref("userSkills/").once("value").then(snapshot => {
      allUserSkills = snapshot.val();
    })
    var allProblemSkills = {}
    const probskillsroute = admin.database().ref("problemSkills/").once("value").then(snapshot => {
      allProblemSkills = snapshot.val();
    })
    await userskillsroute
    await probskillsroute
    var skills = {"problemSkills": allProblemSkills, "userSkills": allUserSkills};
    // console.log(skills)
    return skills;
  }

  async function callURL() {
    const url = "https://3m8uotrai2.execute-api.us-west-2.amazonaws.com/dev/calculateFPP"
    var small_sol = {'-LFGoFBJ7Ot4oC_jqfqD': {'TOT2Pe5KKIe8QufgPxM2S22VqHv1': '# def a function to return a and b combined with a space\ndef combineWord(a, b):\n    s = " "\n    seq = [a,b]\n    return s.join(seq)\n'}};
    var master = await getUserandProblemSkills();
    var data = {"master_dic": master, "student_solutions": small_sol};

    const result = await httpUtil.call(url, "post", data);
    console.log(result)
    return result
  }

  callURL();

  response.status(200).send("checkkk")

});

exports.analyzeSolutionGivenUserAndProbKey = functions.https.onRequest((req, res) => {

  singleSol.analyzeSolution("-LEgrNOmnWsFkr6nFHwO", "eVJVC9kde3QSiXAP989kivD9SZn2")

  res.status(200).send("FUNCTION ONE ERROR-FREE~ ^^");
});

exports.analyzeSolutionsForPublicPaths = functions.https.onRequest((request, response) => {
  pubPathSol.analyzeSolutionsForPublicPaths();
  response.status(200).send("PART TWO DONE :D")
})
