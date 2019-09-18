import React from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { compose } from "redux";

import { withRouter } from "react-router-dom";
import { firebaseConnect } from "react-redux-firebase";

import { withStyles } from "@material-ui/core/styles";

import CheckIcon from "@material-ui/icons/Check";
import CloseIcon from "@material-ui/icons/Close";

import ExpansionPanel from "@material-ui/core/ExpansionPanel";
import ExpansionPanelSummary from "@material-ui/core/ExpansionPanelSummary";
import ExpansionPanelDetails from "@material-ui/core/ExpansionPanelDetails";
import Typography from "@material-ui/core/Typography";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import ViewActivityJestSolutionDialog from "../../components/dialogs/ViewActivityJestSolutionDialog";
import JupyterInlineActivity from "../../components/activityViews/JupyterInlineActivity";

import { distanceInWords } from "date-fns";
import Loadable from "react-loadable";
import LinearProgress from "@material-ui/core/LinearProgress";

const AceEditor = Loadable({
  loader: () => import("../../components/AceEditor"),
  loading: () => <LinearProgress />
});

function emptyFn() {}

const styles = theme => ({
  avatar: {
    margin: 10
  },
  bigAvatar: {
    margin: 10,
    width: 60,
    height: 60
  },
  flex: {
    display: "flex",
    justifyContent: "space-between",
    width: "100%"
  },
  quarter: {
    fontSize: theme.typography.pxToRem(15),
    fontWeight: theme.typography.fontWeightRegular,
    width: "25%"
  },
  heading: {
    backgroundColor: "#e8e8e8"
  }
});
export class UserSolutionRow extends React.PureComponent {
  static propTypes = {
    userId: PropTypes.string,
    solution: PropTypes.any,
    status: PropTypes.any,
    activity: PropTypes.any,
    classes: PropTypes.object
  };

  static defaultProps = {
    pathName: "Default"
  };

  getSolution = solution => {
    let sol = (solution || {}).solution ? solution.solution : solution;
    if (this.props.activity && this.props.activity.type === "jupyterInline") {
      sol = typeof sol === "string" ? JSON.parse(sol) : sol;
    }
    if (this.props.activity && this.props.activity.type === "jupyterLocal") {
      sol = sol.payload;
    }
    if (this.props.activity && this.props.activity.type === "youtube") {
      sol = JSON.stringify(sol.answers);
    }
    if (
      this.props.activity &&
      this.props.activity.type &&
      [
        "codeCombatNumber",
        "codeCombatMultiPlayerLevel",
        "creator",
        "educator",
        "multipleQuestion"
      ].includes(this.props.activity.type)
    ) {
      sol = JSON.stringify(sol);
    }
    return sol;
  };
  render() {
    const { userId, solution, status, classes } = this.props;
    const activity = this.props.activity || {};
    const showActivitySolution = [
      "jupyterInline",
      "jupyterLocal",
      "jest"
    ].includes(activity.type);
    return (
      <ExpansionPanel defaultExpanded>
        <ExpansionPanelSummary
          className={classes.heading}
          expandIcon={showActivitySolution ? <ExpandMoreIcon /> : ""}
        >
          <div className={classes.flex}>
            <Typography className={classes.quarter}>
              Student ID: {"*****************"}
              {userId.slice(userId.length - 4)}
            </Typography>
            <Typography className={classes.quarter}>
              {(solution && solution.updatedAt) || typeof status === "number"
                ? "Updated At: " +
                  distanceInWords(solution.updatedAt || status, new Date(), {
                    includeSeconds: true
                  }) +
                  " ago"
                : ""}
            </Typography>
            <Typography className={classes.quarter}>
              Completed: {status ? <CheckIcon /> : <CloseIcon />}
            </Typography>
            <Typography />
          </div>
        </ExpansionPanelSummary>
        {showActivitySolution && (
          <ExpansionPanelDetails>
            <div style={{ width: "100%" }}>
              {activity.type === "jupyterInline" && (
                <JupyterInlineActivity
                  dispatch={emptyFn}
                  onChange={emptyFn}
                  onCommit={emptyFn}
                  problem={activity}
                  problemSolutionAttemptRequest={emptyFn}
                  readOnly={true}
                  setProblemOpenTime={emptyFn}
                  showPathActivity={false}
                  solution={this.getSolution(solution)}
                />
              )}
              {activity.type === "jest" && (
                <ViewActivityJestSolutionDialog
                  activity={activity}
                  solution={solution}
                />
              )}
              {activity.type === "jupyterLocal" && (
                <AceEditor
                  maxLines={Infinity}
                  minLines={3}
                  mode="python"
                  readOnly={true}
                  setOptions={{ showLineNumbers: false }}
                  showGutter={true}
                  theme="github"
                  value={this.getSolution(solution)}
                  width={"100%"}
                />
              )}
            </div>
          </ExpansionPanelDetails>
        )}
        {!showActivitySolution && (
          <ExpansionPanelDetails>
            <div style={{ width: "100%" }}>{this.getSolution(solution)}</div>
          </ExpansionPanelDetails>
        )}
      </ExpansionPanel>
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
