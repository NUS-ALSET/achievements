/**
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
import { externalProfileUpdateRequest } from "../Account/actions";
import { sagaInjector } from "../../services/saga";
import sagas from "./sagas";
import Breadcrumbs from "../../components/Breadcrumbs";

import ActivityView from "../../components/activityViews/ActivityView";
import Button from "@material-ui/core/Button/Button";
import isEqual from "lodash/isEqual";
import { notificationShow, signInRequire } from "../Root/actions";

export class Activity extends React.PureComponent {
  static propTypes = {
    children: PropTypes.any,

    externalProfileUpdateRequest: PropTypes.func,
    notificationShow: PropTypes.func,
    problemFinalize: PropTypes.func,
    problemInitRequest: PropTypes.func,
    problemSolutionSubmitRequest: PropTypes.func,
    signInRequire: PropTypes.func,
    dispatch: PropTypes.func,

    embedded: PropTypes.bool,
    match: PropTypes.object,
    onCommit: PropTypes.func,
    onProblemChange: PropTypes.func,
    pathName: PropTypes.string,
    pathProblem: PropTypes.any,
    readOnly: PropTypes.bool,
    solution: PropTypes.any,
    uid: PropTypes.string
  };

  static defaultProps = {
    pathName: "Default"
  };

  state = {
    problemSolution: {},
    changed: false,
    disabledCommitBtn: true
  };

  componentDidMount() {
    const { match, problemInitRequest } = this.props;

    if (match.params.pathId && match.params.problemId) {
      problemInitRequest(match.params.pathId, match.params.problemId);
    }
  }

  componentDidUpdate(prevProps) {
    const { pathProblem, solution } = this.props;
    if (!isEqual(pathProblem, prevProps.pathProblem)) {
      this.onProblemChange({});
    }
    if (pathProblem !== prevProps.pathProblem) {
      if (!["jupyter", "jupyterInline"].includes((pathProblem || {}).type)) {
        this.setState({ disabledCommitBtn: false });
      } else if (
        (solution || {}).checked &&
        !(solution || {}).failed &&
        (solution || {}).json
      ) {
        this.setState({ disabledCommitBtn: false });
      } else {
        this.setState({ disabledCommitBtn: true });
      }
    }
  }

  componentWillUnmount() {
    this.props.problemFinalize(
      this.props.match.params.pathId,
      this.props.match.params.problemId
    );
  }

  onProblemChange = problemSolution => {
    if (!this.props.uid && Object.keys(problemSolution).length !== 0) {
      this.props.signInRequire();
    }
    this.setState({ problemSolution, changed: true });
    return (
      this.props.onProblemChange && this.props.onProblemChange(problemSolution)
    );
  };
  onCommit = () => {
    if (this.state.changed) {
      this.props.problemSolutionSubmitRequest(
        this.props.match.params.pathId,
        this.props.match.params.problemId,
        this.state.problemSolution
      );
    } else {
      this.props.notificationShow("Nothing changed");
    }
  };

  propsCommit = data => {
    const {
      externalProfileUpdateRequest,
      pathProblem,
      readOnly,
      onCommit
    } = this.props;
    if (readOnly) {
      return;
    }
    if (pathProblem.type === "profile" && !(data && data.type === "SOLUTION")) {
      externalProfileUpdateRequest(
        this.state.problemSolution.value,
        "CodeCombat"
      );
    } else {
      onCommit(data);
    }
  };

  render() {
    const {
      embedded,
      dispatch,
      pathName,
      pathProblem,
      solution,
      readOnly,
      uid
    } = this.props;
    if (!pathProblem) {
      return (
        <div
          style={{ width: "100%", textAlign: "center", padding: "20px 0px" }}
        >
          Loading...
        </div>
      );
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
                label: pathName,
                link: `/paths/${this.props.match.params.pathId}`
              },
              {
                label: pathProblem.problemName
              }
            ]}
          />
        )}
        {typeof this.props.children === "function" ? (
          this.props.children(activityView, this.propsCommit, {
            ...this.props,
            onCommit: this.propsCommit,
            onProblemChange: this.onProblemChange
          })
        ) : (
          <ActivityView
            dispatch={dispatch}
            onCommit={this.onCommit}
            onProblemChange={this.props.onProblemChange || this.onProblemChange}
            pathProblem={pathProblem}
            readOnly={readOnly}
            solution={solution}
            style={{
              paddingBottom: 20,
              textAlign: "center"
            }}
          />
        )}
        {!readOnly && uid && !embedded && (
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
              disabled={this.state.disabledCommitBtn}
              onClick={this.onCommit}
              variant="contained"
            >
              Commit
            </Button>
          </div>
        )}
      </Fragment>
    );
  }
}

// HOC for activityView
const activityView = props => (
  <ActivityView
    {...props}
    style={{
      paddingBottom: 20,
      textAlign: "center"
    }}
  />
);

sagaInjector.inject(sagas);

const mapStateToProps = (state, ownProps) => ({
  uid: state.firebase.auth.uid,
  pathName: state.firebase.data.pathName,
  pathProblem: ownProps.pathProblem || state.problem.pathProblem,
  solution: ownProps.solution || state.problem.solution,
  userAchievements: state.firebase.data.myAchievements || {}
});

const mapDispatchToProps = dispatch => ({
  externalProfileUpdateRequest: (externalProfileId, externalProfileType) =>
    dispatch(
      externalProfileUpdateRequest(externalProfileId, externalProfileType)
    ),
  notificationShow: message => dispatch(notificationShow(message)),
  problemFinalize: () => dispatch(problemFinalize()),
  problemInitRequest: (pathId, problemId, solution, readOnly) =>
    dispatch(problemInitRequest(pathId, problemId, solution, readOnly)),
  problemSolutionSubmitRequest: (pathId, problemId, payload) =>
    dispatch(problemSolutionSubmitRequest(pathId, problemId, payload)),
  signInRequire: () => dispatch(signInRequire()),
  dispatch
});

export default compose(
  withRouter,
  firebaseConnect((ownProps, store) => {
    const firebaseAuth = store.getState().firebase.auth;
    return [
      {
        path: `/paths/${ownProps.match.params.pathId}/name`,
        storeAs: "pathName"
      },
      {
        path: `/paths/${ownProps.match.params.pathId}/isPublic`,
        storeAs: "isPathPublic"
      }
    ].concat(
      firebaseAuth.isEmpty
        ? []
        : [
            `/problemSolutions/${ownProps.match.params.problemId}/${
              firebaseAuth.uid
            }`,
            {
              path: `/userAchievements/${firebaseAuth.uid}`,
              storeAs: "myAchievements"
            }
          ]
    );
  }),
  connect(
    mapStateToProps,
    mapDispatchToProps
  )
)(Activity);
