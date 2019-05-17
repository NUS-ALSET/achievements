import React from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { compose } from "redux";

import { withRouter } from "react-router-dom";
import { firebaseConnect } from "react-redux-firebase";

import TableCell from "@material-ui/core/TableCell";
import TableRow from "@material-ui/core/TableRow";
import { withStyles } from "@material-ui/core/styles";

import Grid from "@material-ui/core/Grid";
import CheckIcon from "@material-ui/icons/Check";
import CloseIcon from "@material-ui/icons/Close";

import Button from "@material-ui/core/Button/Button";
import { distanceInWords } from "date-fns";

const styles = {
  avatar: {
    margin: 10
  },
  bigAvatar: {
    margin: 10,
    width: 60,
    height: 60
  }
};
export class UserSolutionRow extends React.PureComponent {
  static propTypes = {
    userId: PropTypes.string,
    solution: PropTypes.any,
    openSolution: PropTypes.func,
    showViewSolutionBtn: PropTypes.bool,
    status: PropTypes.any
  };

  static defaultProps = {
    pathName: "Default"
  };

  state = {
    errInImgLoad: false
  };

  setError = () => {
    this.setState({ errInImgLoad: true });
  };

  render() {
    const {
      openSolution,
      userId,
      solution,
      status,
      showViewSolutionBtn
    } = this.props;
    return (
      <TableRow key={userId}>
        <TableCell>
          <Grid alignItems="center" container>
            <a href={`/#/profile/${userId}`} target={"_blank"}>{userId}</a>
          </Grid>
        </TableCell>
        <TableCell>
          {solution.updatedAt || typeof(status)==="number"
            ? distanceInWords(solution.updatedAt || status, new Date(), {
                includeSeconds: true
              }) + " ago"
            : ""}
        </TableCell>
        <TableCell>{status ? <CheckIcon /> : <CloseIcon />}</TableCell>
        {showViewSolutionBtn && (
          <TableCell>
            <Button onClick={() => openSolution(solution, {displayName: userId})}>
              View Solution
            </Button>
          </TableCell>
        )}
      </TableRow>
    );
  }
}

const mapStateToProps = (state, ownProps) => ({
  status:
    (((state.firebase.data.completedActivities || {})[ownProps.userId] || {})[
      ownProps.pathId
    ] || {})[ownProps.activityId] || false
});

export default compose(
  withRouter,
  withStyles(styles),
  firebaseConnect(ownProps => {
    return [
      {
        path: `/completedActivities/${ownProps.userId}/${ownProps.pathId}/${
          ownProps.activityId
        }`
      }
    ];
  }),
  connect(mapStateToProps)
)(UserSolutionRow);
