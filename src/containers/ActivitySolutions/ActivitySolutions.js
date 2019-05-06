import React, { Fragment } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { compose } from "redux";

import { withRouter } from "react-router-dom";
import { firebaseConnect, populate, isLoaded } from "react-redux-firebase";

import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import { Typography } from "@material-ui/core";

import Breadcrumbs from "../../components/Breadcrumbs";
import UserSolutionRow from "../../components/lists/UserSolutionRow";
import Dialog from "../../components/dialogs/ViewActivityJestSolutionDialog";

export class ActivitySolution extends React.PureComponent {
  static propTypes = {
    children: PropTypes.any,
    match: PropTypes.any,
    uid: PropTypes.string,
    activity: PropTypes.object,
    problemSolutions: PropTypes.object,
    pathId: PropTypes.string
  };

  state = {
    open: false,
    dialogData: {}
  };

  handleClickOpen = (solution, student) => {
    this.setState({ open: true, dialogData: { solution, student } });
  };

  handleClose = () => {
    this.setState({ open: false, dialogData: {} });
  };

  render() {
    const activity = this.props.activity || {};
    const problemSolutions = this.props.problemSolutions || {};
    const {
      open,
      dialogData: { student, solution }
    } = this.state;

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
        {hasSolutions ? (
          <Table>
            <TableHead>
              <TableRow>
                <TableCell> Student </TableCell>
                <TableCell> Last Update </TableCell>
                <TableCell> Completed </TableCell>
                {activity.type === "jest" && <TableCell> Action </TableCell>}
              </TableRow>
            </TableHead>
            <TableBody>
              {sortedSolutionsKeys.map(userId => {
                const solution = problemSolutions[userId];
                return (
                  <UserSolutionRow
                    activityId={this.props.match.params.problemId}
                    key={userId}
                    openSolution={this.handleClickOpen}
                    pathId={this.props.pathId}
                    solution={solution}
                    type={activity.type || ""}
                    userId={userId}
                  />
                );
              })}
            </TableBody>
          </Table>
        ) : (
          <Typography
            style={{ textAlign: "center", marginTop: 55 }}
            variant="h5"
          >
            No solution submitted yet.
          </Typography>
        )}
        <Dialog
          activity={activity}
          handleClose={this.handleClose}
          open={open}
          solution={solution}
          student={student}
        />
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
              queryParams: ["rderByChild=updatedAt"]
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
