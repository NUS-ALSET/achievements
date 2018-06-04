/**
 * @file JupyterProblem container module
 * @author Theodor Shaytanov <theodor.shaytanov@gmail.com>
 * @created 08.03.18
 */

import React, { Fragment } from "react";
import PropTypes from "prop-types";

import cloneDeep from "lodash/cloneDeep";

import AceEditor from "react-ace";

import Collapse from "@material-ui/core/Collapse";
import IconButton from "@material-ui/core/IconButton";
import Paper from "@material-ui/core/Paper";
import Typography from "@material-ui/core/Typography";
import CircularProgress from "@material-ui/core/CircularProgress";

import RefreshIcon from "@material-ui/icons/Refresh";
import ExpandLessIcon from "@material-ui/icons/ExpandLess";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";

import withStyles from "@material-ui/core/styles/withStyles";
import NotebookPreview from "@nteract/notebook-preview";

import "brace/mode/python";
import "brace/theme/github";

import {
  problemSolutionRefreshFail,
  problemSolutionSubmitRequest,
  problemSolveSuccess,
  problemSolveUpdate
} from "../../containers/Problem/actions";
import { notificationShow } from "../../containers/Root/actions";

const styles = theme => ({
  solutionButtons: {
    textDecoration: "none",
    float: "right",
    margin: `0 0 0 ${theme.spacing.unit}px`
  }
});

class JupyterInlineProblem extends React.PureComponent {
  static propTypes = {
    classes: PropTypes.object.isRequired,
    dispatch: PropTypes.func.isRequired,
    onChange: PropTypes.func,
    problem: PropTypes.object,
    solution: PropTypes.object
  };

  state = {
    solutionURL: "",
    solutionJSON: false,
    collapses: {
      provided: false,
      problem: true
    }
  };

  closeDialog = () =>
    this.props.dispatch(problemSolveSuccess(this.props.problem.problemId, ""));
  onSolutionRefreshClick = () => {
    const { dispatch, problem } = this.props;

    if (!this.state.solutionJSON) {
      return dispatch(notificationShow("Code wasn't changed"));
    }

    return dispatch(
      problemSolveUpdate(
        problem.pathId,
        problem.problemId,
        this.state.solutionJSON
      )
    );
  };
  onCommit = () => {
    const { dispatch, problem, solution } = this.props;

    dispatch(
      problemSolutionSubmitRequest(problem.owner, problem.problemId, {
        url: this.state.solutionURL,
        data: solution
      })
    );
    this.setState({
      solutionURL: undefined,
      solutionJSON: false
    });
  };

  onEditorChange = value => {
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
  };

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

  onSwitchCollapse = (item, status) => {
    this.setState({
      collapses: {
        [item]: status === undefined ? !this.state.collapses[item] : status
      }
    });
  };

  render() {
    const {
      /** @type {JupyterPathProblem} */
      problem,
      solution
    } = this.props;

    return (
      <Fragment>
        <Paper style={{ margin: "24px 2px" }}>
          <Typography style={{ position: "relative" }} variant="headline">
            <span>Edit code</span>{" "}
            <IconButton
              onClick={() => this.onSolutionRefreshClick()}
              style={{
                position: "absolute",
                right: 0
              }}
            >
              <RefreshIcon />
            </IconButton>
          </Typography>
          <AceEditor
            editorProps={{ $blockScrolling: true }}
            maxLines={20}
            minLines={10}
            mode="python"
            onChange={this.onEditorChange}
            onLoad={editor => editor.focus()}
            theme="github"
            value={this.getSolutionCode(solution, problem)}
          />
        </Paper>
        <Paper style={{ margin: "24px 2px" }}>
          <Typography variant="headline">
            Calculated Solution{solution &&
              solution.failed &&
              " - Failing - Final output should be empty"}
          </Typography>
          {solution &&
            solution.json && (
              <div
                style={{
                  textAlign: "left"
                }}
              >
                <NotebookPreview notebook={solution.json} />
              </div>
            )}
          {solution && solution.loading && <CircularProgress />}
        </Paper>
        {solution &&
          solution.provided && (
            <Paper style={{ margin: "24px 2px" }}>
              <Typography style={{ position: "relative" }} variant="headline">
                <span>Provided Solution</span>
                <IconButton
                  onClick={() => this.onSwitchCollapse("provided")}
                  style={{
                    position: "absolute",
                    right: 0
                  }}
                >
                  {this.state.collapses.provided ? (
                    <ExpandLessIcon />
                  ) : (
                    <ExpandMoreIcon />
                  )}
                </IconButton>
              </Typography>

              <Collapse
                collapsedHeight="10px"
                in={this.state.collapses.provided}
              >
                <div
                  style={{
                    textAlign: "left"
                  }}
                >
                  <NotebookPreview
                    language="python"
                    notebook={solution.provided}
                  />
                </div>
              </Collapse>
            </Paper>
          )}
        <Paper style={{ margin: "24px 2px" }}>
          <Typography style={{ position: "relative" }} variant="headline">
            <span>Problem</span>
            <IconButton
              onClick={() => this.onSwitchCollapse("problem")}
              style={{
                position: "absolute",
                right: 0
              }}
            >
              {this.state.collapses.problem ? (
                <ExpandLessIcon />
              ) : (
                <ExpandMoreIcon />
              )}
            </IconButton>
          </Typography>
          <Collapse collapsedHeight="10px" in={this.state.collapses.problem}>
            <div
              style={{
                textAlign: "left"
              }}
            >
              <NotebookPreview
                language="python"
                notebook={problem.problemJSON}
                theme="nteract"
              />
            </div>
          </Collapse>
          <Typography align="right" variant="caption">
            <a
              href={problem.problemColabURL}
              rel="noopener noreferrer"
              target="_blank"
            >
              Link
            </a>
          </Typography>
        </Paper>
      </Fragment>
    );
  }
}

export default withStyles(styles)(JupyterInlineProblem);
