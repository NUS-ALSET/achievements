/**
 * @typedef {Object} Assignment
 * @property {String} id
 * @property {String} questionType
 * @property {String} name
 * @property {String} open
 * @property {String} deadline
 * @property {Array<String>} levels
 * @property {string} level
 * @property {Number} count
 * @property {String} details
 */

/**
 * @typedef {Object} ExternalProfile external profile definition
 *
 * @property {String} url url of external profile ( e.g. https://codecombat.com)
 * @property {String} id id of external profile ( e.g. CodeCombat)
 * @property {String} name name of external profile ( e.g. Code Combat)
 * @property {String} description description of external profile ( e.g. learn to code )
 */

/**
 * @typedef {Object} FirebaseState
 *
 * @property {Object} auth
 * @property {String} auth.displayName
 * @property {String} auth.uid
 * @property {Object} data
 * @property {Object} data.assignments
 * @property {Object} data.courseMembers
 * @proeprty {Object} data.coursePasswords
 * @property {Object} data.courses
 */

/**
 * @typedef {Object} AppFrameState
 *
 * @property {Object} user
 * @property {String} user.id
 * @property {String} user.displayName
 * @property {HTMLElement | Boolean} dropdownAnchorElId
 * @property {Boolean} mainDrawerOpen
 */

/**
 * @typedef {Object} CoursesState
 *
 * @property {Boolean} showNewDialog
 * @property {Object} newCourseValues
 * @property {String} newCourseValues.name
 * @property {String} newCourseValues.password
 */

/**
 * @typedef {Object} RootState
 *
 * @property {String} notificationMessage
 */

/**
 * @typedef {Object} AssignmentsState
 *
 * @property {Number} currentTab
 * @property {Object| Boolean} dialog
 * @property {Object} sort
 * @property {String} sort.field
 * @property {String} sort.direction
 * @property {Object} currentAssignment
 */

/**
 * @typedef {Object} AccountState
 *
 * @property {Boolean} showExternalProfileDialog
 * @property {Boolean} showRemoveExternalProfileDialog
 */

/**
 * @typedef {Object} AchievementsAppState
 *
 * @property {FirebaseState} firebase
 * @property {AppFrameState} appFrame
 * @property {CoursesState} courses
 * @property {RootState} root
 * @property {AssignmentsState} assignments
 * @property {AccountState} account
 */
