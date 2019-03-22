/**
 * @file JupyterColabActivity container module
 * @author Theodor Shaytanov <theodor.shaytanov@gmail.com>
 * @created 08.03.18
 */

import React, { Fragment } from "react";
import PropTypes from "prop-types";
import { Button } from "@material-ui/core";

import { problemSolveUpdate } from "../../containers/Activity/actions";
import JupyterNotebook from "./JupyterNotebook";

class JupyterColabActivity extends React.PureComponent {
  static propTypes = {
    dispatch: PropTypes.func.isRequired,
    onChange: PropTypes.func,
    problem: PropTypes.object.isRequired,
    solution: PropTypes.object,
    readOnly: PropTypes.bool
  };
  state = {
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
  componentDidMount(){
    this.props.setProblemOpenTime(this.props.problem.problemId, (new Date()).getTime());
  }
  
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
      solution,
      readOnly
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
              onClick={() => this.props.onCommit()}
              style={{ float: "right", marginBottom: "10px" }}
              variant="contained"
            >
              Commit
            </Button>
          </div>
        )}

        <JupyterNotebook
          action={this.onSolutionRefreshClick}
          defaultValue={solution && solution.id}
          persistent={true}
          readOnly={readOnly}
          solution={solution}
          title="Calculated Solution"
        />
        {solution && solution.provided && (
          <JupyterNotebook
            readOnly={readOnly}
            solution={{
              json: solution.provided
            }}
            title="Provided Solution"
          />
        )}
        <JupyterNotebook
          problem={problem}
          readOnly={readOnly}
          solution={{ json: problem.problemJSON }}
          title="Problem"
          url={problem.problemColabURL}
        />
      </Fragment>
    );
  }
}

export default JupyterColabActivity;
