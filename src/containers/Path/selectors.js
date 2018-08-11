import { createSelector } from "reselect";
import { ACTIVITY_TYPES } from "../../services/paths";

export const PATH_STATUS_OWNER = "owner";
export const PATH_STATUS_JOINED = "joined";
export const PATH_STATUS_NOT_JOINED = "not_joined";

const getUserId = state => state.firebase.auth.uid;

const getCodeCombatProfile = state =>
  state.firebase.data.userAchievements &&
  state.firebase.data.userAchievements[state.firebase.auth.uid] &&
  state.firebase.data.userAchievements[state.firebase.auth.uid].CodeCombat;

const getPath = (state, ownProps) =>
  ownProps.match.params.pathId[0] === "-"
    ? state.firebase.data.paths &&
      state.firebase.data.paths[ownProps.match.params.pathId] && {
        ...state.firebase.data.paths[ownProps.match.params.pathId],
        id: ownProps.match.params.pathId
      }
    : {
        id: ownProps.match.params.pathId,
        owner: ownProps.match.params.pathId,
        name: "Default"
      };

const getJoinedPaths = state => state.paths.joinedPaths || {};

const getActivities = (state, ownProps) => {
  const path = getPath(state, ownProps);

  return path && path.owner && state.firebase.data.activities;
};

const getActivitiesSolutions = state =>
  (state.firebase.data.completedActivities || {})[state.firebase.auth.uid] ||
  {};

export const pathStatusSelector = createSelector(
  getUserId,
  getJoinedPaths,
  getPath,
  (userId, joinedPaths, path) => {
    if (!path || path.owner === userId) {
      return PATH_STATUS_OWNER;
    }
    if (joinedPaths[path.id]) {
      return PATH_STATUS_JOINED;
    }
    return PATH_STATUS_NOT_JOINED;
  }
);

const getActivitySelector = problem => {
  switch (problem.type) {
    case ACTIVITY_TYPES.text.id:
      return problem.question || "Answer the question";
    case ACTIVITY_TYPES.profile.id:
      return "Enter CodeCombat profile";
    case ACTIVITY_TYPES.codeCombat.id:
      return `Finish "${problem.level}" level at CodeCombat`;
    case ACTIVITY_TYPES.codeCombatNumber.id:
      return `Finish ${problem.count} levels at CodeCombat`;
    case ACTIVITY_TYPES.jupyter.id:
      return "Solve task at Jupyter Colab";
    case ACTIVITY_TYPES.jupyterInline.id:
      return "Solve jupyter task";
    case ACTIVITY_TYPES.youtube.id:
      return "Watch Video and answer for questions";
    case ACTIVITY_TYPES.game.id:
      return "Win the game";
    case ACTIVITY_TYPES.jest.id:
      return "Pass the Test";
    default:
      return "Usual activity";
  }
};

export const pathActivitiesSelector = createSelector(
  getPath,
  getActivities,
  getActivitiesSolutions,
  (path, activities, solutions) => ({
    path: path,
    activities: Object.keys(activities || {})
      .map(id => ({
        ...activities[id],
        id,
        description: getActivitySelector(activities[id]),
        solved: solutions[path.id] && solutions[path.id][id]
      }))
      .filter(problem => problem.path === path.id)
      .sort(
        (a, b) =>
          a.orderIndex === b.orderIndex
            ? 0
            : a.orderIndex < b.orderIndex ? -1 : 1
      )
  })
);

export const codeCombatProfileSelector = createSelector(
  getCodeCombatProfile,
  profile => profile
);
