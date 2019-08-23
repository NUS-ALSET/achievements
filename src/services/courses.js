/**
 * @file Courses service
 * @author Theodor Shaytanov <theodor.shaytanov@gmail.com>
 */

import {
  courseAssistantFetchSuccess,
  courseJoinedFetchSuccess
} from "../containers/Courses/actions";
import { externalProfileRefreshRequest } from "../containers/Account/actions";
import {
  coursePasswordEnterFail,
  coursePasswordEnterRequest
} from "../containers/Assignments/actions";
import { notificationHide, notificationShow } from "../containers/Root/actions";
// import { solutionsService } from "./solutions";
import { firebaseService } from "./firebaseQueueService";
import { pathsService } from "./paths";

import each from "lodash/each";
import firebase from "firebase/app";
import { APP_SETTING } from "../achievementsApp/config";

const ERROR_TIMEOUT = 10000;
const TAB_OPEN_TIMEOUT = 2000;
const TIMEOUT_DELAY = 500;

// do not remove disabled assignment types from ASSIGNMENTS_TYPES for the backward compatibility of already created problems
export const ASSIGNMENTS_TYPES = {
  Text: {
    id: "Text",
    caption: "Text"
  },
  Feedback: {
    id: "Feedback",
    caption: "Feedback"
  },
  Profile: {
    id: "Profile",
    caption: "Fetch Profile"
  },
  CodeCombat: {
    id: "CodeCombat",
    caption: "Complete Level"
  },
  CodeCombat_Number: {
    id: "CodeCombat_Number",
    caption: "Complete Number of Levels"
  },
  TeamFormation: {
    id: "TeamFormation",
    caption: "Team Formation"
  },
  TeamText: {
    id: "TeamText",
    caption: "Team Text"
  },
  TeamChoice: {
    id: "TeamChoice",
    caption: "Team Choice"
  },
  PathActivity: {
    id: "PathActivity",
    caption: "Path Activity"
  },
  PathProgress: {
    id: "PathProgress",
    caption: "Path Progress"
  }
};

export const DISABLED_ASSIGNMNET_TYPES = [
  "Profile",
  "CodeCombat",
  "CodeCombat_Number"
];

const getEnabledAssignmnetType = () => {
  const assignmentsType = JSON.parse(JSON.stringify(ASSIGNMENTS_TYPES)); // deep copy
  DISABLED_ASSIGNMNET_TYPES.forEach(type => {
    delete assignmentsType[type];
  });
  return assignmentsType;
};

export const ENABLED_ASSIGNMENTS_TYPES = getEnabledAssignmnetType();

export class CoursesService {
  errorTimeout = 0;

  static sortAssignments(assignments) {
    return Object.keys(assignments || {})
      .map(id => ({ ...assignments[id], id }))
      .sort((a, b) => {
        if (a.orderIndex > b.orderIndex) {
          return 1;
        } else if (a.orderIndex === b.orderIndex) {
          return 0;
        }
        return -1;
      });
  }

  setStore(store) {
    this.store = store;
  }

  dispatch(action) {
    this.store.dispatch(action);
  }

  dispatchErrorMessage(action) {
    this.store.dispatch(action);
    this.store.dispatch(notificationShow(action.error));
    if (this.errorTimeout) {
      clearTimeout(this.errorTimeout);
    }
    this.errorTimeout = setTimeout(() => {
      this.dispatch(notificationHide());
      this.errorTimeout = 0;
    }, ERROR_TIMEOUT);
  }

  /**
   * Returns current authorized user or one of its field
   * @param {String} [field] requested field
   * @returns {*} user or single field
   */
  getUser(field) {
    const user = firebase.auth().currentUser;
    if (!user) {
      return false;
    }
    if (field) {
      return user[field];
    }
    return user;
  }

  /**
   * This method should be invoked at login. It add listener for
   * `/studentJoinedCourses` and `/courseAssistants` and fetches received courses
   * @returns {*}
   */
  watchJoinedCourses() {
    if (!this.getUser("uid")) {
      return Promise.resolve();
    }
    firebase
      .database()
      .ref("/courseAssistants")
      .orderByChild(this.getUser("uid"))
      .equalTo(true)
      .on("value", snap =>
        Promise.all(
          Object.keys(snap.val() || {}).map(id =>
            firebase
              .database()
              .ref(`/courses/${id}`)
              .once("value")
              .then(snap => ({ [id]: snap.val() }))
          )
        )
          .then(courses =>
            this.store.dispatch(
              courseAssistantFetchSuccess(Object.assign({}, ...courses))
            )
          )
          .catch(err => console.error(err))
      );
    firebase
      .database()
      .ref(`/studentJoinedCourses/${this.getUser("uid")}`)

      // Firebase `on('value')` doesn't return promise
      .on("value", courses =>
        // So, we catch errors here
        Promise.all(
          Object.keys(courses.val() || {}).map(courseId =>
            firebase
              .database()
              .ref(`/courses/${courseId}`)
              .once("value")
              .then(course => ({
                ...course.val(),
                courseId
              }))
          )
        )
          .then(courses => {
            const map = {};
            courses.forEach(course => {
              map[course.courseId] = course;
              return true;
            });
            this.store.dispatch(courseJoinedFetchSuccess(map));
          })
          .catch(err => console.error(err.message))
      );
    return Promise.resolve();
  }

  validateNewCourse(courseData) {
    if (!(courseData.id || (courseData.name && courseData.password))) {
      throw new Error("Missing name or password");
    }
    return true;
  }

  createNewCourse(courseData) {
    const { name, password, description } = courseData;

    if (courseData.id) {
      return Promise.resolve()
        .then(
          () =>
            password &&
            firebase.set(`/coursePasswords/${courseData.id}`, password)
        )
        .then(() => {
          delete courseData.password;
          firebase.ref(`/courses/${courseData.id}`).update(courseData);
        });
    }

    this.validateNewCourse(courseData);
    return firebase
      .push("/courses", {
        name,
        createdAt: new Date().getTime(),
        instructorName: this.getUser("displayName"),
        description: description || "",
        owner: this.getUser("uid")
      })
      .then(ref =>
        firebase
          .set(`/coursePasswords/${ref.getKey()}`, password)
          .then(() => ref.getKey())
      );
  }

  deleteCourse(courseId) {
    return firebase.ref(`/courses/${courseId}`).remove();
  }

  tryCoursePassword(courseId, password) {
    coursePasswordEnterRequest(courseId);

    // Good place for firebase function
    return firebase
      .set(
        `/studentCoursePasswords/${courseId}/${this.getUser("uid")}`,
        password
      )
      .then(() =>
        firebase.set(`/courseMembers/${courseId}/${this.getUser("uid")}`, true)
      )
      .then(() =>
        firebase.set(
          `/studentJoinedCourses/${this.getUser("uid")}/${courseId}`,
          true
        )
      )
      .catch(err =>
        this.dispatchErrorMessage(coursePasswordEnterFail(err.message))
      );
  }

  validateAssignment(assignment) {
    if (!assignment.name) {
      throw new Error("Name required for Assignment");
    }
    if (assignment.questionType === "CodeCombat" && !assignment.level) {
      throw new Error("Level required for CodeCombat Assignment");
    }
  }

  addAssignment(courseId, assignment, assignments) {
    // Edit assignment
    if (assignment.id) {
      return firebase
        .ref(`/assignments/${courseId}/${assignment.id}`)
        .set(assignment);
    }

    // Check that orderIndex correct
    assignment.orderIndex = 1;
    assignment.createdAt = new Date().getTime();
    Object.keys(assignments || {})
      .map(id => assignments[id])
      .forEach(existing => {
        if (!(existing.orderIndex < assignment.orderIndex)) {
          assignment.orderIndex = existing.orderIndex + 1;
        }

        return true;
      });

    return firebase.ref(`/assignments/${courseId}`).push(assignment);
  }

  updateAssignment(courseId, assignmentId, field, value) {
    return firebase
      .ref(`/assignments/${courseId}/${assignmentId}`)
      .update({
        [field]: value
      })
      .then(
        // Replace visible solutions if this setting was changed
        () =>
          field === "solutionVisible" &&
          firebase
            .ref(`/solutions/${courseId}`)
            .once("value")
            .then(data =>
              Promise.all(
                Object.keys(data.val() || {}).map(studentId => {
                  const solutions = data.val()[studentId];

                  if (solutions[assignmentId]) {
                    return firebase
                      .ref(
                        "/visibleSolutions/" +
                          `${courseId}/${studentId}/${assignmentId}`
                      )
                      .set({
                        ...solutions[assignmentId],
                        value: value
                          ? solutions[assignmentId].value
                          : "Completed"
                      });
                  }
                  return Promise.resolve();
                })
              )
            )
      );
  }

  removeAssignment(courseId, assignmentId) {
    return firebase
      .ref(`/assignments/${courseId}/${assignmentId}`)
      .remove()
      .catch(err => this.store.dispatch(notificationShow(err.message)));
  }

  // /**
  //  * This method accepts student's solution and put's it at public section
  //  * @param courseId
  //  * @param assignment
  //  * @param studentId
  //  */
  // acceptSolution(courseId, assignment, studentId) {
  //   return firebase
  //     .ref(`/solutions/${courseId}/${studentId}/${assignment.id}`)
  //     .once("value")
  //     .then(solution => {
  //       return firebase
  //         .ref(`/visibleSolutions/${courseId}/${studentId}/${assignment.id}`)
  //         .set(solution.val());
  //     })
  //     .catch(err => this.store.dispatch(notificationShow(err.message)));
  // }

  getProfileStatus(userId, service = "CodeCombat") {
    return firebase
      .ref(`/userAchievements/${userId}/${service}/id`)
      .once("value")
      .then(id => {
        if (id.val()) {
          return id.val();
        }
        throw new Error(`Missing ${service} profile to submit`);
      });
  }

  /**
   * This method checks requested levels complete status and throws and error if something incomplete
   * @param {String} userId
   * @param {Assignment} assignment
   */
  getAchievementsStatus(userId, assignment) {
    const service = assignment.service || "CodeCombat";
    return new Promise((resolve, reject) => {
      firebase
        .ref(`/userAchievements/${userId}/${service}`)
        .once("value")
        .then(profileData => {
          if (profileData.exists()) {
            const err = this.checkAchievementsError(profileData, assignment);
            const profile = profileData.val() || {};
            if (err) {
              this.dispatch(externalProfileRefreshRequest(profile.id, service));
              setTimeout(() => {
                firebase
                  .ref(`/userAchievements/${userId}/${service}`)
                  .once("value")
                  .then(profileData => {
                    const err = this.checkAchievementsError(
                      profileData,
                      assignment,
                      true
                    );
                    return err ? reject(err) : resolve(profile.id);
                  });
              }, APP_SETTING.defaultTimeout + TIMEOUT_DELAY);
            } else {
              resolve(profile.id);
            }
          } else {
            reject(
              new Error(
                `Please enter your ${service} profile in the 1st question`
              )
            );
          }
        });
    });
  }

  checkAchievementsError = (profileData, assignment, openTab = false) => {
    const profile = profileData.val() || {};
    const achievements = profile.achievements || {};
    switch (assignment.questionType) {
      case "CodeCombat":
        if (!achievements[assignment.level]) {
          if (openTab) {
            setTimeout(() => {
              window.open(
                `http://codecombat.com/play/level/${assignment.level}`,
                "_blank"
              );
            }, TAB_OPEN_TIMEOUT);
          }
          return new Error(
            `Opening up "${
              assignment.level
            }" level in another tab... Please allow pop-up to see the new tab.`
          );
        }
        break;
      case "CodeCombat_Number":
        if (
          !profile.totalAchievements ||
          profile.totalAchievements < assignment.count
        ) {
          return new Error(
            `Not finished required amount of levels (${assignment.count})`
          );
        }
        break;
      default:
    }
    return false;
  };

  submitSolution(courseId, assignment, value, userId, status = null) {
    userId = userId || this.getUser("uid");

    return Promise.resolve()
      .then(() => {
        switch (assignment.questionType) {
          case "Profile":
            return this.getProfileStatus(userId);
          case "CodeCombat":
          case "CodeCombat_Number":
            return this.getAchievementsStatus(userId, assignment);
          default:
            return value;
        }
      })
      .then(value => {
        return firebase
          .ref(`/solutions/${courseId}/${userId}/${assignment.id}`)
          .set({
            createdAt: new Date().getTime(),
            value,
            status
          });
      })
      .then(res => {
        if (
          ["jupyterInline", "jupyter"].includes(
            ((assignment || {}).problemJSON || {}).type
          )
        ) {
          new Promise(resolve => {
            if (assignment.problemJSON.type === "jupyterInline") {
              resolve(value);
            } else {
              pathsService
                .fetchFile(pathsService.getFileId(value))
                .then(json => {
                  resolve(json);
                });
            }
          }).then(jsonValue => {
            const editableBlockCode = jsonValue.cells
              .map(c =>
                c.cell_type === "code"
                  ? c.source
                      .map(line => (line[0] === "!" ? `#${line}` : line))
                      .join("")
                  : ""
              )
              .join("");
            const data = {
              owner: userId,
              solution: editableBlockCode || ""
            };
            firebaseService
              .startProcess(
                data,
                "jupyterSolutionAnalysisQueue",
                "Code Analysis"
              )
              .then(res => {
                const response = res.skills || {};
                firebase
                  .ref(`/solutions/${courseId}/${userId}/${assignment.id}`)
                  .update({
                    userSkills: response
                  });
              });
          });
        }
        let completed = true;
        if (
          ((assignment || {}).problemJSON || {}).type === "game" &&
          value.result !== "WON"
        ) {
          completed = false;
        }
        if (userId && assignment.path && assignment.problem) {
          firebase
            .database()
            .ref(
              `/completedActivities/${userId}/${assignment.path}/${
                assignment.problem
              }`
            )
            .set(
              completed && {
                ".sv": "timestamp"
              }
            );
        }
        return res;
      });
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
        ? assignment.solutionVisible || isOwner
          ? solution
          : "Complete"
        : ""
    };
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

  refreshProfileSolutions(courseId) {
    return firebase
      .database()
      .ref(`/courseMembers/${courseId}`)
      .once("value")
      .then(membersSnapshot => Object.keys(membersSnapshot.val() || {}))
      .then(memberIds =>
        Promise.all(
          memberIds.map(id =>
            firebase
              .database()
              .ref(`/userAchievements/${id}/CodeCombat/id`)
              .once("value")
              .then(profileSnapshot => ({
                id,
                login: profileSnapshot.val()
              }))
          )
        )
      )
      .then(logins => logins.filter(loginInfo => loginInfo.login))
      .then(logins => {
        const updates = {};
        let needUpdate = false;

        logins.forEach(loginInfo => {
          const key = firebase
            .database()
            .ref("updateProfileQueue/tasks")
            .push().key;

          needUpdate = true;

          // FIXIT: make it assignment-depended to select correct external service
          updates[key] = {
            service: "CodeCombat",
            serviceId: loginInfo.login,
            uid: loginInfo.id
          };
        });

        if (needUpdate) {
          return firebase
            .database()
            .ref("updateProfileQueue/tasks")
            .update(updates);
        }
      });
  }

  processAssignmentsOrderIndexes(courseId, assignments) {
    const ordersMap = {};
    let needUpdate = false;

    assignments = Object.keys(assignments || {}).map(id => ({
      ...assignments[id],
      id
    }));

    assignments.forEach(assignment => {
      if (!assignment.orderIndex || ordersMap[assignment.orderIndex]) {
        needUpdate = true;
        return false;
      }
      ordersMap[assignment.orderIndex] = true;
      return true;
    });

    if (!needUpdate) {
      return Promise.resolve();
    }
    return Promise.all(
      assignments.map((assignment, index) =>
        firebase
          .database()
          .ref(`/assignments/${courseId}/${assignment.id}/orderIndex`)
          .set(index + 1)
      )
    );
  }

  getAssistants(courseId) {
    return firebase
      .database()
      .ref(`/courseAssistants/${courseId}`)
      .once("value")
      .then(assistants => Object.keys(assistants.val() || {}))
      .then(userIds =>
        Promise.all(
          userIds.map(id =>
            firebase
              .database()
              .ref(`/users/${id}`)
              .once("value")
              .then(user => Object.assign({ id }, user.val()))
          )
        )
      );
  }

  addAssistant(courseId, assistantId) {
    return firebase
      .database()
      .ref(`/courseAssistants/${courseId}/${assistantId}`)
      .set(true);
  }

  removeAssistant(courseId, assistantId) {
    return firebase
      .database()
      .ref(`/courseAssistants/${courseId}/${assistantId}`)
      .remove();
  }

  reorderAssignment(assignments, courseId, assignmentId, order) {
    const offset = order ? 1 : -1;
    let assignment;

    assignments = assignments[courseId] || {};
    assignments = CoursesService.sortAssignments(assignments);
    assignment = (assignments.filter(
      assignment => assignment.id === assignmentId
    ) || [])[0];

    if (!assignment) throw new Error("Unable find assignment");

    const sibling = assignments[assignments.indexOf(assignment) + offset];

    if (!sibling) {
      return Promise.resolve();
    }

    return Promise.all([
      firebase
        .database()
        .ref(`/assignments/${courseId}/${assignmentId}/orderIndex`)
        .set(sibling.orderIndex),
      firebase
        .database()
        .ref(`/assignments/${courseId}/${sibling.id}/orderIndex`)
        .set(assignment.orderIndex)
    ]);
  }

  watchCourseMembers(courseId, callback) {
    return firebase
      .database()
      .ref(`/courseMembers/${courseId}`)
      .on("value", courseMembers =>
        this.unWatchCourseMembers(courseId)
          .then(() => courseMembers)
          .then(courseMembers =>
            // FIXIT: add checking - if watched already then skip
            Promise.all(
              Object.keys(courseMembers.val() || {}).map(id =>
                firebase
                  .ref(`/users/${id}`)
                  .once("value")
                  .then(data => data.val())
                  .then(response => {
                    const userInfo = response;

                    /*
                    firebase
                      .ref(`/userAchievements/${id}`)
                      .on("value", achievements =>
                        callback({
                          studentId: id,
                          achievements: achievements.val()
                        })
                      );
                      */

                    return Object.assign(
                      {
                        id,
                        name: userInfo.displayName || ""
                      },
                      userInfo
                    );
                  })
              )
            )
              .then(courseMembers => callback({ courseMembers }))
              .catch(err => callback({ err }))
          )
      );
  }

  unWatchCourseMembers(courseId) {
    return firebase
      .database()
      .ref(`/courseMembers/${courseId}`)
      .once("value")
      .then(members =>
        Promise.all(
          Object.keys(members.val() || {}).map(id =>
            firebase
              .database()
              .ref(`/userAchievements/${id}`)
              .off()
          )
        )
      );
  }

  fetchUser(userKey) {
    if (userKey.length <= 1) {
      return Promise.resolve();
    }
    return firebase
      .database()
      .ref(`/users/${userKey}`)
      .once("value")
      .then(
        userData =>
          (userData.val() && Object.assign({ id: userKey }, userData.val())) ||
          false
      );
  }

  fetchCourses(userKey) {
    if (userKey.length <= 1) {
      return Promise.resolve();
    }
    return firebase
      .database()
      .ref("/courses/")
      .orderByChild("owner")
      .equalTo(userKey)
      .once("value")
      .then(courses => courses.val() || {})
      .then(courses =>
        Object.keys(courses).map(id => ({ ...courses[id], id }))
      );
  }

  fetchCoursePaths(courseId) {
    return firebase
      .database()
      .ref(`/assignments/${courseId}`)
      .orderByChild("questionType")
      .equalTo(ASSIGNMENTS_TYPES.PathProgress.id)
      .once("value")
      .then(snap => snap.val())
      .then(courses =>
        Promise.all(
          Object.keys(courses).map(id =>
            firebase
              .database()
              .ref(`/paths/${courses[id].path}/totalActivities`)
              .once("value")
              .then(snap => ({ [id]: snap.val() }))
          )
        )
      )
      .then(pathsData => Object.assign({}, ...pathsData));
  }

  removeStudentFromCourse(courseId, studentId) {
    return firebase
      .database()
      .ref(`/courseMembers/${courseId}/${studentId}`)
      .remove()
      .then(() =>
        firebase
          .database()
          .ref(`/studentJoinedCourses/${studentId}/${courseId}`)
          .remove()
      )
      .then(() =>
        firebase
          .database()
          .ref(`/solutions/${courseId}/${studentId}`)
          .remove()
      )
      .then(() =>
        firebase
          .database()
          .ref(`/visibleSolutions/${courseId}/${studentId}`)
          .remove()
      )
      .then(() =>
        firebase
          .database()
          .ref(`/studentCoursePasswords/${courseId}/${studentId}`)
          .remove()
      );
  }

  moveStudent(sourceCourseId, targetCourseId, studentId) {
    return this.removeStudentFromCourse(sourceCourseId, studentId).then(() =>
      firebase
        .database()
        .ref(`/coursePasswords/${targetCourseId}`)
        .once("value")
        .then(data => data.val())
        .then(password =>
          firebase
            .database()
            .ref(`/studentCoursePasswords/${targetCourseId}/${studentId}`)
            .set(password)
        )
        .then(() =>
          firebase
            .database()
            .ref(`/studentJoinedCourses/${studentId}/${targetCourseId}`)
            .set(true)
        )
        .then(() =>
          firebase
            .database()
            .ref(`/courseMembers/${targetCourseId}/${studentId}`)
            .set(true)
        )
    );
  }
}

/**
 * @type {CoursesService}
 */
export const coursesService = new CoursesService();
