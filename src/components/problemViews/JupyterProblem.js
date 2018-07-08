/**
 * @file JupyterProblem container module
 * @author Theodor Shaytanov <theodor.shaytanov@gmail.com>
 * @created 08.03.18
 */

import React, { Fragment } from "react";
import PropTypes from "prop-types";

import { problemSolveUpdate } from "../../containers/Activity/actions";
import JupyterNotebook from "./JupyterNotebook";

class JupyterProblem extends React.PureComponent {
  static propTypes = {
    dispatch: PropTypes.func.isRequired,
    onChange: PropTypes.func,
    problem: PropTypes.object.isRequired,
    solution: PropTypes.object
  };

  onSolutionRefreshClick = solutionURL => {
    const { dispatch, problem } = this.props;

    if (this.props.onChange) {
      this.props.onChange(solutionURL);
    }

    dispatch(
      problemSolveUpdate(problem.pathId, problem.problemId, solutionURL)
    );
  };

  render() {
    const {
      /** @type {JupyterPathProblem} */
      problem,
      solution
    } = this.props;

    return (
      <Fragment>
        <JupyterNotebook
          action={this.onSolutionRefreshClick}
          defaultValue={solution && solution.id}
          persistent={true}
          solution={solution}
          title="Calculated Solution"
        />
        {solution &&
          solution.provided && (
            <JupyterNotebook
              solution={{
                json: solution.provided
              }}
              title="Provided Solution"
            />
          )}
        <JupyterNotebook
          solution={{ json: problem.problemJSON }}
          title="Problem"
        />
      </Fragment>
    );
  }
}

export default JupyterProblem;
