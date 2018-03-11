/**
 * Returns value from source object or empty object if no value exists
 * @param {Object} source
 * @param {String} field
 * @returns {*} value
 */
const getFrom = (source, field) => {
  return (source || {})[field] || {};
};

export const getProblem = (state, ownProps) => {
  return getFrom(
    getFrom(state.firebase.data.problems, ownProps.match.params.userId),
    ownProps.match.params.problemId
  );
};
