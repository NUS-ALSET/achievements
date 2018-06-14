const admin = require("firebase-admin");

exports.handler = (solution, courseId, studentId, assignmentId) => {
  return admin
    .database()
    .ref(`/assignments/${courseId}/${assignmentId}`)
    .once("value")
    .then(assignment => {
      assignment = assignment.val();
      // Fixit: add more assignment conditions
      // We should process only solutions for actual assignments
      if (assignment.visible) {
        return admin
          .database()
          .ref(`/visibleSolutions/${courseId}/${studentId}/${assignmentId}`)
          .set(
            assignment.solutionVisible
              ? solution
              : Object.assign(solution, { value: "Complete" })
          );
      }
      return true;
    });
};
