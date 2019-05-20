import { createSelector } from "reselect";

const getJoinedPath = state => state.paths.joinedPaths;
const getPublicPath = state => state.firebase.data.publicPaths;

export const publicPathSelector = createSelector(
  getPublicPath,
  getJoinedPath,
  (publicPaths, joinedPaths) => {
    //let counter = false;
    Object.keys(publicPaths || {}).forEach(key => {
      if (joinedPaths && joinedPaths[key]) {
        publicPaths[key].solutions = joinedPaths[key].solutions;
        publicPaths[key].totalActivities = joinedPaths[key].totalActivities;
        //counter = true;
      }
    });
    //FIXIT : fix progress to be rendered on initial load of paths screen
    return publicPaths;
  }
);
