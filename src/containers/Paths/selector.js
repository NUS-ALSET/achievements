import { createSelector } from "reselect";
import isEmpty from "lodash/isEmpty";

const getJoinedPaths = state => state.paths.joinedPaths;
const getPublicPaths = state => state.firebase.data.publicPaths;

export const publicPathSelector = createSelector(
  getPublicPaths,
  getJoinedPaths,
  (publicPaths, joinedPaths) => {
    let counter = false;
    if (joinedPaths && isEmpty(joinedPaths)) {
      return publicPaths;
    }
    let modifiedPublicPaths = { ...publicPaths };
    Object.keys(joinedPaths || {}).forEach(key => {
      if (publicPaths && publicPaths[key]) {
        modifiedPublicPaths[key].solutions = joinedPaths[key].solutions;
        modifiedPublicPaths[key].totalActivities =
          joinedPaths[key].totalActivities;
        counter = true;
      }
    });
    if (counter) {
      return modifiedPublicPaths;
    }
  }
);
