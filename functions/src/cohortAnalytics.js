const admin = require("firebase-admin");
const Queue = require("firebase-queue");
const { ASSIGNMENTS_TYPES } = require("../config/appConfig");

const calculateData = (courseId, cohort) => {
  if (cohort.paths && cohort.paths.length) {
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

      for (const assignmentId of Object.keys(assignments)) {
        const assignment = assignments[assignmentId];
        if (
          assignment.questionType === ASSIGNMENTS_TYPES.PathProgress.id &&
          cohort.paths.includes(assignment.path)
        ) {
          targetAssignments[assignmentId] = assignment.path;
        }
      }
      const studentPathProgress = {};
      for (const studentKey of studentKeys) {
        const studentProgress = {};
        for (const assignmentId of Object.keys(targetAssignments)) {
          const pathId = targetAssignments[assignmentId];
          const solution =
            solutions[studentKey] && solutions[studentKey][assignmentId];
          if (solution) {
            let value = /^(\d+) of \d+$/.exec(solution.value);
            value =
              value || /^\s*(\d+)\s*\/\s*\d+\s*$/.exec(solution.value) || [];

            if (value[1] && !isNaN(Number(value[1]))) {
              studentProgress[pathId] = studentProgress[pathId] || 0;
              studentProgress[pathId] += Number(value[1]);
            }
          }
        }
        studentPathProgress[studentKey] = studentProgress;
      }
      return studentPathProgress;
    });
  }
  return Promise.resolve({});
};


const handler = (cohortKey, taskKey, owner) => {
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
      .then(snap => snap.val()),
    admin
      .database()
      .ref(`/paths`)
      .once("value")
      .then(snap => snap.val())
  ])
    .then(async ([cohort, courses, paths]) => {
      const result = await Promise.all(
        Object.keys(courses || []).map(courseId =>
          calculateData(courseId, cohort)
        )
      );
      const studentsPathProgress = result.reduce((acc, stdProgress) => {
        Object.keys(stdProgress).forEach(studentKey => {
          Object.keys(stdProgress[studentKey] || {}).forEach(pathId => {
            if (!acc[pathId]) {
              acc[pathId] = {
                name: (paths[pathId] || {}).name,
                studentProgress: {}
              };
            }
            const progressInOtherCourse =
              acc[pathId].studentProgress[studentKey] || 0;
            const currentCourseProgress = stdProgress[studentKey][pathId];
            acc[pathId].studentProgress[studentKey] = Math.max(
              progressInOtherCourse,
              currentCourseProgress
            );
          });
        });
        return acc;
      }, {});

      return admin
        .database()
        .ref(`/cohortAnalyticsQueue/responses/${taskKey}`)
        .set({
          owner: owner,
          studentsPathProgress
        });
    })
    .catch(err => {
      return admin
        .database()
        .ref(`/cohortAnalyticsQueue/responses/${taskKey}`)
        .set(false);
    });
};

exports.handler = handler;

exports.queueHandler = () => {
  const queue = new Queue(
    admin.database().ref("/cohortAnalyticsQueue"),
    (data, progress, resolve) =>
      handler(data.cohortId, data.taskKey, data.owner).then(() => resolve())
  );
  queue.addWorker();
};
