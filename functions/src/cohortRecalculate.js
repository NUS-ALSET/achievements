const admin = require("firebase-admin");
const { ASSIGNMENTS_TYPES } = require("../config/appConfig");

const recalculatePathsCourse = (cohortId, courseId, cohort) => {
  return Promise.all([
    admin
      .database()
      .ref(`/courseMembers/${courseId}`)
      .once("value")
      .then(members => Object.keys(members.val() || {})),
    admin
      .database()
      .ref(`/assignments/${courseId}`)
      .once("value")
      .then(snap => snap.val() || {}),
    admin
      .database()
      .ref(`/solutions/${courseId}`)
      .once("value")
      .then(userSolutions => userSolutions.val() || {})
  ]).then(responses => {
    const [studentKeys, assignments, solutions] = responses;
    const targetAssignments = {};
    const pathProgress = {};
    cohort.paths.forEach(id => {
      pathProgress[id] = 0;
      return true;
    });
    let explorers = 0;

    for (const assignmentId of Object.keys(assignments)) {
      const assignment = assignments[assignmentId];
      if (
        assignment.questionType === ASSIGNMENTS_TYPES.PathProgress.id &&
        cohort.paths.includes(assignment.path)
      ) {
        targetAssignments[assignmentId] = assignment.path;
      }
    }

    for (const studentKey of studentKeys) {
      const studentProgress = {};
      for (const assignmentId of Object.keys(targetAssignments)) {
        const solution =
          solutions[studentKey] && solutions[studentKey][assignmentId];
        if (solution) {
          let value = /^(\d+) of \d+$/.exec(solution.value);
          value =
            value || /^\s*(\d+)\s*\/\s*\d+\s*$/.exec(solution.value) || [];

          if (value[1] && !isNaN(Number(value[1]))) {
            studentProgress[targetAssignments[assignmentId]] =
              studentProgress[targetAssignments[assignmentId]] || 0;
            studentProgress[targetAssignments[assignmentId]] += Number(
              value[1]
            );
          }
        }
      }
      for (const pathId of Object.keys(studentProgress)) {
        if (!(studentProgress[pathId] < cohort.threshold)) {
          pathProgress[pathId] += 1;
        } else {
          delete studentProgress[pathId];
        }
      }
      if (Object.keys(studentProgress).length > 0) {
        explorers += 1;
      }
    }

    return admin
      .database()
      .ref(`/cohortCourses/${cohortId}/${courseId}`)
      .update({
        participants: studentKeys.length,
        pathsProgress: pathProgress,
        progress: explorers
      });
  });
};

const recalculateCourse = (cohortId, courseId, cohort) => {
  if (cohort.paths && cohort.paths.length) {
    return recalculatePathsCourse(cohortId, courseId, cohort);
  }
  return Promise.all([
    admin
      .database()
      .ref(`/courseMembers/${courseId}`)
      .once("value")
      .then(members => Object.keys(members.val() || {}).length),
    admin
      .database()
      .ref(`/solutions/${courseId}`)
      .once("value")
      .then(userSolutions => Object.keys(userSolutions.val() || {}).length)
  ]).then(responses =>
    admin
      .database()
      .ref(`/cohortCourses/${cohortId}/${courseId}`)
      .update({
        participants: responses[0],
        progress: responses[1]
      })
  );
};

exports.handler = (cohortKey, taskKey) =>
  Promise.all([
    admin
      .database()
      .ref(`/cohorts/${cohortKey}`)
      .once("value")
      .then(snap => snap.val()),
    admin
      .database()
      .ref(`/cohortCourses/${cohortKey}`)
      .once("value")
      .then(snap => snap.val())
  ])
    .then(responses => {
      const cohort = responses[0];
      const courses = responses[1];
      return Promise.all(
        Object.keys(courses || []).map(courseId =>
          recalculateCourse(cohortKey, courseId, cohort)
        )
      );
    })
    .catch(err => console.error(err.message))
    .then(() =>
      admin
        .database()
        .ref(`/cohortRecalculateQueue/${cohortKey}/${taskKey}`)
        .remove()
    );
