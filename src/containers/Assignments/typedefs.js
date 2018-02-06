/**
 * @typedef {Object} AssignmentCourse
 *
 * @property {String} id
 * @property {String} name
 * @property {Boolean} loaded
 * @property {Object} members
 * @property {Array<Object>} assignments
 * @property {Object} solutions

 */

/**
 * @typedef {Object} AssignmentProps
 *
 * @property {Object} ui
 * @property {Number} ui.currentTab
 * @property {Object} ui.sortState
 * @property {String} ui.sortState.field
 * @property {String} ui.sortState.direction
 * @property {Object | Boolean} ui.dialog
 * @property {Object} currentUser
 * @property {String} currentUser.id
 * @property {String} currentUser.name
 * @property {Object} currentUser.achievements
 * @property {AssignmentCourse} course
 */
