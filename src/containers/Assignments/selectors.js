// Tab with instructor view
const INSTRUCTOR_TAB_EDIT = 1;
const INSTRUCTOR_TAB_VIEW = 2;

/**
 * Get Solutions for student. It compares `/solutions` and `/visibleSolutions` refs and returns solution data with
 * flags - is concrete solution published, validated and/or rejected by instructor
 *
 * @param {AchievementsAppState} state
 * @param {String} courseId
 * @param {String} studentId
 * @param {Object} [options]
 * @param {Boolean} [options.onlyVisible]
 * @returns {*}
 */
const getStudentSolutions = (state, courseId, studentId, options = {}) => {
  const achievements = getFrom(state.firebase.data.userAchievements, studentId);
  const assignments = getFrom(state.firebase.data.assignments, courseId);

  // If we need only visible(published) results then we ignore real ones
  // It could be used at `assignments` tab viewed by course instructor,
  // since real solutions will be shown only at `instructor view` tab
  const solutions = options.onlyVisible
    ? {}
    : getFrom(getFrom(state.firebase.data.solutions, courseId), studentId);

  // Published (visible) results should be fetched in any case, to get info - was that solution published
  const publishedSolutions = getFrom(
    getFrom(state.firebase.data.visibleSolutions, courseId),
    studentId
  );
  const result = Object.assign({}, solutions, publishedSolutions);

  Object.keys(Object.assign({}, solutions, publishedSolutions)).forEach(
    assignmentId => {
      const assignment = assignments[assignmentId] || {};
      let solution =
        solutions[assignmentId] || publishedSolutions[assignmentId];
      const userAchievements = achievements.CodeCombat || {};
      const published = !!publishedSolutions[assignmentId];

      solution = solution && solution.value;

      if (!solution) {
        return true;
      }

      if (options.onlyVisible && !assignment.solutionVisible) {
        solution = "Completed";
      }

      switch (assignment.questionType) {
        case "Text":
          result[assignmentId] = {
            value: solution,
            validated: true,
            published
          };
          return true;
        case "Profile":
          result[assignmentId] = {
            published,
            validated: userAchievements.id === solution,
            value: `${userAchievements.id} (${
              userAchievements.totalAchievements
            })`
          };
          return true;
        case "CodeCombat":
        case "CodeCombat_Number":
          result[assignmentId] = {
            published,
            validated: userAchievements.id === solution,
            value: "Completed"
          };
          return true;
        default:
          return true;
      }
    }
  );

  return result;
};

/**
 * Returns value from source object or empty object if no value exists
 * @param {Object} source
 * @param {String} field
 * @returns {*} value
 */
const getFrom = (source, field) => {
  return (source || {})[field] || {};
};

/**
 *
 * @param {AchievementsAppState} state
 * @returns {Object} ui props
 */
export const getAssignmentsUIProps = state => ({
  sortState: state.assignments.sort,
  currentTab: state.assignments.currentTab,
  dialog: state.assignments.dialog,
  currentAssignment: state.assignments.currentAssignment
});

export const getCurrentUserProps = state => ({
  id: state.firebase.auth.uid,
  name: state.firebase.auth.displayName,
  achievements: getFrom(
    state.firebase.data.userAchievements,
    state.firebase.auth.uid
  )
});

export const getCourseProps = (state, ownProps) => {
  const courseId = ownProps.match.params.courseId;
  const assignments = getFrom(state.firebase.data.assignments, courseId);
  const sortedMembers = {};
  const instructorView = state.assignments.currentTab === INSTRUCTOR_TAB_VIEW;
  const assignmentsEdit = state.assignments.currentTab === INSTRUCTOR_TAB_EDIT;
  const now = new Date().getTime();
  const members = Object.keys(
    getFrom(state.firebase.data.courseMembers, courseId)
  )
    .map(id => ({
      id: id,
      name: getFrom(state.firebase.data.users, id).displayName,
      achievements: getFrom(state.firebase.data.userAchievements, id),
      solutions: getStudentSolutions(state, courseId, id, {
        onlyVisible: !(instructorView || id === state.firebase.auth.uid)
      })
    }))
    .sort((a, b) => {
      let aValue = a.name;
      let bValue = b.name;
      let result = 0;

      if (state.assignments.sort.field !== "studentName") {
        aValue = a.solutions[state.assignments.sort.field];
        aValue = aValue && aValue.value;
        bValue = b.solutions[state.assignments.sort.field];
        bValue = bValue && bValue.value;
      }
      aValue = aValue || "";
      bValue = bValue || "";

      if (aValue > bValue) {
        result = 1;
      } else if (aValue < bValue) {
        result = -1;
      }
      return state.assignments.sort.direction === "asc" ? result : -result;
    });

  members.forEach(member => {
    sortedMembers[member.id] = member;
    return true;
  });

  return {
    id: courseId,
    ...getFrom(state.firebase.data.courses, courseId),
    members: members.length ? sortedMembers : false,
    assignments: Object.keys(assignments)
      .map(id => ({
        ...assignments[id],
        id
      }))
      .filter(
        assignment =>
          assignmentsEdit ||
          (assignment.visible &&
            new Date(assignment.open).getTime() < now &&
            new Date(assignment.deadline).getTime() > now)
      )
  };
};
