import cloneDeep from "lodash/cloneDeep";
import each from "lodash/each";
import firebase from "firebase";

export class SolutionsService {
  fetchOwnCourses(uid) {
    return firebase
      .database()
      .ref("/courses")
      .orderByChild("owner")
      .equalTo(uid)
      .once("value")
      .then(response => response.val());
  }

  processHiddenSolutions(solutions, assignments) {
    solutions = cloneDeep(solutions);

    assignments
      .filter(assignment => !assignment.solutionVisible)
      .forEach(assignment => {
        if (
          solutions[assignment.id] &&
          solutions[assignment.id].value !== undefined
        ) {
          solutions[assignment.id].value = "Complete";
        }
        return true;
      });

    return solutions;
  }

  /**
   *
   * @param {String} courseId
   * @param {Object} studentsSolutions
   */
  processUpdatedSolutions(courseId, studentsSolutions) {
    const writes = [];
    return firebase
      .database()
      .ref(`/assignments/${courseId}`)
      .once("value")
      .then(assignmentsMap =>
        Object.keys(assignmentsMap).map(id =>
          Object.assign({ id }, assignmentsMap[id])
        )
      )
      .then(assignments =>
        firebase
          .database()
          .ref(`/visibleSolutions/${courseId}`)
          .once("value")
          .then(publicStudentsSolutions => {
            // Fixit: move to own method
            if (!publicStudentsSolutions) {
              return writes.push({
                ref: `/visibleSolutions/${courseId}`,
                value: this.processHiddenSolutions(studentsSolutions)
              });
            }
            each(studentsSolutions, (solutions, studentId) => {
              const publishedSolutions = publicStudentsSolutions[studentId];
              if (!publishedSolutions) {
                return writes.push({
                  ref: `/visibleSolutions/${courseId}/${studentId}`,
                  value: this.processHiddenSolutions(solutions, assignments)
                });
              }
              each(solutions, (data, assignmentId) => {
                const published = publishedSolutions[assignmentId];

                if (!(published && published.createdAt === data.createdAt)) {
                  writes.push({
                    ref:
                      "/visibleSolutions/" +
                      `${courseId}/${studentId}/${assignmentId}`,
                    value: this.processHiddenSolutions(data)
                  });
                }
              });
            });
          })
      )
      .then(() =>
        Promise.all(
          writes.map(config => firebase.ref(config.ref).set(config.value))
        )
      );
  }

  // noinspection JSUnusedGlobalSymbols
  /**
   * This method should be invoked at firebase login
   *
   * @param {String} uid current user id
   */
  watchOwnCourses(uid) {
    return this.fetchOwnCourses(uid).then(courses =>
      Promise.all(
        Object.keys(courses || {}).map(courseId =>
          firebase
            .database()
            .ref(`/solutions/${courseId}`)
            .on("value", data =>
              this.processUpdatedSolutions(courseId, data.val())
            )
        )
      ).then(() => courses)
    );
  }
}

/** @type {SolutionsService} */
export const solutionsService = new SolutionsService();
