import { createSelector } from "reselect";
import { USER_STATUSES } from "../../types/constants";

export const getCohort = state => state.cohort.cohort;

export const getUI = state => state.cohort.ui;

export const selectCohort = createSelector(getCohort, getUI, (cohort, ui) => {
  if (cohort && ui.sortState.field !== "paths") {
    cohort.courses = cohort.courses.sort((a, b) => {
      let aValue = a.rank;
      let bValue = b.rank;
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
});

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
