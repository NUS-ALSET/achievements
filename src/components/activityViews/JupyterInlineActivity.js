/**
 * @file JupyterColabActivity container module
 * @author Theodor Shaytanov <theodor.shaytanov@gmail.com>
 * @created 08.03.18
 */

import React, { Fragment } from "react";
import PropTypes from "prop-types";

import cloneDeep from "lodash/cloneDeep";
import isEqual from "lodash/isEqual";

import {
  problemSolutionRefreshFail,
  problemSolveUpdate
} from "../../containers/Activity/actions";
import { notificationShow } from "../../containers/Root/actions";
import JupyterNotebook from "./JupyterNotebook";
import Typography from "@material-ui/core/Typography";

class JupyterInlineActivity extends React.PureComponent {
  static propTypes = {
    dispatch: PropTypes.func.isRequired,
    onChange: PropTypes.func,
    problem: PropTypes.object,
    solution: PropTypes.object,
    readOnly : PropTypes.bool
  };

  state = {
    solutionJSON: false
  };

  componentWillReceiveProps(nextProps){
    const { onChange, problem ,solution} = this.props;
    const solutionJSON = cloneDeep(problem.problemJSON);  
    if(onChange && solutionJSON && !isEqual(nextProps.solution, solution)){
    const final={
      ...solutionJSON,
      status : nextProps.solution.checked ? nextProps.solution.failed ? 'FAILED' : 'COMPLETED' : 'NOT_EXECUTED'
    };
    onChange(final);
    }
  }
  onSolutionRefreshClick = value => {
    const { dispatch, onChange, problem } = this.props;

    const solutionJSON = cloneDeep(problem.problemJSON);

    solutionJSON.cells[Number(problem.code)].source = value
      .split("\n")
      .map(line => line + "\n");

    this.setState({
      solutionJSON: solutionJSON || false
    });
    dispatch(problemSolutionRefreshFail());
    if (onChange) {
      onChange(solutionJSON);
    }
    if (!solutionJSON) {
      return dispatch(notificationShow("Code wasn't changed"));
    }

    return dispatch(
      problemSolveUpdate(problem.pathId, problem.problemId, solutionJSON)
    );
  };

  getCalculatedSolution = solution => {
    if (!solution) {
      return "";
    }
    if (solution.failed) {
      return (
        <Typography color="error">
          (Error- Final output should be empty)
        </Typography>
      );
    }
    if (solution.loading) {
      return <Typography color="textSecondary">(Checking)</Typography>;
    }
    if (solution.checked) {
      return <Typography color="primary">(Passed)</Typography>;
    }
  };

  // Move it to paths
  getSolutionCode = (solution, problem) =>
    (this.state.solutionJSON &&
      this.state.solutionJSON.cells &&
      this.state.solutionJSON.cells[Number(problem.code)].source
        .join("")
        .replace(/\n\n/g, "\n")) ||
    (solution &&
      solution.cells &&
      solution.cells[Number(problem.code)].source
        .join("")
        .replace(/\n\n/g, "\n")) ||
    (problem &&
      problem.problemJSON &&
      problem.problemJSON.cells &&
      problem.problemJSON.cells[Number(problem.code)].source
        .join("")
        .replace(/\n\n/g, "\n"));

  render() {
    const {
      /** @type {JupyterPathProblem} */
      problem,
      solution,
      readOnly
    } = this.props;
    
    return (
      <Fragment>
        <JupyterNotebook
          action={this.onSolutionRefreshClick}
          defaultValue={this.getSolutionCode(solution, problem)}
          persistent={true}
          richEditor={true}
          solution={false}
          readOnly={readOnly}
          title={readOnly ? "Submitted Code" : "Edit code"}
        />
        {solution &&
          (solution.json || solution.loading) && (
            <JupyterNotebook
              solution={solution}
              readOnly={readOnly}
              title={
                <Fragment>
                  Calculated Solution
                  {this.getCalculatedSolution(solution)}
                </Fragment>
              }
            />
          )}
        {solution &&
          solution.provided && (
            <JupyterNotebook
              readOnly={readOnly}
              solution={{ json: solution.provided }}
              title="Provided solution"
            />
          )}
        <JupyterNotebook
          readOnly={readOnly}
          solution={{ json: problem.problemJSON }}
          title="Problem"
        />
      </Fragment>
    );
  }
}

export default JupyterInlineActivity;
