import { createSelector } from "reselect";

const getRecommendation = state => state.firebase.data.userRecommendations;
const getUserId = state => state.firebase.auth.uid;

export const userRecommendationsSelector = createSelector(
  getUserId,
  getRecommendation,
  (uid, userRecs) => {
    userRecs = userRecs || {};
    userRecs = userRecs[uid] || {};

    return Object.keys(userRecs || {})
      .filter(recsKey => typeof userRecs[recsKey] === "object")
      .map(recsKey => ({
        title: userRecs[recsKey].title,
        items: Object.keys(userRecs[recsKey] || {})
          .filter(key => key !== "title")
          .map(key => userRecs[recsKey][key])
      }));
  }
);
