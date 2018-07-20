const admin = require("firebase-admin");

const updateSkills = require("./analyzeSolutions");

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
  await updateSkills.updateBothSkills(reformattedSingleSol);
  console.log("done here")
}

// reformatData("-LEgrNOmnWsFkr6nFHwO", "eVJVC9kde3QSiXAP989kivD9SZn2")

exports.analyzeSolution = reformatData;
