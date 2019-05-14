const admin = require("firebase-admin");

/**
 *
 * @param {Object} data
 * @param {String} data.course
 * @param {String} data.sourceAssignment
 * @param {String} data.teamAssignment
 * @param {Object} context
 * @param {Object} context.auth
 * @param {String} context.auth.string
 */
function getTeamAssignmentSolutions(data, context) {
  return admin
    .database()
    .ref(`/solutions/${data.course}`)
    .once("value")
    .then(snap => snap.val() || {})
    .then(solutions => {
      const result = {};
      const userSolutions = solutions[context.auth.uid] || {};
      const teamSolution =
        userSolutions[data.teamAssignment] &&
        userSolutions[data.teamAssignment].value;

      if (!teamSolution) {
        return [];
      }
      for (const userId of Object.keys(solutions)) {
        if (
          // checking existance of team formation solution
          solutions[userId][data.teamAssignment] &&
          solutions[userId][data.teamAssignment].value === teamSolution &&
          // checking existance of source solution
          solutions[userId][data.sourceAssignment] &&
          solutions[userId][data.sourceAssignment].value &&
          solutions[userId][data.sourceAssignment].value.trim
        ) {
          result[solutions[userId][data.sourceAssignment].value.trim()] = true;
        }
      }

      return Object.keys(result);
    });
}

exports.handler = getTeamAssignmentSolutions;
