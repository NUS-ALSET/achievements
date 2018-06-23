/**
 * @file ProblemView container module
 * @author Theodor Shaytanov <theodor.shaytanov@gmail.com>
 * @created 11.03.18
 */
/* eslint-disable react/display-name */

import React from "react";
import PropTypes from "prop-types";
import ReactLoadable from "react-loadable";

const LoadableJupyterProblem = ReactLoadable({
  loader: () => import("../../components/problemViews/JupyterProblem"),
  loading: () => <div>Loading...</div>
});
const LoadableJupyterInlineProblem = ReactLoadable({
  loader: () => import("../../components/problemViews/JupyterInlineProblem"),
  loading: () => <div>Loading...</div>
});
const LoadableYouTubeProblem = ReactLoadable({
  loader: () => import("../../components/problemViews/YouTubeProblem"),
  loading: () => <div>Loading...</div>
});

class ProblemView extends React.PureComponent {
  static propTypes = {
    dispatch: PropTypes.func,
    match: PropTypes.object,
    pathProblem: PropTypes.any,
    onProblemChange: PropTypes.func.isRequired,
    solution: PropTypes.any
  };

  render() {
    const { dispatch, onProblemChange, pathProblem, solution } = this.props;
    // debugger;
    if (!pathProblem) {
      return <div>Loading</div>;
    }

    return (
      <div style={{ textAlign: "center", overflowX: "hidden" }}>
        {pathProblem.type === "jupyter" && (
          <LoadableJupyterProblem
            dispatch={dispatch}
            onChange={onProblemChange}
            problem={pathProblem}
            solution={solution}
          />
        )}
        {pathProblem.type === "jupyterInline" && (
          <LoadableJupyterInlineProblem
            dispatch={dispatch}
            onChange={onProblemChange}
            problem={pathProblem}
            solution={solution}
          />
        )}
        {pathProblem.type === "youtube" && (
          <LoadableYouTubeProblem
            dispatch={dispatch}
            onChange={onProblemChange}
            problem={pathProblem}
            solution={solution}
          />
        )}
      </div>
    );
  }
}

export default ProblemView;
