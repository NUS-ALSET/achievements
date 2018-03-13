export const selectCohort = (state, ownProps) => {
  const cohortId = ownProps.match.params.cohortId;
  const cohort =
    (state.firebase.data.cohorts && state.firebase.data.cohorts[cohortId]) ||
    {};
  const cohortCourses =
    state.firebase.data.cohortCourses &&
    state.firebase.data.cohortCourses[cohortId];

  return {
    id: cohortId,
    ...cohort,
    courses: Object.keys(cohortCourses || {})
      .map(id => ({
        id,
        ...cohortCourses[id]
      }))
      .sort((a, b) => {
        if (a.progress > b.progress) {
          return -1;
        } else if (a.progress < b.progress) {
          return 1;
        } else if (a.participants > b.participants) {
          return -1;
        } else if (a.participants < b.participants) {
          return 1;
        }
        return 0;
      })
      .map((course, index) => {
        return { ...course, rank: index + 1 };
      })
  };
};
