/**
 * @typedef {Object} CourseMember
 *
 * @property {String} id
 * @property {String} name
 * @property {Object} verified
 * @property {Object} solutions
 * @property {Object} achievements
 */

/**
 * @typedef {Object} AssignmentCourse
 *
 * @property {String} id
 * @property {String} name
 * @property {String} owner
 * @property {String} instructorName
 * @property {Boolean} loaded
 * @property {Object | Boolean} members
 * @property {Array<Assignment>} assignments
 * @property {Number} totalAssignments
 * @property {Object} solutions
 * @property {Boolean} watchSeveralPaths
 */

/**
 * @typedef {Object} AssignmentProps
 *
 * @property {Object} ui
 * @property {Number} ui.currentTab
 * @property {Object} ui.currentAssignment
 * @property {Object} ui.sortState
 * @property {String} ui.sortState.field
 * @property {String} ui.sortState.direction
 * @property {Object | Boolean} ui.dialog
 * @property {String} ui.dialog.type
 * @property {String} ui.dialog.value
 * @property {Object} currentUser
 * @property {String} currentUser.id
 * @property {String} currentUser.name
 * @property {Object} currentUser.achievements
 * @property {AssignmentCourse} course
 */
