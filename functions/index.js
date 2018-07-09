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
const updateSkills = require("./src/updateSkills");

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

  // function to format data into desired dictionary:
  const formatData = (qns, user, data, result) => {
    // console.log(data["cells"][0]["source"])
    result[qns] = {}
    result[qns][user] = {}
    result[qns][user] = data["cells"][0]["source"]
    return result
  }

  // function to retrieve "problemSolutions" node from database:
  async function getSpecificSolutions (probkey, userkey) {
    var rawSingleSol = null;
    const specificRoute = admin.database().ref(`problemSolutions/${probkey}/${userkey}/`).once("value").then(snapshot => {
      // console.log(snapshot.val())
      rawSingleSol = snapshot.val();
    })
    await specificRoute
    return rawSingleSol;
  }

  // create a dictionary to store output
  var reformattedSingleSol = {}

  // async function to do await
  async function reformatData(probkey, userkey) {
    var rawSingleSolPromise = await getSpecificSolutions(probkey, userkey);
    const formatDataPromise = formatData(probkey, userkey, rawSingleSolPromise, reformattedSingleSol);
    await formatDataPromise;
    console.log(reformattedSingleSol)
  }

  reformatData("-LEgrNOmnWsFkr6nFHwO", "eVJVC9kde3QSiXAP989kivD9SZn2")

  res.status(200).send("FUNCTION ONE ERROR-FREE~ ^^");
});

exports.analyzeSolutionsForPublicPaths = functions.https.onRequest((request, response) => {
  // variable to store a list of all public paths:
  var allPublicPaths = []

  // 1. extract out all public paths:
  async function getPubPaths() {
    const pathRoute = admin.database().ref("paths/").once("value").then(snapshot => {
      const bigPathDic = snapshot.val();
      for (var pathkey in bigPathDic) {
        var pathInfo = bigPathDic[pathkey];
        if(pathInfo.hasOwnProperty("isPublic")) {
          allPublicPaths.push(pathkey);
        }
      }
    })
    await pathRoute
    // console.log(allPublicPaths)
    return allPublicPaths
  }

  // getPubPaths()

  // variable to store all problems that belong to public paths:
  var allPublicPathProblems = []

  // 2. extract out all problems that belong to public paths:
  async function getPubQns(pubPathList) {
    const qnsRoute = admin.database().ref("problems/").once("value").then(snapshot => {
      const bigQnsDic = snapshot.val();
      for (var user in bigQnsDic) {
        var probDic = bigQnsDic[user];
        for (var prob in probDic) {
          var probInfo = probDic[prob];
          if (probInfo.hasOwnProperty("path")) {
            pathDetail = probInfo["path"];
            if(pubPathList.includes(pathDetail)) {
              allPublicPathProblems.push(prob);
            }
          }
        }
      }
    })
    await qnsRoute
    // console.log(allPublicPathProblems)
    return allPublicPathProblems
  }

  // Create a dictionary to store solution dictionary
  var solForPublicProblems = {}

  // 3. retrieve all the solutions to the public qns
  async function getSolutions(pubQnsList) {
    const qnsRoute = admin.database().ref("problemSolutions/").once("value").then(snapshot => {
      var bigSolDic = snapshot.val();
      for (var probkey in bigSolDic) {
        if (pubQnsList.includes(probkey)) {
          var userSolDic = bigSolDic[probkey];
          for (var userkey in userSolDic) {
            var usersol = userSolDic[userkey];
            if (usersol.hasOwnProperty("cells")) {
              // if problemkey not in dic, create new entry
              if (!(probkey in solForPublicProblems) ) {
                solForPublicProblems[probkey] = {}
              }
              solForPublicProblems[probkey][userkey] = usersol["cells"][0]["source"];
            }
          }
        }
      }
    })
    await qnsRoute
    // console.log(solForPublicProblems)
    return solForPublicProblems
  }

  // an async function that automatically gets called to run all the above functions
  (async() => {
    const pubPath = await getPubPaths();
    const pubQns = await getPubQns(pubPath);
    // console.log(pubQns)
    const pubSol = await getSolutions(pubQns);
    console.log(solForPublicProblems)
  }) ()

  response.status(200).send("PART TWO DONE :D")
})


exports.yrtest = functions.https.onRequest((request, response) => {
  updateSkills.updateBothSkills({"problemSkills": {"problems": {"oneSkillType": {"skillFeature": {"sausage": true}}}}, "userSkills": {"cherry": {"function": {"next": {"c": true}}}}})

  response.status(200).send("YR TEST SUCCESS :DD")
})
