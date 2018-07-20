const admin = require("firebase-admin");

const updateBothSkills = require("./analyzeSolutions");

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

async function analyzePublicPathSol() {
  const pubPath = await getPubPaths();
  const pubQns = await getPubQns(pubPath);
  // console.log(pubQns)
  const pubSol = await getSolutions(pubQns);
  console.log(solForPublicProblems)
  await updateBothSkills.updateBothSkills(solForPublicProblems);
  console.log("done")
}

exports.analyzeSolutionsForPublicPaths = analyzePublicPathSol;
