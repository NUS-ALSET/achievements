import firebase from "firebase";

class CohortsService {
  addCohort(cohortName, uid, instructorName) {
    const key = firebase
      .database()
      .ref("/cohorts")
      .push().key;

    return firebase
      .database()
      .ref(`/cohorts/${key}`)
      .set({
        name: cohortName,
        owner: uid,
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

  recalculateCourse(cohortId, courseId) {
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

  recalculateCourses(cohortId) {
    return firebase
      .database()
      .ref(`/cohortCourses/${cohortId}`)
      .once("value")
      .then(courses =>
        Promise.all(
          Object.keys(courses.val() || {}).map(courseId =>
            this.recalculateCourse(cohortId, courseId)
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
