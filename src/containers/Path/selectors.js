import { createSelector } from "reselect";

export const PATH_STATUS_OWNER = "owner";
export const PATH_STATUS_JOINED = "joined";
export const PATH_STATUS_NOT_JOINED = "not_joined";

const getUserId = state => state.firebase.auth.uid;

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

const getProblems = (state, ownProps) => {
  const path = getPath(state, ownProps);

  return (
    path &&
    path.owner &&
    state.firebase.data.problems &&
    state.firebase.data.problems[path.owner]
  );
};

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

export const pathProblemsSelector = createSelector(
  getPath,
  getProblems,
  (path, problems) => ({
    path: path,
    problems: Object.keys(problems || {})
      .map(id => ({ ...problems[id], id }))
      .filter(
        problem =>
          path.id === path.owner ? !problem.path : problem.path === path.id
      )
  })
);
