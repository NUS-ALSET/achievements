/**
 * @file JupyterProblem container module
 * @author Theodor Shaytanov <theodor.shaytanov@gmail.com>
 * @created 08.03.18
 */

import React, { Fragment } from "react";
import PropTypes from "prop-types";

import Button from "material-ui/Button";
import Paper from "material-ui/Paper";

import Typography from "material-ui/Typography";

import withStyles from "material-ui/styles/withStyles";
import Jupyter from "react-jupyter";
import {
  problemSolutionRefreshRequest,
  problemSolutionSubmitRequest,
  problemSolveRequest,
  problemSolveSuccess
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
    problem: PropTypes.object,
    solution: PropTypes.object
  };

  closeDialog = () =>
    this.props.dispatch(problemSolveSuccess(this.props.problem.problemId, ""));
  refresh = () =>
    this.props.dispatch(
      problemSolutionRefreshRequest(this.props.problem.problemId)
    );
  solve = () =>
    this.props.dispatch(problemSolveRequest(this.props.problem.problemId));
  submitSolution = () =>
    this.props.dispatch(
      problemSolutionSubmitRequest(
        this.props.problem.pathId,
        this.props.problem.problemId
      )
    );

  render() {
    const {
      classes,
      /** @type {JupyterPathProblem} */
      problem,
      solution
    } = this.props;

    return (
      <Fragment>
        <Paper
          style={{
            padding: 24
          }}
        >
          <Typography variant="headline">Problem</Typography>
          <div
            style={{
              paddingLeft: 50
            }}
          >
            <Jupyter
              defaultStyle={true}
              loadMathjax={true}
              notebook={problem.problemJSON}
              showCode={true}
            />
          </div>
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
        <Paper
          style={{
            padding: 24,
            marginTop: 24
          }}
        >
          <Typography variant="headline">
            Solution{solution &&
              solution.id &&
              solution.json && (
                <Fragment>
                  <Button
                    className={classes.solutionButtons}
                    onClick={this.refresh}
                    variant="raised"
                  >
                    Refresh
                  </Button>
                  <a
                    className={classes.solutionButtons}
                    href={solution.colabURL}
                    rel="noopener noreferrer"
                    target="_blank"
                  >
                    <Button variant="raised">Open In Colab</Button>
                  </a>
                </Fragment>
              )}
          </Typography>
          {solution ? (
            <Fragment>
              <div
                style={{
                  paddingLeft: 50
                }}
              >
                <Jupyter
                  defaultStyle={true}
                  loadMathjax={true}
                  notebook={solution.json}
                  showCode={true}
                />
              </div>
              <Button
                color="primary"
                onClick={this.submitSolution}
                variant="raised"
              >
                Submit
              </Button>
            </Fragment>
          ) : (
            <Button
              color="primary"
              fullWidth
              onClick={this.solve}
              variant="raised"
            >
              Solve at Google Colaboratory
            </Button>
          )}
        </Paper>
      </Fragment>
    );
  }
}

export default withStyles(styles)(JupyterProblem);
