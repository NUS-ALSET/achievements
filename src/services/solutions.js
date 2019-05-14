import cloneDeep from "lodash/cloneDeep";
import each from "lodash/each";
import firebase from "firebase/app";
import { ASSIGNMENTS_TYPES, coursesService } from "./courses";

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

  /**
   * Refreshes solutions for PathProgress assignments
   *
   * @param {ICourse} course
   */
  refreshSolutions(course) {
    return Promise.resolve()
      .then(() => {
        // Collect all assignment with type PathProgress and fetch required
        // paths
        let paths = false;

        for (const assignment of course.assignments) {
          if (assignment.questionType === ASSIGNMENTS_TYPES.PathProgress.id) {
            paths = paths || {};
            paths[assignment.path] = paths[assignment.paths] || [];
            paths[assignment.path].push(assignment);
          }
        }

        if (!paths) {
          return Promise.resolve();
        }

        // Fetch total activities count for all mentioned paths
        return (
          Promise.all(
            Object.keys(paths).map(pathId =>
              firebase
                .database()
                .ref(`/paths/${pathId}/totalActivities`)
                .once("value")
                .then(snapshot => ({
                  pathId,
                  total: snapshot.val()
                }))
            )
          )
            // Remove empty paths from list
            .then(pathsData => pathsData.filter(pathInfo => pathInfo.total))

            // Fetch completed activities for all paths and all assignments
            // solutions for students to compare provided solutions count with
            // actually solved activities count
            .then(pathsData =>
              Promise.all(
                Object.keys(course.members).map(memberId =>
                  Promise.all([
                    firebase
                      .database()
                      .ref(`/solutions/${course.id}/${memberId}`)
                      .once("value")
                      .then(snap => snap.val() || {}),
                    firebase
                      .database()
                      .ref(`/completedActivities/${memberId}`)
                      .once("value")
                      .then(snapshot => snapshot.val() || {})
                  ]).then(([solutions, completed]) => ({
                    memberId,
                    completed,
                    solutions
                  }))
                )
              )
                .then(completedData => {
                  // Prepare changes list
                  const changes = [];
                  for (const pathInfo of pathsData) {
                    for (const completedInfo of completedData) {
                      const count = Object.keys(
                        completedInfo.completed[pathInfo.pathId] || {}
                      ).length;

                      // If there is solutions for one of completed paths
                      if (count) {
                        // Then select assignments linked to this path
                        let assignments = paths[pathInfo.pathId];

                        // Select only assignments where solutions outdated to
                        // actual solved activities count
                        assignments = assignments.filter(assignment => {
                          let data = completedInfo.solutions[assignment.id];
                          data = (data || {}).value;
                          return !(data && data.startsWith(String(count)));
                        });

                        // And push them into changes list
                        changes.push({
                          assignments,
                          memberId: completedInfo.memberId,
                          value: `${
                            Object.keys(
                              completedInfo.completed[pathInfo.pathId] || {}
                            ).length
                          } of ${pathInfo.total}`
                        });
                      }
                    }
                  }
                  return changes;
                })
                .then(changes =>
                  Promise.all(
                    // Process changes list - every change contains list of
                    // assignments, s
                    changes.map(changeInfo =>
                      Promise.all(
                        changeInfo.assignments.map(assignment =>
                          coursesService.submitSolution(
                            course.id,
                            assignment,
                            changeInfo.value,
                            changeInfo.memberId
                          )
                        )
                      )
                    )
                  )
                )
            )
        );
      })
      .catch(err => {
        console.error(err.stack);
        throw err;
      });
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
                value: this.processHiddenSolutions(
                  studentsSolutions,
                  assignments
                )
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
                    value: this.processHiddenSolutions(data, assignments)
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

  /**
   * Fetch team solutions list from requsted assignment
   */
  getTeamChoiceOptions(courseId, assignment) {
    // choosen by fair dice roll, guaranteed to be random
    const FAIR_RANDOM = 0.5;

    return firebase
      .functions()
      .httpsCallable("getTeamAssignmentSolutions")({
        teamAssignment: assignment.teamFormation,
        sourceAssignment: assignment.source,
        course: courseId
      })
      .then(response => response.data || [])
      .then(options =>
        // randomize options
        options.sort(() => (Math.random() > FAIR_RANDOM ? 1 : -1))
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
