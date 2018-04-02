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

import { problemInitRequest } from "./actions";
import { sagaInjector } from "../../services/saga";
import sagas from "./sagas";
import Breadcrumbs from "../../components/Breadcrumbs";

import ProblemView from "../../components/problemViews/ProblemView";

class Problem extends React.PureComponent {
  static propTypes = {
    dispatch: PropTypes.func,
    match: PropTypes.object,
    pathProblem: PropTypes.any,
    solution: PropTypes.any
  };

  componentDidMount() {
    this.props.dispatch(
      problemInitRequest(
        this.props.match.params.pathId,
        this.props.match.params.problemId
      )
    );
  }

  render() {
    const {
      /** @type PathProblem */
      pathProblem,
      dispatch,
      solution
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
        <ProblemView
          dispatch={dispatch}
          pathProblem={pathProblem}
          solution={solution}
          style={{
            textAlign: "center"
          }}
        />
      </Fragment>
    );
  }
}

sagaInjector.inject(sagas);

const mapStateToProps = state => ({
  pathProblem: state.problem.pathProblem,
  solution: state.problem.solution
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
)(Problem);
