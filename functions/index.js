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

exports.yrtest = functions.https.onRequest((req, res) => {
  // Function to format the data:
  const formatData = (qns, user, data, result) => {
    // console.log(data["cells"][0]["source"])
    result[qns] = {}
    result[qns][user] = {}
    result[qns][user] = data["cells"][0]["source"]
    return new Promise((resolve, reject) => {
      resolve(result);
      reject(new Error("error inside formatData function"));
      setTimeout(() => resolve("..."));
    })
  }

  // PART 1: FORMATTING RESULTING DICTIONARY FROM
  // SPECIFIED USER AND PROB KEY INTO DESIRED DICT
  var newSol = {};
  // use recursion to do synchrous requests
  const getSolDict = (d, probkey, userkey, callback) => {
    var rawSol = admin.database().ref(`problemSolutions/${probkey}/${userkey}/`).once("value").then(snapshot => {
        // var formatPromise = formatData(probkey, userkey, snapshot.val(), d);
        // formatPromise.then(function(respond) {
        //   console.log(respond)
        // }), function(error) {
        //   console.error("Something went wrong here", error);
        // }

        // callback(probkey, userkey, snapshot.val(), d);

    });
  }

  // Use this line to find the solution for a particular problemKey and userKey
  getSolDict(newSol, "-LEgrNOmnWsFkr6nFHwO", "eVJVC9kde3QSiXAP989kivD9SZn2", formatData);
  console.log(newSol)
/*
  // PART 2: MAKE A DICT THAT MATCHES ALL PROBS TO PUB PATHS
  const allPubPath = [];
  const pubPathQns = [];
  // use recursion to do find a list of public paths
  const findPubPath = (pubPathDict) => {
    const pathNode = admin.database().ref(`paths/`).once("value").then(snapshot => {
      const bigPathDic = snapshot.val();
      for (var pathkey in bigPathDic) {
        var pathInfo = bigPathDic[pathkey];
        if(pathInfo.hasOwnProperty("isPublic")) {
          pubPathDict.push(pathkey);
        }
      }
      return new Promise((resolve, reject) => {
        resolve(pubPathDict);
        reject("something wrong with finding public paths");
        setTimeout(() => resolve("..."));
      })
    });
  }

  const obtainQns = (data, pubPathList, allPubQns) => {
    for (var prob in data) {
      var probInfo = data[prob]
      for (var probkey in probInfo) {
        var innerInfo = probInfo[probkey];
        if(innerInfo.hasOwnProperty("path")) {
          if (pubPathList.includes(innerInfo["path"])) {
            allPubQns.push(probkey);
            // console.log(allPubQns)
          }
        }
      }
    }
    return new Promise((resolve, reject) => {
      resolve(allPubQns)
      reject("cant find pub path qns");
      setTimeout(() => resolve("..."));
    })
  }

  const getPubQns = (allPubQns, pubPathList) => {
    const problemRoute = admin.database().ref(`assignments/`).once("value").then(snapshot => {
      const bigProblemDict = snapshot.val();
      // var getPubQnsPromise = getPubQns(pubPathQns, ['-LAWnzTF7CfElqEPc8Eg']);
      var obtainQnsPromise = obtainQns(bigProblemDict, pubPathList, allPubQns);
      obtainQnsPromise.then(function(responds) {
        // console.log(responds)
      }), function(error) {
        console.error("haha siao liao", error);
      }
      console.log(allPubQns)
    })
  }

  // outside here, pubPathQns is still empty

  // var findPubPathPromise = findPubPath(allPubPath);
  // findPubPathPromise.then(function(respo) {
  //   console.log(respo);
  // }), function(error) {
  //   console.error("gg", error);
  // }



  // PART 3: POST TO LAMBDA AND UPDATE IF ANY NEW NODES

  // ################## DOESNT WORK: ##############################
  // newdict = {'-LFGoFBJ7Ot4oC_jqfqD': {'TOT2Pe5KKIe8QufgPxM2S22VqHv1': '# def a function to return a and b combined with a space\ndef combineWord(a, b):\n    s = " "\n    seq = [a,b]\n    return s.join(seq)\n'}}
  // httpUtil.call("https://9dq7wcv20e.execute-api.us-west-2.amazonaws.com/dev/yrtest2", "post", newdict).then((resp) => {
  //   const skillsDict = resp;
  //   res.status(200).send(resp);
  // })

  // making a new httpRequest function to
*/
  res.status(200).send("YR TEST PASSED :D");
});

exports.updateFPP = functions.https.onRequest((request, response) => {
  const url = "https://3m8uotrai2.execute-api.us-west-2.amazonaws.com/dev/calculateFPP"
  var small_sol = {'-LFGoFBJ7Ot4oC_jqfqD': {'TOT2Pe5KKIe8QufgPxM2S22VqHv1': '# def a function to return a and b combined with a space\ndef combineWord(a, b):\n    s = " "\n    seq = [a,b]\n    return s.join(seq)\n'}};
  var master = {'problemSkills': {'-LFGoFBJ7Ot4oC_jqfqD': {'statements': {'Return': {'TOT2Pe5KKIe8QufgPxM2S22VqHv1': 'True'}}, 'functions': {'-join': {'TOT2Pe5KKIe8QufgPxM2S22VqHv1': 'True'}}}}, 'userSkills': {'TOT2Pe5KKIe8QufgPxM2S22VqHv1': {'statements': {'Return': {'-LFGoFBJ7Ot4oC_jqfqD': 'True'}}, 'functions': {'-join': {'-LFGoFBJ7Ot4oC_jqfqD': 'True'}}}}};
  var data = {"master_dic": master, "student_solutions": small_sol};
  // URL NOT GETTING CALLED
  httpUtil.call(url, "post", data).then((resp) => {
    res.status(200).send(resp);
  })
  response.status(200).send("DONE");
})
