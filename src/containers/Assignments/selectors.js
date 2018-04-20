// Tab with instructor view
const INSTRUCTOR_TAB_EDIT = 1;
const INSTRUCTOR_TAB_VIEW = 2;

/**
 * Get Solutions for student. It compares `/solutions` and `/visibleSolutions` refs and returns solution data with
 * flags - is concrete solution published, validated and/or rejected by instructor
 *
 * @param {AchievementsAppState} state
 * @param {String} courseId
 * @param {String} student
 * @param {Object} [options]
 * @param {Boolean} [options.onlyVisible]
 * @returns {*}
 */
const getStudentSolutions = (state, courseId, student, options = {}) => {
  const achievements = student.achievements || {};
  const assignments = getFrom(state.firebase.data.assignments, courseId);

  // If we need only visible(published) results then we ignore real ones
  // It could be used at `assignments` tab viewed by course instructor,
  // since real solutions will be shown only at `instructor view` tab
  const solutions = options.onlyVisible
    ? {}
    : getFrom(getFrom(state.firebase.data.solutions, courseId), student.id);

  // Published (visible) results should be fetched in any case, to get info - was that solution published
  const publishedSolutions = getFrom(
    getFrom(state.firebase.data.visibleSolutions, courseId),
    student.id
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
            orderValue: userAchievements.totalAchievements,
            value: userAchievements.id
              ? `${userAchievements.id} (${userAchievements.totalAchievements})`
              : ""
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
        case "PathProblem":
          result[assignmentId] = {
            published,
            validated: userAchievements.id === solution,
            originalSolution: result[assignmentId],
            value: "Completed"
          };
          return true;
        case "PathProgress":
          result[assignmentId] = {
            published,
            validated: userAchievements.id === solution,
            originalSolution: result[assignmentId],
            value: solution
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

const isOwner = (state, ownProps) =>
  state.firebase.auth.uid &&
  getFrom(
    getFrom(state.firebase.data.courses, ownProps.match.params.courseId),
    "owner"
  ) === state.firebase.auth.uid;
const isAssistant = (state, ownProps) =>
  getFrom(state.firebase.data.courseAssistants, ownProps.match.params.courseId)[
    state.firebase.auth.uid
  ];

export const getCurrentUserProps = (state, ownProps) => ({
  id: state.firebase.auth.uid,
  name: getFrom(state.firebase.data.users, state.firebase.auth.uid),
  isOwner: isOwner(state, ownProps),
  isAssistant: isOwner(state, ownProps) || isAssistant(state, ownProps),
  achievements: getFrom(
    state.firebase.data.userAchievements,
    state.firebase.auth.uid
  )
});

function getValueToSort(solutions, sortField) {
  let aValue = solutions[sortField];

  if (!aValue) {
    return aValue;
  }
  if (aValue.orderValue !== undefined) {
    return aValue.orderValue;
  }
  return aValue.value;
}

/**
 *
 * @param {AchievementsAppState} state
 * @param {Object} ownProps
 * @returns {AssignmentCourse} course props
 */
export const getCourseProps = (state, ownProps) => {
  const courseId = ownProps.match.params.courseId;
  const assignments = getFrom(state.firebase.data.assignments, courseId);
  const sortedMembers = {};
  const instructorView = state.assignments.currentTab === INSTRUCTOR_TAB_VIEW;
  const assignmentsEdit = state.assignments.currentTab === INSTRUCTOR_TAB_EDIT;
  const now = new Date().getTime();
  const members = state.assignments.courseMembers
    .map(courseMember => ({
      ...courseMember,
      solutions: getStudentSolutions(state, courseId, courseMember, {
        onlyVisible: !(
          instructorView || courseMember.id === state.firebase.auth.uid
        )
      })
    }))
    .sort((a, b) => {
      let aValue = a.name;
      let bValue = b.name;
      let result = 0;

      if (state.assignments.sort.field !== "studentName") {
        aValue = getValueToSort(a.solutions, state.assignments.sort.field);
        bValue = getValueToSort(b.solutions, state.assignments.sort.field);
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
        id,
        progress: `${members.filter(member => !!member.solutions[id]).length}/${
          members.length
        }`
      }))
      .filter(
        assignment =>
          assignmentsEdit ||
          (assignment.visible &&
            new Date(assignment.open).getTime() < now &&
            new Date(assignment.deadline).getTime() > now)
      )
      .sort((a, b) => {
        if (a.orderIndex > b.orderIndex) {
          return 1;
        } else if (a.orderIndex === b.orderIndex) {
          return 0;
        }
        return -1;
      })
  };
};
