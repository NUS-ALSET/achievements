/**
 * @file JupyterColabActivity container module
 * @author Theodor Shaytanov <theodor.shaytanov@gmail.com>
 * @created 08.03.18
 */

import React, { Fragment } from "react";
import PropTypes from "prop-types";
import cloneDeep from "lodash/cloneDeep";
import Typography from "@material-ui/core/Typography";
import { Button } from "@material-ui/core";

import {
  problemSolutionRefreshFail,
  problemSolveUpdate
} from "../../containers/Activity/actions";
import { notificationShow } from "../../containers/Root/actions";
import JupyterNotebook from "./JupyterNotebook";

class JupyterInlineActivity extends React.PureComponent {
  static propTypes = {
    dispatch: PropTypes.func.isRequired,
    onChange: PropTypes.func,
    problem: PropTypes.object,
    solution: PropTypes.object,
    readOnly : PropTypes.bool,
    showCommitBtnOnTop : PropTypes.bool
  };

  state = {
    solutionJSON: false,
    showCommitBtn: false,
    statusText : null
  };
  componentWillReceiveProps(nextProps) {
    if(
      (nextProps.solution || {}).checked &&
      (
        nextProps.showCommitBtnOnTop ||
        !(nextProps.solution || {}).failed
        )
    ) {
      this.setState({ showCommitBtn: true });
    } else {
      this.setState({ showCommitBtn: false });
    }
    if(nextProps.solution.statusText){
      this.setState({ statusText : nextProps.solution.statusText });
    }else{
      this.setState({ statusText : null })
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
          (There is something wrong with your solution...)
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
        {
          this.state.statusText &&
          <div style={{ textAlign : 'left',fontWeight : 'bold',paddingLeft : '10px',color : '#d2691e' }}>
            <b>Execution Status: </b> {this.state.statusText }
          </div>
        }
        {this.state.showCommitBtn &&
          <div style={{ height: '20px' }}>
            <Button
              color="primary"
              variant="raised"
              style={{ float: 'right', marginBottom: '10px' }}
              onClick={() => this.props.onCommit()}
            >
              Commit Solution
            </Button>
          </div>
        }
        {(solution && (solution.json || solution.loading))
          ? (
            <JupyterNotebook
              readOnly={readOnly}
              solution={solution}
              title={
                <Fragment>
                  Solution Check
                  {this.getCalculatedSolution(solution)}
                </Fragment>
              }
            />
          )
        : (
          <JupyterNotebook
            readOnly={readOnly}
            solution={{ json: problem.problemJSON }}
            title="Path Activity"
          />
        )}
        <JupyterNotebook
          action={this.onSolutionRefreshClick}
          defaultValue={this.getSolutionCode(solution, problem)}
          persistent={true}
          readOnly={readOnly}
          richEditor={true}
          solution={false}
          title={readOnly
            ? "Submitted Code"
            : (
            <Fragment>
              <Typography color="textSecondary">
                Please first read the Path Activity above. Click the RUN button on the right to test your solution.
              </Typography>
              Edit Your Solution Here
            </Fragment>
            )
          }
        />
      </Fragment>
    );
  }
}

export default JupyterInlineActivity;
