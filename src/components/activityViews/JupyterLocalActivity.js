import * as React from "react";
import PropTypes from "prop-types";
import cloneDeep from "lodash/cloneDeep";

import Typography from "@material-ui/core/Typography";

import JupyterNotebook from "./JupyterNotebook";
import {
  problemSolutionRefreshFail,
  problemSolveUpdate
} from "../../containers/Activity/actions";

class JupyterLocalActivity extends React.PureComponent {
  static propTypes = {
    dispatch: PropTypes.func,
    onChange: PropTypes.func,
    onCommit: PropTypes.func,
    problem: PropTypes.any,
    readOnly: PropTypes.bool,
    solution: PropTypes.object
  };

  state = {};

  componentDidMount() {
    this.setState({
      open: new Date().getTime()
    });
  }

  getSolution = () => {
    const { problem, solution } = this.props;
    let result = { json: problem.problemJSON };

    if (solution && (solution.json || solution.loading)) {
      if (solution.loading) {
        return solution;
      }
      result = solution;
    }

    if (result.json) {
      result.json = {
        ...result.json,
        cells: result.json.cells
          .map(cell => ({
            ...cell,
            source:
              cell.metadata && cell.metadata.hide === "code" ? [] : cell.source
          }))
          .filter(cell => !(cell.metadata && cell.metadata.hide === "all"))
      };
    }

    return result;
  };

  getTitle = () => {
    return "Title";
  };

  getSolutionCode = () => {
    const { problem, solution } = this.props;
    return (
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
          .replace(/\n\n/g, "\n"))
    );
  };

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

  render() {
    const { onCommit, readOnly } = this.props;
    return (
      <React.Fragment>
        <JupyterNotebook
          readOnly={true}
          solution={this.getSolution()}
          title={this.getTitle()}
        />
        <JupyterNotebook
          action={this.onSolutionRefreshClick}
          defaultValue={this.getSolutionCode()}
          onCommit={onCommit}
          persistent={true}
          readOnly={readOnly}
          richEditor={true}
          solution={false}
          title={
            readOnly ? (
              "Submitted Code"
            ) : (
              <React.Fragment>
                <Typography color="textSecondary">
                  Please first read the Path Activity above. Click the RUN
                  button on the right to test your solution.
                </Typography>
                Edit Your Solution Here
              </React.Fragment>
            )
          }
        />
      </React.Fragment>
    );
  }
}

export default JupyterLocalActivity;
