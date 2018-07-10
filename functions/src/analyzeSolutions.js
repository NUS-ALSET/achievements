const admin = require("firebase-admin");

async function userSkillsNewUser(newSkillsDict) {
  var newUserSkills = newSkillsDict["userSkills"];
  // console.log(newUserSkills)
  // create variable to store updated userSkills
  var test = {}
  const userSkillsRoute = admin.database().ref("userSkills/").once("value").then(snapshot => {
    var bigUserSkills = snapshot.val();
    // i. check if there are any new users to be added
    var newUserList = Object.keys(newUserSkills);
    var oldUserList = Object.keys(bigUserSkills);
    for (var i = 0; i<newUserList.length; i++) {
      if (!(oldUserList.includes(newUserList[i]))) {
        // create a new dictionary just to add the new user
        test[newUserList[i]] = newUserSkills[newUserList[i]];
        // admin.database().ref("userSkills/").update(test)
        console.log(test)
      }
    }
  })
  await userSkillsRoute;
  return
}

// 2(b) Making userSkillsNewSkill that handles updating userSkills with new skills
async function userSkillsNewSkill(newSkillsDict) {
  var newUserSkills = newSkillsDict["userSkills"];
  // console.log(newUserSkills)
  // create variable to store updated userSkills
  const userSkillsRoute = admin.database().ref("userSkills/").once("value").then(snapshot => {
    var bigUserSkills = snapshot.val();
    var test = {}
    for (var user in newUserSkills) {
      for (var skillTypes in newUserSkills[user]) {
        var oldSkillTypesList = Object.keys(bigUserSkills[user])
        if(!(oldSkillTypesList.includes(skillTypes))) {
          var test = {}
          // over here we create a clean new dictionary just to add in the new skillType
          test[skillTypes] = newUserSkills[user][skillTypes]
          admin.database().ref("userSkills/" + user + "/").update(test)
        }
        for (var skillFeature in newUserSkills[user][skillTypes]) {
          var oldSkillFeatures = Object.keys(bigUserSkills[user][skillTypes])
          if (!(oldSkillFeatures.includes(skillFeature))) {
            var test = {}
            // create a new dict to update for a new skill feature
            test[skillFeature] = newUserSkills[user][skillTypes][skillFeature]
            // admin.database().ref("userSkills/" + user + "/" + skillTypes + "/").update(test)
            console.log(test)
          }
        }
      }
    }
  })
  await userSkillsRoute;
  return
}

// 2(c) Making the function userSkillNewQns that handles updating userSkills with any newly attempted questions
async function userSkillsNewQns(newSkillsDict) {
  var newUserSkills = newSkillsDict["userSkills"];
  // console.log(newUserSkills)
  // create variable to store updated userSkills
  const userSkillsRoute = admin.database().ref("userSkills/").once("value").then(snapshot => {
    var bigUserSkills = snapshot.val();
    var test = {}
    for (var user in newUserSkills) {
      for (var skillTypes in newUserSkills[user]) {
        for (var skillFeature in newUserSkills[user][skillTypes]) {
          for (var qnsID in newUserSkills[user][skillTypes][skillFeature]) {
            var oldQnsList = Object.keys(bigUserSkills[user][skillTypes][skillFeature]);
            if(!(oldQnsList.includes(qnsID))) {
              var test = {}
              // create a new dictionary to add to list of qns that makes use of the skillFeature
              test[qnsID] = newUserSkills[user][skillTypes][skillFeature][qnsID]
              //admin.database().ref("userSkills/" + user + "/" + skillTypes + "/" + skillFeature + "/").update(test)
              console.log(test)
            }
          }
        }
      }
    }
  })
  await userSkillsRoute
  return
}

// 2(d) Making a function that it responsible for all updates to userSkills
async function updateUserSkills(newSkillsDict) {
  //await userSkillsNewUser(newSkillsDict)
  //await userSkillsNewSkill(newSkillsDict)
  await userSkillsNewQns(newSkillsDict)
  return
}

// 2(e) Making probSkillsNewQns which handles submission of soluions to a new qn
async function probSkillsNewQns(newSkillsDict) {
  var newProbSkills = newSkillsDict['problemSkills'];
  // create variable to store updated dictionary
  var test = {}
  const probSkillsRoute = admin.database().ref("problemSkills/").once("value").then(snapshot => {
    var bigProbSkills = snapshot.val();
    // check for any new questions
    var newQnsList = Object.keys(newProbSkills);
    var oldQnsList = Object.keys(bigProbSkills);
    for (var i = 0; i<newQnsList.length; i++) {
      if(!(oldQnsList.includes(newQnsList[i]))) {
        // create a new dictionary to be able to add to firebase
        test[newQnsList[i]] = newProbSkills[newQnsList[i]];
        //admin.database().ref("problemSkills/").update(test);
        console.log(test)
      }
    }
  })
  await probSkillsRoute;
  return
}

// 2(f) Making probSkillsNewSkill that handles new skillTypes and skillFeatures
async function probSkillsNewSkill(newSkillsDict) {
  var newProbSkills = newSkillsDict["problemSkills"];
  const problemSkillsRoute = admin.database().ref("problemSkills").once("value").then(snapshot => {
    var bigProbSkills = snapshot.val();
    var test = {}
    for (var qns in newProbSkills) {
      for (var skillTypes in newProbSkills[qns]) {
        var oldSkillTypes = Object.keys(bigProbSkills[qns]);
        if(!(oldSkillTypes.includes(skillTypes))) {
          // create variate to make new dictionary
          var test = {}
          test[skillTypes] = newProbSkills[qns][skillTypes]
          admin.database().ref("problemSkills/" + qns + "/").update(test);
        }
        for (var skillFeature in newProbSkills[qns][skillTypes]) {
          var oldSkillFeatures = Object.keys(bigProbSkills[qns][skillTypes]);
          if (!(oldSkillFeatures.includes(skillFeature))) {
            // create dictionary to update firebase
            var test = {}
            test[skillFeature] = newProbSkills[qns][skillTypes][skillFeature]
            //admin.database().ref("problemSkills/" + qns + "/" + skillTypes + "/").update(test);
          }
        }
      }
    }
  })
  await problemSkillsRoute
  return
}

// 2(g) Making probSkillsNewUser that handles new users
async function probSkillsNewUser(newSkillsDict) {
  var newProbSkills = newSkillsDict["problemSkills"];
  const problemSkillsRoute = admin.database().ref("problemSkills/").once("value").then(snapshot => {
    var bigProbSkills = snapshot.val();
    var test = {}
    for (var qns in newProbSkills) {
      for (var skillTypes in newProbSkills[qns]) {
        for (var skillFeature in newProbSkills[qns][skillTypes]) {
          for (var user in newProbSkills[qns][skillTypes][skillFeature]) {
            var oldUserList = Object.keys(bigProbSkills[qns][skillTypes][skillFeature]);
            if (!(oldUserList.includes(user))) {
              // create a new dictionary to update firebase
              test[user] = newProbSkills[qns][skillTypes][skillFeature][user];
              //admin.database().ref("problemSkills/" + qns + "/" + skillTypes + "/" + skillFeature + "/").update(test);
            }
          }
        }
      }
    }
  })
  await problemSkillsRoute
  return
}

async function updateProblemSkills(newSkillsDict) {
  await probSkillsNewQns(newSkillsDict);
  await probSkillsNewSkill(newSkillsDict);
  await probSkillsNewUser(newSkillsDict);
  return
}

const updateBothSkills = (newSkillsDict) => {
  updateUserSkills(newSkillsDict);
  updateProblemSkills(newSkillsDict);
}


exports.updateBothSkills = updateBothSkills
