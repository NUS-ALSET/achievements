import { createSelector } from "reselect";
import isEmpty from "lodash/isEmpty";

const getJoinedPath = state => state.paths.joinedPaths;
const getPublicPath = state => state.firebase.data.publicPaths;

export const publicPathSelector = createSelector(
  getPublicPath,
  getJoinedPath,
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
