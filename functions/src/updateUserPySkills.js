const admin = require("firebase-admin");

function saveUserSkills(oldSolution, newSolution, studentId, pySkills) {

  // // delete user old solution skill from 
  // if (oldSolution.userSkills) {
  //   Object.keys((oldSolution.userSkills || {})).forEach(key => {
  //     Object.keys((oldSolution.userSkills || {})[key]).forEach(subKey => {
  //       delete ((pySkills || {})[key] || {})[subKey];
  //       if (Object.keys((pySkills || {})[key]).length === 0) {
  //         delete (pySkills || {})[key]
  //       }
  //     })
  //   })
  // }

  // add new Skills
  if (newSolution.userSkills) {
    Object.keys((newSolution.userSkills || {})).forEach(key => {
      Object.keys((newSolution.userSkills || {})[key]).forEach(subKey => {
        if (!pySkills[key]) {
          pySkills[key] = {}
        }
        pySkills[key][subKey] = true;
      })
    })
  }
  // update user python skill
  return admin
    .database()
    .ref(`/userCodingSkills/${studentId}/python`)
    .set(pySkills)
}


exports.handler = (oldSolution, newSolution, studentId) => {
  return new Promise((resolve) => {
    if (newSolution.userSkills || oldSolution.userSkills) {
      admin
        .database()
        .ref(`/userCodingSkills/${studentId}/python`)
        .once("value")
        .then(pythonSkills => {
          const pySkills = pythonSkill.exists() ? pythonSkills.val() : {};
          resolve(
            saveUserSkills(oldSolution, newSolution, studentId, pySkills)
          )
        })
        .catch(() => {
          resolve(
            saveUserSkills(oldSolution, newSolution, studentId, {})
          )
        })
    } else {
      resolve();
    }
  })

};

