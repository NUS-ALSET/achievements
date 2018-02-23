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
    name: cohort.name,
    owner: cohort.owner,
    courses: Object.keys(cohortCourses || {})
      .map(id => ({
        id,
        ...cohortCourses[id]
      }))
      .sort(
        (a, b) =>
          a.participants > b.participants
            ? -1
            : a.participants < b.participants ? 1 : 0
      )
      .map((course, index) => {
        return { ...course, rank: index + 1 };
      })
  };
};
