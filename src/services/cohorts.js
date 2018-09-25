import firebase from "firebase";
import { ASSIGNMENTS_TYPES } from "./courses";

class CohortsService {
  addCohort(cohortData, uid, instructorName) {
    if (cohortData.id) {
      const config = {};
      if (cohortData.name) {
        config.name = cohortData.name;
      }
      if (cohortData.description) {
        config.description = cohortData.description;
      }
      if (cohortData.paths) {
        config.paths = cohortData.paths;
      }
      if (cohortData.threshold) {
        config.threshold = cohortData.threshold;
      }
      return firebase
        .database()
        .ref(`/cohorts/${cohortData.id}`)
        .update(config);
    }

    const key = firebase
      .database()
      .ref("/cohorts")
      .push().key;

    return firebase
      .database()
      .ref(`/cohorts/${key}`)
      .set({
        name: cohortData.name,
        description: cohortData.description || "",
        paths: cohortData.paths,
        owner: uid,
        threshold: cohortData.threshold || 1,
        instructorName
      })
      .then(() => key);
  }

  addCourse(cohortId, courseId) {
    return Promise.all([
      firebase
        .database()
        .ref(`/courses/${courseId}`)
        .once("value"),
      firebase
        .database()
        .ref(`/courseMembers/${courseId}`)
        .once("value")
    ]).then(responses => {
      const course = responses[0].val();
      const members = responses[1].val();

      return firebase
        .database()
        .ref(`/cohortCourses/${cohortId}/${courseId}`)
        .set({
          name: course.name,
          progress: 0,
          participants: Object.keys(members || {}).length
        });
    });
  }

  recalculatePathsCourse(cohortId, courseId, cohort) {
    return Promise.all([
      firebase
        .database()
        .ref(`/courseMembers/${courseId}`)
        .once("value")
        .then(members => Object.keys(members.val() || {})),
      firebase
        .database()
        .ref(`/assignments/${courseId}`)
        .once("value")
        .then(snap => snap.val() || {}),
      firebase
        .database()
        .ref(`/solutions/${courseId}`)
        .once("value")
        .then(userSolutions => userSolutions.val() || {})
    ]).then(responses => {
      const [studentKeys, assignments, solutions] = responses;
      const targetAssignments = {};
      const pathProgress = Object.assign(
        {},
        ...cohort.paths.map(id => ({ [id]: 0 }))
      );
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

      return firebase
        .database()
        .ref(`/cohortCourses/${cohortId}/${courseId}`)
        .update({
          participants: studentKeys.length,
          pathsProgress: pathProgress,
          progress: explorers
        });
    });
  }

  recalculateCourse(cohortId, courseId, cohort) {
    if (cohort.paths && cohort.paths.length) {
      return this.recalculatePathsCourse(cohortId, courseId, cohort);
    }
    return Promise.all([
      firebase
        .database()
        .ref(`/courseMembers/${courseId}`)
        .once("value")
        .then(members => Object.keys(members.val() || {}).length),
      firebase
        .database()
        .ref(`/solutions/${courseId}`)
        .once("value")
        .then(userSolutions => Object.keys(userSolutions.val() || {}).length)
    ]).then(responses =>
      firebase
        .database()
        .ref(`/cohortCourses/${cohortId}/${courseId}`)
        .update({
          participants: responses[0],
          progress: responses[1]
        })
    );
  }

  recalculateCourses(cohortId, cohort) {
    return firebase
      .database()
      .ref(`/cohortCourses/${cohortId}`)
      .once("value")
      .then(courses =>
        Promise.all(
          Object.keys(courses.val() || {}).map(courseId =>
            this.recalculateCourse(cohortId, courseId, cohort)
          )
        )
      );
  }

  removeCourse(cohortId, courseId) {
    return firebase
      .database()
      .ref(`/cohortCourses/${cohortId}/${courseId}`)
      .remove();
  }
}

/** @type {CohortsService} */
export const cohortsService = new CohortsService();
