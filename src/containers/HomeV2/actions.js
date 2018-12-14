export const HOME_OPEN_RECOMMENDATION = "HOME_OPEN_RECOMMENDATION";
export const homeOpenRecommendation = (
  recommendationType,
  recommendations,
  activityId,
  pathId
) => ({
  type: HOME_OPEN_RECOMMENDATION,
  recommendationType,
  recommendations,
  activityId,
  pathId
});

export const UPDATE_RECOMMENDATION = "UPDATE_RECOMMENDATION";
export const updateRecommendation = () => ({
  type: UPDATE_RECOMMENDATION
});
