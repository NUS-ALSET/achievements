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
import { externalProfileUpdateRequest } from "../Account/actions";
import { sagaInjector } from "../../services/saga";
import sagas from "./sagas";
import Breadcrumbs from "../../components/Breadcrumbs";

import ActivityView from "../../components/activityViews/ActivityView";
import Button from "@material-ui/core/Button/Button";
import isEqual from "lodash/isEqual";
import { notificationShow } from "../Root/actions";

export class Activity extends React.PureComponent {
  static propTypes = {
    children: PropTypes.any,
    dispatch: PropTypes.func,
    embedded: PropTypes.bool,
    match: PropTypes.object,
    onCommit: PropTypes.func,
    onProblemChange: PropTypes.func,
    pathName: PropTypes.string,
    pathProblem: PropTypes.any,
    solution: PropTypes.any,
    readOnly: PropTypes.bool,
    showCommitBtnOnTop: PropTypes.bool
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
    if (this.props.match.params.pathId && this.props.match.params.problemId) {
      this.props.dispatch(
        problemInitRequest(
          this.props.match.params.pathId,
          this.props.match.params.problemId
        )
      );
    }
  }

  // Renamed via https://reactjs.org/docs/react-component.html#unsafe_componentwillreceiveprops
  UNSAFE_componentWillReceiveProps(nextProps) {
    if (!isEqual(nextProps.pathProblem, this.props.pathProblem)) {
      this.onProblemChange({});
    }
    if (
      !["jupyter", "jupyterInline"].includes((nextProps.pathProblem || {}).type)
    ) {
      this.setState({ disabledCommitBtn: false });
    } else if (
      (nextProps.solution || {}).checked &&
      !(nextProps.solution || {}).failed &&
      (nextProps.solution || {}).json
    ) {
      this.setState({ disabledCommitBtn: false });
    } else {
      this.setState({ disabledCommitBtn: true });
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

  onProblemChange = problemSolution => {
    this.setState({ problemSolution, changed: true });
    return (
      this.props.onProblemChange && this.props.onProblemChange(problemSolution)
    );
  };
  onCommit = () => {
    if (this.state.changed) {
      this.props.dispatch(
        problemSolutionSubmitRequest(
          this.props.match.params.pathId,
          this.props.match.params.problemId,
          this.state.problemSolution
        )
      );
    } else {
      this.props.dispatch(notificationShow("Nothing changed"));
    }
  };

  propsCommit = data => {
    if (this.props.readOnly) {
      return;
    }
    if (
      this.props.pathProblem.type === "profile" &&
      !(data && data.type === "SOLUTION")
    ) {
      this.props.dispatch(
        externalProfileUpdateRequest(
          this.state.problemSolution.value,
          "CodeCombat"
        )
      );
    } else {
      this.props.onCommit(data);
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
      showCommitBtnOnTop
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
            showCommitBtnOnTop={showCommitBtnOnTop}
            solution={solution}
            style={{
              paddingBottom: 20,
              textAlign: "center"
            }}
          />
        )}
        {!readOnly &&
          !embedded && (
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
  pathName: state.firebase.data.pathName,
  pathProblem: ownProps.pathProblem || state.problem.pathProblem,
  solution: ownProps.solution || state.problem.solution,
  userAchievements: state.firebase.data.myAchievements || {}
});

export default compose(
  withRouter,
  firebaseConnect((ownProps, store) => {
    const firebaseAuth = store.getState().firebase.auth;
    return (
      !firebaseAuth.isEmpty && [
        `/problemSolutions/${ownProps.match.params.problemId}/${
          firebaseAuth.uid
        }`,
        {
          path: `/paths/${ownProps.match.params.pathId}/name`,
          storeAs: "pathName"
        },
        {
          path: `/paths/${ownProps.match.params.pathId}/isPublic`,
          storeAs: "isPathPublic"
        },
        {
          path: `/userAchievements/${firebaseAuth.uid}`,
          storeAs: "myAchievements"
        }
      ]
    );
  }),
  connect(mapStateToProps)
)(Activity);
