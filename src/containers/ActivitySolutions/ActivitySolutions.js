import React, { Fragment } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { compose } from "redux";

import { withRouter } from "react-router-dom";
import { firebaseConnect, populate, isLoaded } from "react-redux-firebase";

import { Typography } from "@material-ui/core";
import Button from "@material-ui/core/Button";

import Breadcrumbs from "../../components/Breadcrumbs";
import UserSolutionRow from "../../components/lists/UserSolutionRow";
import "./style.css";

const HEADER_HEIGHT = 70;
export class ActivitySolution extends React.PureComponent {
  static propTypes = {
    match: PropTypes.any,
    uid: PropTypes.string,
    activity: PropTypes.object,
    problemSolutions: PropTypes.object,
    pathId: PropTypes.string
  };

  state = {
    setRefs: false
  };
  allRefs = [];

  componentDidUpdate() {
    const { problemSolutions } = this.props;
    const numOfProblems = Object.keys(problemSolutions || {}).length;
    if (numOfProblems > 0 && !this.state.setRefs) {
      this.allRefs = Array(numOfProblems)
        .fill(0)
        .map(() => React.createRef());
      this.setState({ setRefs: true });
    }
  }
  scrollToMyRef = myRef => {
    window.scrollTo({
      left: 0,
      top: myRef.current.offsetTop - HEADER_HEIGHT,
      behavior: "smooth"
    });
  };

  goTo = step => {
    const minDiff = 10;
    const divYs = this.allRefs.map(
      ref => ref.current.getBoundingClientRect().y - HEADER_HEIGHT
    );
    let positiveYs, eleY;
    if (step === 1) {
      positiveYs = divYs.filter(y => y > minDiff);
      eleY = Math.min(...positiveYs);
    } else {
      positiveYs = divYs.filter(y => y < -minDiff);
      eleY = Math.max(...positiveYs);
    }
    const index = divYs.indexOf(eleY);
    if (index > -1) {
      this.scrollToMyRef(this.allRefs[index]);
    }
  };
  render() {
    const activity = this.props.activity || {};
    const problemSolutions = this.props.problemSolutions || {};
    if (
      isLoaded(this.props.activity) &&
      this.props.uid !== this.props.activity.owner
    ) {
      return (
        <Typography style={{ textAlign: "center", marginTop: 55 }} variant="h5">
          You are not the owner of this activity.
        </Typography>
      );
    }
    const hasLoaded =
      isLoaded(this.props.activity) && isLoaded(this.props.problemSolutions);

    if (!hasLoaded) {
      return (
        <Typography style={{ textAlign: "center", marginTop: 55 }} variant="h5">
          Loading...
        </Typography>
      );
    }

    // delete owner solution from problemSolutions object
    delete problemSolutions[this.props.uid]
    const hasSolutions = Object.keys(problemSolutions).length > 0;
    const sortedSolutionsKeys = Object.keys(problemSolutions).sort((a, b) => {
      if (problemSolutions[a].updatedAt && problemSolutions[b].updatedAt) {
        return problemSolutions[b].updatedAt - problemSolutions[a].updatedAt;
      }
      return 1;
    });

    return (
      <Fragment>
        <Breadcrumbs
          paths={[
            {
              label: "Paths",
              link: "/paths"
            },
            {
              label: (activity.path || {}).name || "",
              link: `/paths/${this.props.pathId}`
            },
            {
              label: activity.name || activity.problemName || ""
            }
          ]}
        />
        {Object.keys(problemSolutions).length > 1 && (
          <div className="next-previous-btn">
            <Button
              color="primary"
              onClick={() => this.goTo(-1)}
              size="small"
              variant="outlined"
            >
              Previous
            </Button>
            <Button
              color="primary"
              onClick={() => this.goTo(+1)}
              size="small"
              style={{ marginLeft: "10px" }}
              variant="outlined"
            >
              Next
            </Button>
          </div>
        )}

        {sortedSolutionsKeys.map((userId, index) => {
          const solution = problemSolutions[userId];
          return (
            <div className="user-solution" key={"id-" + index + userId} ref={this.allRefs[index]}>
              <UserSolutionRow
                activity={activity}
                activityId={this.props.match.params.problemId}
                key={userId}
                openSolution={this.handleClickOpen}
                pathId={this.props.pathId}
                solution={solution}
                userId={userId}
              />
            </div>
          );
        })}
        {!hasSolutions && (
          <Typography
            style={{ textAlign: "center", marginTop: 55 }}
            variant="h5"
          >
            No solution submitted yet.
          </Typography>
        )}
      </Fragment>
    );
  }
}

const populates = [{ child: "path", root: "paths" }];

const mapStateToProps = (state, ownProps) => ({
  uid: state.firebase.auth.uid,
  problemSolutions: (state.firebase.data.problemSolutions || {})[
    ownProps.match.params.problemId
  ],
  activity: (populate(state.firebase, "activities", populates) || {})[
    ownProps.match.params.problemId
  ],
  pathId: (
    (state.firebase.data.activities || {})[ownProps.match.params.problemId] ||
    {}
  ).path
});

export default compose(
  withRouter,
  firebaseConnect((ownProps, store) => {
    const firebaseAuth = store.getState().firebase.auth;
    return [].concat(
      firebaseAuth.isEmpty
        ? []
        : [
            {
              path: `/problemSolutions/${ownProps.match.params.problemId}`,
              queryParams: ["orderByChild=updatedAt"]
            },
            {
              path: `/activities/${ownProps.match.params.problemId}`,
              populates: populates
            }
          ]
    );
  }),
  connect(mapStateToProps)
)(ActivitySolution);
