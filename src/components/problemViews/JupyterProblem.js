/**
 * @file JupyterProblem container module
 * @author Theodor Shaytanov <theodor.shaytanov@gmail.com>
 * @created 08.03.18
 */

import React, { Fragment } from "react";
import PropTypes from "prop-types";

import Button from "material-ui/Button";
import Collapse from "material-ui/transitions/Collapse";
import IconButton from "material-ui/IconButton";
import InputAdornment from "material-ui/Input/InputAdornment";
import Paper from "material-ui/Paper";
import TextField from "material-ui/TextField";
import Typography from "material-ui/Typography";
import CircularProgress from "material-ui/Progress/CircularProgress";

import RefreshIcon from "material-ui-icons/Refresh";
import ExpandLessIcon from "material-ui-icons/ExpandLess";
import ExpandMoreIcon from "material-ui-icons/ExpandMore";

import withStyles from "material-ui/styles/withStyles";
import NotebookPreview from "@nteract/notebook-preview";
import {
  problemSolutionSubmitRequest,
  problemSolveSuccess,
  problemSolveUpdate
} from "../../containers/Problem/actions";

const styles = theme => ({
  solutionButtons: {
    textDecoration: "none",
    float: "right",
    margin: `0 0 0 ${theme.spacing.unit}px`
  }
});

class JupyterProblem extends React.PureComponent {
  static propTypes = {
    classes: PropTypes.object.isRequired,
    dispatch: PropTypes.func.isRequired,
    onChange: PropTypes.func,
    problem: PropTypes.object,
    solution: PropTypes.object
  };

  state = {
    solutionURL: "",
    collapses: {
      provided: false,
      problem: true
    }
  };

  closeDialog = () =>
    this.props.dispatch(problemSolveSuccess(this.props.problem.problemId, ""));
  onSolutionFileChange = e => {
    if (this.props.onChange) {
      this.props.onChange(e.target.value);
    }
    this.setState({
      solutionURL: e.target.value
    });
  };
  onSolutionRefreshClick = () => {
    const { dispatch, problem, solution } = this.props;

    dispatch(
      problemSolveUpdate(
        problem.pathId,
        problem.problemId,
        this.state.solutionURL || (solution && solution.id)
      )
    );
  };
  onCommit = () => {
    const { dispatch, problem } = this.props;

    dispatch(
      problemSolutionSubmitRequest(
        problem.owner,
        problem.problemId,
        this.state.solutionURL
      )
    );
    this.setState({
      solutionURL: undefined
    });
  };
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
      onChange,
      problem,
      solution
    } = this.props;

    return (
      <Fragment>
        <Paper style={{ margin: "24px 2px" }}>
          <Typography variant="headline">
            Calculated Solution{solution &&
              solution.failed &&
              " - Failing - Final output should be empty"}
          </Typography>
          <TextField
            InputLabelProps={{
              style: {
                top: 24,
                left: 24
              }
            }}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton onClick={this.onSolutionRefreshClick}>
                    <RefreshIcon />
                  </IconButton>
                </InputAdornment>
              )
            }}
            defaultValue={solution && solution.id}
            fullWidth
            label="Enter the url to your public solution on Colab"
            onChange={this.onSolutionFileChange}
            style={{ padding: 24, position: "relative" }}
          />
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
          {!onChange && (
            <Button color="primary" onClick={this.onCommit} variant="raised">
              Submit
            </Button>
          )}
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
                  <NotebookPreview notebook={solution.provided} />
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
              <NotebookPreview notebook={problem.problemJSON} />
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

export default withStyles(styles)(JupyterProblem);
