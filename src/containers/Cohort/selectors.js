import { USER_STATUSES } from "../../types/constants";

export const selectUserStatus = state => {
  const uid = state.firebase.auth.uid;
  const cohort = state.cohort.cohort;

  if (!(cohort && uid)) {
    return USER_STATUSES.viewer;
  }

  if (uid === cohort.owner) {
    return USER_STATUSES.owner;
  }

  if (cohort.assistantKeys && cohort.assistantKeys.includes(uid)) {
    return USER_STATUSES.assistant;
  }

  return USER_STATUSES.viewer;
};

export const selectCohort = (state, ownProps) => {
  const cohortId = ownProps.match.params.cohortId;
  const cohort = state.firebase.data.cohort;
  const cohortCourses = state.firebase.data.cohortCourses;
  const paths = state.firebase.data.paths || {};

  if (!cohort) {
    return null;
  }
  return {
    id: cohortId,
    ...cohort,
    pathsData: (cohort.paths || []).map(id => paths[id]),
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
