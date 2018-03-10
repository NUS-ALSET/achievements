/**
 * @file Problem container module
 * @author Theodor Shaytanov <theodor.shaytanov@gmail.com>
 * @created 04.03.18
 */
import React, { Fragment } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { compose } from "redux";

import { withRouter } from "react-router-dom";
import { firebaseConnect } from "react-redux-firebase";

import {
  problemInitRequest,
  problemSolutionRefreshRequest,
  problemSolutionSubmitRequest,
  problemSolveRequest,
  problemSolveSuccess
} from "./actions";
import { sagaInjector } from "../../services/saga";
import sagas from "./sagas";
import Breadcrumbs from "../../components/Breadcrumbs";

import withStyles from "material-ui/styles/withStyles";
import JupyterProblem from "../../components/problemViews/JupyterProblem";
import YouTubeProblem from "../../components/problemViews/YouTubeProblem";

const styles = theme => ({
  solutionButtons: {
    textDecoration: "none",
    float: "right",
    margin: `0 0 0 ${theme.spacing.unit}px`
  }
});

class Problem extends React.PureComponent {
  static propTypes = {
    classes: PropTypes.object.isRequired,
    dispatch: PropTypes.func,
    match: PropTypes.object,
    pathProblem: PropTypes.any,
    solution: PropTypes.string,
    solutionKey: PropTypes.any,
    solutionJSON: PropTypes.any
  };

  componentDidMount() {
    this.props.dispatch(
      problemInitRequest(
        this.props.match.params.pathId,
        this.props.match.params.problemId
      )
    );
  }

  refresh = () =>
    this.props.dispatch(
      problemSolutionRefreshRequest(this.props.match.params.problemId)
    );
  solve = () =>
    this.props.dispatch(problemSolveRequest(this.props.match.params.problemId));
  submitSolution = () =>
    this.props.dispatch(
      problemSolutionSubmitRequest(
        this.props.match.params.pathId,
        this.props.match.params.problemId,
        this.props.solutionJSON
      )
    );
  closeDialog = () =>
    this.props.dispatch(
      problemSolveSuccess(this.props.match.params.problemId, "")
    );

  render() {
    const {
      pathProblem,
      classes,
      dispatch,
      solution,
      solutionJSON,
      solutionKey
    } = this.props;
    if (!pathProblem) {
      return <div>Loading</div>;
    }

    return (
      <Fragment>
        <Breadcrumbs
          paths={[
            {
              label: "Paths",
              link: "/paths"
            },
            {
              label: pathProblem.pathName,
              link: `/paths/${this.props.match.params.pathId}`
            },
            {
              label: pathProblem.problemName
            }
          ]}
        />
        {pathProblem.type === "jupyter" && (
          <JupyterProblem
            classes={classes}
            dispatch={dispatch}
            problem={pathProblem}
            solution={solution}
            solutionJSON={solutionJSON}
            solutionKey={solutionKey}
          />
        )}
        {pathProblem.type === "youtube" && (
          <YouTubeProblem
            classes={classes}
            dispatch={dispatch}
            problem={pathProblem}
          />
        )}
      </Fragment>
    );
  }
}

sagaInjector.inject(sagas);

const mapStateToProps = (state, ownProps) => ({
  pathProblem: state.problem.pathProblem,
  solutionKey: state.problem.solutionKey,
  solutionJSON: state.problem.solutionJSON,
  solution:
    state.firebase.data.problemSolutions &&
    state.firebase.data.problemSolutions[ownProps.match.params.problemId] &&
    state.firebase.data.problemSolutions[ownProps.match.params.problemId][
      state.firebase.auth.uid
    ]
});

export default compose(
  withStyles(styles),
  withRouter,
  firebaseConnect((ownProps, store) => {
    const firebaseAuth = store.getState().firebase.auth;
    return (
      !firebaseAuth.isEmpty && [
        `/problemSolutions/${ownProps.match.params.problemId}/${
          firebaseAuth.uid
        }`
      ]
    );
  }),
  connect(mapStateToProps)
)(Problem);
