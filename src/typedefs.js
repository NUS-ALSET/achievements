/**
 * @typedef {Object} FirebaseState
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
 * @property {HTMLElement | Boolean} dropdownAnchorEl
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
 * @typedef {Object} AuthCheckState
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
 */

/**
 * @typedef {Object} ReduxState
 *
 * @property {FirebaseState} firebase
 * @property {AppFrameState} appFrame
 * @property {CoursesState} courses
 * @property {AuthCheckState} authCheck
 * @property {AssignmentsState} assignments
 * @property {AccountState} account
 */
