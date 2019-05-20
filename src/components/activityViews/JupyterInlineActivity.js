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
import JupyterNotebook from "./JupyterNotebook";

class JupyterInlineActivity extends React.PureComponent {
  static propTypes = {
    dispatch: PropTypes.func.isRequired,
    onChange: PropTypes.func,
    onCommit: PropTypes.func,
    problem: PropTypes.object,
    setProblemOpenTime: PropTypes.func,
    solution: PropTypes.object,
    readOnly: PropTypes.bool,
    showPathActivity: PropTypes.bool
  };

  state = {
    open: 0,
    solutionJSON: false,
    showCommitBtn: false,
    statusText: null
  };

  componentDidUpdate(prevProps) {
    // Typical usage (don't forget to compare props):
    if (this.props.solution !== prevProps.solution) {
      if (
        (this.props.solution || {}).checked &&
        !(this.props.solution || {}).failed
      ) {
        this.setState({ showCommitBtn: true });
      } else {
        this.setState({ showCommitBtn: false });
      }
      if (this.props.solution.statusText) {
        this.setState({ statusText: this.props.solution.statusText });
      } else {
        this.setState({ statusText: null });
      }
    }
  }

  componentDidMount() {
    this.setState({
      open: new Date().getTime()
    });
    this.props.setProblemOpenTime(
      this.props.problem.problemId,
      new Date().getTime()
    );
  }

  onSolutionRefreshClick = value => {
    const { dispatch, onChange, problem } = this.props;

    const solutionJSON = cloneDeep(problem.problemJSON);

    solutionJSON.cells[Number(problem.code)].source = value
      .split("\n")
      .map(line => line + "\n");

    this.setState({
      solutionJSON
    });
    dispatch(problemSolutionRefreshFail());
    if (onChange) {
      onChange(solutionJSON);
    }

    return dispatch(
      problemSolveUpdate(
        problem.pathId,
        problem.problemId,
        solutionJSON,
        this.state.open
      )
    );
  };

  getCalculatedSolution = solution => {
    if (!solution) {
      return "";
    }
    if (solution.failed) {
      return (
        <Typography color="error" gutterBottom variant="h6">
          (There is something wrong with your solution...)
        </Typography>
      );
    }
    if (solution.loading) {
      return (
        <Typography color="textSecondary" gutterBottom variant="h3">
          (Checking)
        </Typography>
      );
    }
    if (solution.checked) {
      return (
        <Typography color="primary" gutterBottom variant="h3">
          (Passed)
        </Typography>
      );
    }
  };

  // Move it to paths
  getSolutionCode = (solution, problem) =>
    (this.state.solutionJSON &&
      this.state.solutionJSON.cells &&
      this.state.solutionJSON.cells[Number(problem.code)] &&
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
      onCommit,
      /** @type {JupyterPathProblem} */
      problem,
      solution,
      readOnly,
      showPathActivity=true
    } = this.props;
    return (
      <Fragment>
        {this.state.statusText && (
          <div
            style={{
              textAlign: "left",
              fontWeight: "bold",
              paddingLeft: "10px",
              color: "#d2691e"
            }}
          >
            <b>Execution Status: </b> {this.state.statusText}
          </div>
        )}
        {this.state.showCommitBtn && (
          <div style={{ height: "20px" }}>
            <Button
              color="primary"
              onClick={onCommit}
              style={{ float: "right", marginBottom: "10px" }}
              variant="contained"
            >
              Commit Solution
            </Button>
          </div>
        )}
        {solution && (solution.json || solution.loading) ? (
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
        ) : (
            showPathActivity ?
              <JupyterNotebook
              readOnly={readOnly}
              solution={{ json: problem.problemJSON }}
              title="Path Activity"
            />
            : ""
        )}
        <JupyterNotebook
          action={this.onSolutionRefreshClick}
          defaultValue={this.getSolutionCode(solution, problem)}
          onCommit={onCommit}
          persistent={true}
          readOnly={readOnly}
          richEditor={true}
          solution={false}
          title={
            readOnly ? (
              "Submitted Code"
            ) : (
              <Fragment>
                <Typography color="textSecondary">
                  Please first read the Path Activity above. Click the RUN
                  button on the right to test your solution.
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
