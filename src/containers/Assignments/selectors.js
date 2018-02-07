// Returns value from
const getFrom = (source, field) => {
  return (source || {})[field] || {};
};

const processSolutions = (solutions, assignments, achievements) => {
  // Clone solutions to keep it immutable
  solutions = { ...solutions };
  Object.keys(solutions).forEach(assignmentId => {
    const assignment = assignments[assignmentId] || {};
    const solution = solutions[assignmentId];

    if (!achievements.CodeCombat) {
      return true;
    }

    switch (assignment.questionType) {
      case "Profile":
        if (solution) {
          solutions[assignmentId] = `${achievements.CodeCombat.id} (${
            achievements.CodeCombat.totalAchievements
          })`;
        }
        return true;
      default:
        if (solution) {
          solutions[assignmentId] = "Complete";
        }
        return true;
    }
  });

  return solutions;
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
  const members = state.firebase.data.courseMembers;
  const sortedMembers = {};

  Object.keys(getFrom(members, courseId))
    .sort((a, b) => {
      let aValue = getFrom(state.firebase.data.users, a).displayName;
      let bValue = getFrom(state.firebase.data.users, b).displayName;
      let result = 0;

      if (state.assignments.sort.field !== "studentName") {
        aValue = getFrom(
          getFrom(getFrom(state.firebase.data.visibleSolutions, courseId), a),
          state.assignments.sort.field
        );
        bValue = getFrom(
          getFrom(getFrom(state.firebase.data.visibleSolutions, courseId), b),
          state.assignments.sort.field
        );
      }

      if (aValue > bValue) {
        result = 1;
      } else if (aValue < bValue) {
        result = -1;
      }
      return state.assignments.sort.direction === "asc" ? result : -result;
    })
    .forEach(id => {
      const achievements = getFrom(state.firebase.data.userAchievements, id);
      sortedMembers[id] = {
        id,
        name: getFrom(state.firebase.data.users, id).displayName,
        achievements,
        solutions: processSolutions(
          getFrom(getFrom(state.firebase.data.visibleSolutions, courseId), id),
          assignments,
          achievements
        )
      };
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
      members: members ? sortedMembers : false,
      assignments: Object.keys(assignments).map(id => ({
        ...assignments[id],
        id
      }))
    }
  };
};
