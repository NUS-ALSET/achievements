import { createSelector } from "reselect";

const getJoinedPath = state => state.paths.joinedPaths;
const getPublicPath = state => state.firebase.data.publicPaths;

export const publicPathSelector = createSelector(
  getPublicPath,
  getJoinedPath,
  (publicPaths, joinedPaths) => {
    let counter = false;
    Object.keys(joinedPaths || {}).forEach(key => {
      if (publicPaths && publicPaths[key]) {
        publicPaths[key].solutions = joinedPaths[key].solutions;
        publicPaths[key].totalActivities = joinedPaths[key].totalActivities;
        counter = true;
      }
    });
    if (counter) {
      return publicPaths;
    } else {
      return undefined;
    }
  }
);
