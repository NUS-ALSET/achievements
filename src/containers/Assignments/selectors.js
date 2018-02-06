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
  const members = getFrom(state.firebase.data.courseMembers, courseId);
  const sortedMembers = {};

  Object.keys(members)
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
      sortedMembers[id] = {
        id,
        name: getFrom(state.firebase.data.users, id).displayName,
        achievements: getFrom(state.firebase.data.userAchievements, id),
        solutions: getFrom(
          getFrom(state.firebase.data.visibleSolutions, courseId),
          id
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
      dialog: state.assignments.dialog
    },
    course: {
      id: courseId,
      owner: getFrom(state.firebase.data.courses, courseId).owner,
      members: sortedMembers,
      assignments: Object.keys(assignments).map(id => ({
        ...assignments[id],
        id
      }))
    }
  };
};
