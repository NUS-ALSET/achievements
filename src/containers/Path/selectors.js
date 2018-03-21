import { createSelector } from "reselect";

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

const getProblems = (state, ownProps) => {
  const path = getPath(state, ownProps);

  return (
    path &&
    path.owner &&
    state.firebase.data.problems &&
    state.firebase.data.problems[path.owner]
  );
};

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
