const admin = require("firebase-admin");

exports.handler = (newSolution, studentId, assignmentId) => {
  return new Promise(resolve => {
    if (typeof newSolution.userSkills === "object") {
      Promise.all([
        admin
          .database()
          .ref(`/userCodingSkills/${studentId}`)
          .once("value"),
        admin
          .database()
          .ref(`/problemCodingSkills/${assignmentId}`)
          .once("value")
      ]).then(data => {
        const pySkills = data[0].exists() ? data[0].val() : {};
        const problemSkills = data[1].exists() ? data[1].val() : {};
        // add new Skills
        Object.keys(newSolution.userSkills || {}).forEach(key => {
          Object.keys((newSolution.userSkills || {})[key]).forEach(subKey => {
            if (!pySkills[key]) {
              pySkills[key] = {};
            }
            if (!pySkills[key][subKey]) {
              pySkills[key][subKey] = {};
            }
            pySkills[key][subKey][assignmentId] = Date.now();

            if (!problemSkills[key]) {
              problemSkills[key] = {};
            }
            if (!problemSkills[key][subKey]) {
              problemSkills[key][subKey] = {};
            }
            problemSkills[key][subKey][studentId] = Date.now();
          });
        });

        // update user & problem python skill
        return Promise.all([
          admin
            .database()
            .ref(`/userCodingSkills/${studentId}`)
            .set(pySkills),
          admin
            .database()
            .ref(`/problemCodingSkills/${assignmentId}`)
            .set(problemSkills)
        ]);
      });
    } else {
      resolve();
    }
  });
};
