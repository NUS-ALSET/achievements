const admin = require("firebase-admin");

function getTeamAssignmentSolutions(data, context) {
  return admin
    .database()
    .ref(`/solutions/${data.course}`)
    .once("value")
    .then(snap => snap.val() || {})
    .then(solutions => {
      const userSolutions = solutions[context.uid] || {};
      const teamSolution = userSolutions[data.teamAssignment];
      if (!teamSolution) {
        return [];
      }
      return ["test", "yay"];
    });
}

exports.handler = getTeamAssignmentSolutions;
