import { createSelector } from "reselect";
import { USER_STATUSES } from "../../types/constants";

export const getCohort = state => state.cohort.cohort;

export const getUI = state => state.cohort.ui;

export const selectCohort = createSelector(
  getCohort,
  getUI,
  (cohort, ui) => {
    if (cohort && ui.sortState.field !== "paths") {
      cohort.courses = cohort.courses.sort((a, b) => {
        let aValue;
        let bValue;
        let result = 0;

        switch (ui.sortState.field) {
          case "rank":
          case "progress":
          case "participants":
          case "name":
            aValue = a[ui.sortState.field];
            bValue = b[ui.sortState.field];
            break;
          default:
            aValue = a.pathsProgress && a.pathsProgress[ui.sortState.field];
            bValue = b.pathsProgress && b.pathsProgress[ui.sortState.field];
        }
        if (aValue < bValue) result = -1;
        if (aValue > bValue) result = 1;

        return ui.sortState.direction === "asc" ? result : -result;
      });
    }
    return cohort;
  }
);

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

const getCohortMembersCompletedActivitiesCountOnPaths = state =>
  state.firebase.data.cohortMembersCompletedActivitiesCountOnPaths || {};
const getUserId = state => state.firebase.auth.uid;

export const calculateRanking = createSelector(
  getCohortMembersCompletedActivitiesCountOnPaths,
  getUserId,
  (membersPathsData, uid) => {
    const sortedPathRanking = Object.keys(membersPathsData).reduce(
      (paths, pathId) => {
        paths[pathId] = Object.keys(membersPathsData[pathId])
          .map(userId => ({
            userId,
            completedActivities: membersPathsData[pathId][userId],
          }))
          .sort(
            (userA, userB) =>
              userB.completedActivities - userA.completedActivities
          )
          .reduce((res, user) => {
            if(user.completedActivities !== res.completedActivities){
              res.rank++;
              res.completedActivities = user.completedActivities;
            }
            res.data[user.userId]={
              completedActivities: user.completedActivities,
              rank: res.rank
            };
            return res;
          }, { data: {}, rank: 0, completedActivities: -1 })
          .data;
        return paths;
      },
      {}
    );
    return sortedPathRanking;
  }
);
