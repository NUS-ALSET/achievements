/**
 *
 * @param {Object} config
 * @param {String} [config.uid]
 * @param {Number} [config.sort]
 * @param {Number} [config.tab]
 * @param {Object} [config.assignments]
 * @param {Object} [config.users]
 * @param {Object} [config.courseMembers]
 * @param {Object} [config.userAchievements]
 * @param {Object} [config.courses]
 * @param {Object} [config.solutions]
 * @param {Object} [config.visibleSolutions]
 * @returns {Object} test state
 */
export const getTestState = config => ({
  assignments: {
    currentTab: config.tab || 0,
    sort: config.sort || {
      field: "studentName",
      direction: "asc"
    },
    courseMembers: [
      {
        id: "abcTestUser1",
        name: "Test User 1",
        achievements: {
          CodeCombat: {
            id: "test-user-1",
            totalAchievements: 100
          }
        }
      },
      {
        id: "abcTestUser2",
        name: "Test User 1",
        achievements: {
          CodeCombat: {
            id: "test-user-2",
            totalAchievements: 10
          }
        }
      }
    ]
  },
  firebase: {
    auth: {
      uid: config.uid || "abcTestUserOwner"
    },
    data: {
      assignments: config.assignments || {
        abcTestCourseId: {
          abcTestAssignmentId: {
            open: "1959-06-03T00:00",
            deadline: "2100-01-01T00:00",
            questionType: "Profile",
            solutionVisible: true,
            visible: true
          },
          defTestAssignmentId: {
            open: "1959-06-03T00:00",
            deadline: "2100-01-01T00:00",
            questionType: "Text",
            solutionVisible: false,
            visible: true
          }
        }
      },
      courses: config.courses || {
        abcTestCourseId: {
          name: "test course",
          owner: "abcTestUserOwner"
        }
      },
      coursePasswords: {
        abcTestCourseId: "abcTestCoursePassword"
      },
      courseAssistants: {
        abcTestCourseId: {
          abcTestAssistant1: true
        }
      },
      userAchievements: config.userAchievements || {
        abcTestUser1: {
          CodeCombat: {
            id: "test-user-1",
            totalAchievements: 100
          }
        },
        abcTestUser2: {
          CodeCombat: {
            id: "test-user-2",
            totalAchievements: 10
          }
        }
      },
      courseMembers: config.courseMembers || {
        abcTestCourseId: {
          abcTestUser1: true,
          abcTestUser2: true
        }
      },
      pathAssistants: {
        abcTestPathId: {
          abcTestAssistant1: true
        }
      },
      paths: {
        abcTestPathId: {
          owner: "abcTestUser1"
        }
      },
      solutions: config.solutions || {
        abcTestCourseId: {
          abcTestUser1: {
            abcTestAssignmentId: {
              createdAt: 1000,
              value: "test-user-1"
            },
            defTestAssignmentId: {
              createdAt: 1001,
              value: "Test User 1"
            }
          },
          abcTestUser2: {
            abcTestAssignmentId: {
              createdAt: 1000,
              value: "test-user-2"
            }
          }
        }
      },
      visibleSolutions: config.visibleSolutions || {
        abcTestCourseId: {
          abcTestUser1: {
            abcTestAssignmentId: {
              createdAt: 1000,
              value: "test-user-1"
            },
            defTestAssignmentId: {
              createdAt: 1001,
              value: "Completed"
            }
          },
          abcTestUser2: {
            abcTestAssignmentId: {
              createdAt: 1000,
              value: "test-user-2"
            }
          }
        }
      },
      users: config.users || {
        abcTestUserOwner: {
          displayName: "Test User Owner"
        },
        abcTestAssistant1: {
          displayName: "Test User Assistant 1"
        },
        abcTestUser1: {
          displayName: "Test User 1"
        },
        abcTestUser2: {
          displayName: "Test User 1"
        }
      }
    }
  }
});
