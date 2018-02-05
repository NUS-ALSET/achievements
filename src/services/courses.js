/**
 * @file Courses service
 * @author Theodor Shaytanov <theodor.shaytanov@gmail.com>
 */

import each from "lodash/each";
import firebase from "firebase";
import { courseNewFail, courseNewSuccess } from "../containers/Courses/actions";
import { riseErrorMessage } from "../containers/AuthCheck/actions";
import {
  coursePasswordEnterFail,
  coursePasswordEnterRequest,
  coursePasswordEnterSuccess
} from "../containers/Assignments/actions";

const ERROR_TIMEOUT = 6000;

class CoursesService {
  errorTimeout = false;

  setStore(store) {
    this.store = store;
  }

  dispatch(action) {
    this.store.dispatch(action);
  }

  dispatchErrorMessage(action) {
    this.store.dispatch(action);
    this.store.dispatch(riseErrorMessage(action.error));
    if (this.errorTimeout) {
      clearTimeout(this.errorTimeout);
    }
    this.errorTimeout = setTimeout(() => {
      this.dispatch(riseErrorMessage(""));
      this.errorTimeout = false;
    }, ERROR_TIMEOUT);
  }

  /**
   * Returns current authorized user or one of its field
   * @param {String} [field] requested field
   * @returns {*} user or single field
   */
  getUser(field) {
    const user = firebase.auth().currentUser;
    if (field) {
      return user[field];
    }
    return user;
  }

  createNewCourse(name, password) {
    return firebase
      .push("/courses", {
        name,

        // Temporary, replace for `populate` and `users`
        instructorName: this.getUser("displayName"),
        owner: this.getUser("uid")
      })
      .then(ref => {
        return firebase.set(`/coursePasswords/${ref.getKey()}`, password);
      })
      .then(() => this.dispatch(courseNewSuccess(name)))
      .catch(err =>
        this.dispatchErrorMessage(courseNewFail(name, err.message))
      );
  }

  deleteCourse(courseId) {
    return firebase
      .ref(`/courses/${courseId}`)
      .remove()
      .catch(err => this.dispatchErrorMessage(err.message));
  }

  tryCoursePassword(courseId, password) {
    coursePasswordEnterRequest(courseId);

    return firebase
      .set(
        `/studentCoursePasswords/${courseId}/${this.getUser("uid")}`,
        password
      )
      .then(() =>
        firebase.set(`/courseMembers/${courseId}/${this.getUser("uid")}`, true)
      )
      .then(() => this.dispatch(coursePasswordEnterSuccess()))
      .catch(err =>
        this.dispatchErrorMessage(coursePasswordEnterFail(err.message))
      );
  }

  addAssignment(courseId, assignment) {
    return firebase
      .ref(`/assignments/${courseId}`)
      .push(assignment)
      .catch(err =>
        this.dispatchErrorMessage(coursePasswordEnterFail(err.message))
      );
  }

  updateAssignment(courseId, assignmentId, field, value) {
    return firebase.ref(`/assignments/${courseId}/${assignmentId}`).update({
      [field]: value
    });
  }

  getProfileStatus(userId) {
    return firebase
      .ref(`/userAchievements/${userId}/CodeCombat/id`)
      .once("value")
      .then(id => {
        if (id.val()) {
          return id.val();
        }
        throw new Error("Missing CodeCombat profile to submit");
      });
  }

  submitSolution(courseId, assignment, userId, value) {
    let solutionValue;

    return Promise.resolve()
      .then(() => {
        switch (assignment.questionType) {
          case "Profile":
            return this.getProfileStatus(userId);
          default:
            return value;
        }
      })
      .then(value => {
        solutionValue = value;
        return firebase
          .ref(`/solutions/${courseId}/${userId}/${assignment.id}`)
          .set(solutionValue);
      })
      .then(() => {
        if (assignment.solutionVisible) {
          return firebase
            .ref(`/visibleSolutions/${courseId}/${userId}/${assignment.id}`)
            .set(solutionValue);
        }
      })
      .catch(err => this.store.dispatch(riseErrorMessage(err.message)));
  }

  /**
   *
   * @param {Object} config
   * @param {Boolean} config.assignment
   * @param {String} config.userId current authenticated
   * @param {Object} config.visibleSolutions
   * @param {Object} config.userAchievements
   * @param {String} config.studentId student id
   * @param {String} config.assignmentId
   */
  getSolution(config) {
    const {
      userId,
      assignment,
      visibleSolutions,
      studentId,
      userAchievements,
      assignmentId
    } = config;
    const isOwner = userId === studentId;

    let solution =
      visibleSolutions[studentId] && visibleSolutions[studentId][assignmentId];

    switch (assignment.questionType) {
      case "Profile":
        if (solution) {
          const profileSourse =
            userAchievements[studentId] &&
            userAchievements[studentId].CodeCombat &&
            userAchievements[studentId].CodeCombat;

          if (!profileSourse) {
            solution = "";
          } else {
            solution = `${profileSourse && profileSourse.id} (${profileSourse &&
              profileSourse.totalAchievements})`;
          }
        }
        break;
      default:
    }

    return {
      showActions: isOwner,
      value: solution
        ? assignment.solutionVisible || isOwner ? solution : "Complete"
        : ""
    };
  }

  /**
   * Returns list of assignments
   *
   * @param {Object} config
   * @param {Boolean} config.instructorView
   * @param {Object} config.assignments
   * @param {Object} config.courseMembers
   * @param {Object} config.users
   * @param {String} config.userName
   * @param {String} config.userId
   * @param {Object} config.visibleSolutions
   * @param {Object} config.sortState
   * @param {Object} config.userAchievements
   *
   * @returns {Array<Object>} list of assignments
   */
  getStudentsAssignments(config) {
    const {
      assignments,
      courseMembers,
      users,
      userId,
      userAchievements,
      visibleSolutions,
      sortState
    } = config;

    return Object.keys(courseMembers)
      .map(courseMemberId => {
        const student = { ...users[courseMemberId], id: courseMemberId };
        const result = {
          studentId: student.id,
          studentName: student.displayName
        };

        Object.keys(assignments).forEach(assignmentId => {
          result[assignmentId] = this.getSolution({
            assignment: assignments[assignmentId],
            studentId: student.id,
            userId,
            userAchievements,
            visibleSolutions,
            assignmentId
          });
        });
        return result;
      })
      .sort((a, b) => {
        let result = 0;
        let aValue = a[sortState.field];
        let bValue = b[sortState.field];

        aValue = (aValue && aValue.value) || aValue;
        bValue = (bValue && bValue.value) || bValue;

        if (aValue > bValue) {
          result = 1;
        } else if (aValue < bValue) {
          result = -1;
        } else {
          result = 0;
        }
        return sortState.direction === "asc" ? result : -result;
      });
  }

  // noinspection JSUnusedGlobalSymbols
  /**
   * Returns list of assignments
   *
   * @param {Object} config
   * @param {Boolean} config.instructorView
   * @param {Object} config.assignments
   * @param {Object} config.courseMembers
   * @param {Object} config.users
   * @param {Object} config.course
   * @param {String} config.userName
   * @param {String} config.userId
   * @param {Object} config.visibleSolutions
   *
   * @param {Object} tools
   * @param {Function} tools.getAnchor
   * @param {Function} tools.getButton
   *
   * @returns {Array<Object>} list of assignments
   */
  getAltAssignments(config, tools) {
    const {
      assignments,
      courseMembers,
      users,
      course,
      userName,
      userId,
      visibleSolutions,
      instructorView
    } = config;

    const members = Object.keys(courseMembers).map(userId =>
      Object.assign({ id: userId }, users[userId])
    );
    const result = [];
    let currentUserData = [];

    for (let i = 0; i < members.length; i++) {
      each(assignments, (assignment, assignmentId) => {
        let solution = visibleSolutions[members[i].id];

        if (!(instructorView || assignment.visible)) {
          return;
        }

        solution = solution && solution[assignmentId];

        const unknownSolution =
          assignment.solutionVisible ||
          members[i].id === userId ||
          (instructorView && course.owner === userId)
            ? "Incomplete"
            : "Who knows";

        switch (assignment.questionType) {
          case "Profile":
            if (solution) {
              solution = tools.getAnchor(solution);
            }

            break;
          default:
            solution = solution || unknownSolution;
        }

        const userData = {
          studentId: members[i].id,
          studentName: members[i].displayName,
          assignment: assignment.name,
          assignmentId,
          solution: solution || unknownSolution,
          actions:
            members[i].id === userId
              ? tools.getButton(assignment, assignmentId)
              : ""
        };

        if (userData.studentName === userName) {
          currentUserData.push(userData);
        } else {
          result.push(userData);
        }
      });
    }

    return currentUserData.concat(result);
  }
}

/**
 * @type {CoursesService}
 */
export const coursesService = new CoursesService();
