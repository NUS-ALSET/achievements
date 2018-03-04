/**
 * Returns value from source object or empty object if no value exists
 * @param {Object} source
 * @param {String} field
 * @returns {*} value
 */
const getFrom = (source, field) => {
  return (source || {})[field] || {};
};

export const getProblems = state => {
  const problemsMap = getFrom(
    state.firebase.data.problems,
    state.firebase.auth.uid
  );
  return Object.keys(problemsMap)
    .map(id => ({ ...problemsMap[id], id }))
    .filter(
      problem =>
        state.paths.selectedPathId
          ? problem.path === state.paths.selectedPathId
          : !problem.path
    );
};
