import { createSelector } from "reselect";
import { PROBLEMS_TYPES } from "../../services/paths";

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

const getProblemSolutions = state => state.path.problemSolutions || {};

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

const getProblemDescription = problem => {
  switch (problem.type) {
    case PROBLEMS_TYPES.text.id:
      return problem.question || "Answer the question";
    case PROBLEMS_TYPES.profile.id:
      return "Enter CodeCombat profile";
    case PROBLEMS_TYPES.codeCombat.id:
      return `Finish "${problem.level}" level at CodeCombat`;
    case PROBLEMS_TYPES.codeCombatNumber.id:
      return `Finish ${problem.count} levels at CodeCombat`;
    case PROBLEMS_TYPES.jupyter.id:
      return "Solve task at Jupyter Colab";
    case PROBLEMS_TYPES.jupyterInline.id:
      return "Solve jupyter task";
    case PROBLEMS_TYPES.youtube.id:
      return "Watch Video and answer for questions";
    case PROBLEMS_TYPES.game.id:
      return "Win the game";
    default:
      return "Usual activity";
  }
};

export const pathProblemsSelector = createSelector(
  getPath,
  getProblems,
  getProblemSolutions,
  (path, problems, solutions) => ({
    path: path,
    problems: Object.keys(problems || {})
      .map(id => ({
        ...problems[id],
        id,
        description: getProblemDescription(problems[id]),
        solved: solutions[id]
      }))
      .filter(
        problem =>
          path.id === path.owner ? !problem.path : problem.path === path.id
      )
  })
);
