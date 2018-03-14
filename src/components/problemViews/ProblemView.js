/**
 * @file ProblemView container module
 * @author Theodor Shaytanov <theodor.shaytanov@gmail.com>
 * @created 11.03.18
 */

import React, { Fragment } from "react";
import PropTypes from "prop-types";
import JupyterProblem from "../../components/problemViews/JupyterProblem";
import YouTubeProblem from "../../components/problemViews/YouTubeProblem";

class ProblemView extends React.PureComponent {
  static propTypes = {
    classes: PropTypes.object.isRequired,
    dispatch: PropTypes.func,
    match: PropTypes.object,
    onCommit: PropTypes.func,
    pathProblem: PropTypes.any,
    solution: PropTypes.string,
    solutionKey: PropTypes.any,
    solutionJSON: PropTypes.any
  };

  render() {
    const {
      pathProblem,
      classes,
      dispatch,
      onCommit,
      solution,
      solutionJSON,
      solutionKey
    } = this.props;

    if (!pathProblem) {
      return <div>Loading</div>;
    }

    return (
      <Fragment>
        {pathProblem.type === "jupyter" && (
          <JupyterProblem
            classes={classes}
            dispatch={dispatch}
            problem={pathProblem}
            solution={solution}
            solutionJSON={solutionJSON}
            solutionKey={solutionKey}
          />
        )}
        {pathProblem.type === "youtube" && (
          <div style={{ textAlign: "center" }}>
            <YouTubeProblem
              classes={classes}
              dispatch={dispatch}
              onCommit={onCommit}
              problem={pathProblem}
            />
          </div>
        )}
      </Fragment>
    );
  }
}

export default ProblemView;
