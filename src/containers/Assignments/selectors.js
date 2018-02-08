// Tab with instructor view
const INSTRUCTOR_TAB_VIEW = 2;

/**
 * Get Solutions (or single solution)
 *
 * @param {ReduxState} state
 * @param {String} courseId
 * @param {String} studentId
 * @param {Object} [options]
 * @param {Boolean} [options.onlyVisible]
 * @returns {*}
 */
const getStudentSolutions = (state, courseId, studentId, options) => {
  let result;
  options = options || {};
  const achievements = getFrom(state.firebase.data.userAchievements, studentId);
  const assignments = getFrom(state.firebase.data.assignments, courseId);

  if (!options.onlyVisible) {
    result = getFrom(
      getFrom(state.firebase.data.solutions, courseId),
      studentId
    );
  }
  result =
    result ||
    getFrom(getFrom(state.firebase.data.visibleSolutions, courseId), studentId);

  Object.keys(result).forEach(assignmentId => {
    const assignment = assignments[assignmentId] || {};
    const solution = result[assignmentId];

    if (options.onlyVisible && !assignment.solutionVisible) {
      result[assignmentId] = solution ? "Complete" : "";
      return true;
    }

    if (!achievements.CodeCombat) {
      return true;
    }

    switch (assignment.questionType) {
      case "Profile":
        if (solution) {
          result[assignmentId] = `${achievements.CodeCombat.id} (${
            achievements.CodeCombat.totalAchievements
          })`;
        }
        return true;
      case "CodeCombat":
        if (solution) {
          result[assignmentId] = "Complete";
        }
        return true;
      default:
        return true;
    }
  });

  return result;
};

// Returns value from
const getFrom = (source, field) => {
  return (source || {})[field] || {};
};

/**
 *
 * @param {ReduxState} state
 * @param {Object} ownProps
 * @returns {AssignmentProps}
 */
export const getAssignments = (state, ownProps) => {
  const courseId = ownProps.match.params.courseId;
  const assignments = getFrom(state.firebase.data.assignments, courseId);
  const sortedMembers = {};
  const instructorView = state.assignments.currentTab === INSTRUCTOR_TAB_VIEW;
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
        bValue = b.solutions[state.assignments.sort.field];
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
    currentUser: {
      id: state.firebase.auth.uid,
      name: state.firebase.auth.displayName,
      achievements: getFrom(
        state.firebase.data.userAchievements,
        state.firebase.auth.uid
      )
    },
    ui: {
      sortState: state.assignments.sort,
      currentTab: state.assignments.currentTab,
      dialog: state.assignments.dialog,
      currentAssignment: state.assignments.currentAssignment
    },
    course: {
      id: courseId,
      ...getFrom(state.firebase.data.courses, courseId),
      members: members.length ? sortedMembers : false,
      assignments: Object.keys(assignments).map(id => ({
        ...assignments[id],
        id
      }))
    }
  };
};
