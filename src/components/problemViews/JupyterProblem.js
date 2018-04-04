/**
 * @file JupyterProblem container module
 * @author Theodor Shaytanov <theodor.shaytanov@gmail.com>
 * @created 08.03.18
 */

import React, { Fragment } from "react";
import PropTypes from "prop-types";

import Button from "material-ui/Button";
import Paper from "material-ui/Paper";
import TextField from "material-ui/TextField";
import Typography from "material-ui/Typography";

import withStyles from "material-ui/styles/withStyles";
import Jupyter from "react-jupyter";
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
    solutionURL: ""
  };

  closeDialog = () =>
    this.props.dispatch(problemSolveSuccess(this.props.problem.problemId, ""));
  onSolutionFileChange = e => {
    const { dispatch, onChange, problem } = this.props;

    if (onChange) {
      onChange(e.target.value);
    }
    this.setState({
      solutionURL: e.target.value
    });
    dispatch(
      problemSolveUpdate(problem.pathId, problem.problemId, e.target.value)
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

  render() {
    const {
      /** @type {JupyterPathProblem} */
      onChange,
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
              paddingLeft: 50,
              textAlign: "left"
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
          <Typography variant="headline">Solution</Typography>
          <TextField
            defaultValue={solution && solution.id}
            fullWidth
            label="File URL"
            onChange={this.onSolutionFileChange}
          />
          {solution && (
            <div
              style={{
                paddingLeft: 50,
                textAlign: "left"
              }}
            >
              <Jupyter
                defaultStyle={true}
                loadMathjax={true}
                notebook={solution.json}
                showCode={true}
              />
            </div>
          )}
          {!onChange && (
            <Button color="primary" onClick={this.onCommit} variant="raised">
              Submit
            </Button>
          )}
        </Paper>
      </Fragment>
    );
  }
}

export default withStyles(styles)(JupyterProblem);
