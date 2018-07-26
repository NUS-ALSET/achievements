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
  problemFinalize,
  problemInitRequest,
  problemSolutionSubmitRequest
} from "./actions";
import { sagaInjector } from "../../services/saga";
import sagas from "./sagas";
import Breadcrumbs from "../../components/Breadcrumbs";

import ActivityView from "../../components/activityViews/ActivityView";
import Button from "@material-ui/core/Button/Button";

export class Activity extends React.PureComponent {
  static propTypes = {
    dispatch: PropTypes.func,
    match: PropTypes.object,
    onProblemChange: PropTypes.func,
    pathProblem: PropTypes.any,
    solution: PropTypes.any,
    embedded: PropTypes.bool
  };

  state = {
    problemSolution: {}
  };

  componentDidMount() {
    if (this.props.match.params.pathId && this.props.match.params.problemId) {
      this.props.dispatch(
        problemInitRequest(
          this.props.match.params.pathId,
          this.props.match.params.problemId
        )
      );
    }
  }

  componentWillUnmount() {
    this.props.dispatch(
      problemFinalize(
        this.props.match.params.pathId,
        this.props.match.params.problemId
      )
    );
  }

  onProblemChange = problemSolution => this.setState({ problemSolution });
  onCommit = () =>
    this.props.dispatch(
      problemSolutionSubmitRequest(
        this.props.match.params.pathId,
        this.props.match.params.problemId,
        this.state.problemSolution
      )
    );

  render() {
    const {
      /** @type PathProblem */
      pathProblem,
      dispatch,
      solution,
      embedded
    } = this.props;

    if (!pathProblem) {
      return <div>Loading</div>;
    }

    return (
      <Fragment>
        {!embedded && (
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
        )}
        <ActivityView
          dispatch={dispatch}
          onProblemChange={this.props.onProblemChange || this.onProblemChange}
          pathProblem={pathProblem}
          solution={solution}
          style={{
            paddingBottom: 20,
            textAlign: "center"
          }}
        />
        {!embedded && (
          <div
            style={{
              bottom: 0,
              display: "flex",
              justifyContent: "flex-end",
              position: "relative"
            }}
          >
            <Button
              color="primary"
              disabled={
                !(solution && solution.checked) ||
                solution.loading ||
                solution.failed
              }
              onClick={this.onCommit}
              variant="raised"
            >
              Commit
            </Button>
          </div>
        )}
      </Fragment>
    );
  }
}

sagaInjector.inject(sagas);

const mapStateToProps = (state, ownProps) => ({
  pathProblem: ownProps.pathProblem || state.problem.pathProblem,
  solution: ownProps.solution || state.problem.solution
});

export default compose(
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
)(Activity);
