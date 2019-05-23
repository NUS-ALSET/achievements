/**
 * @file ActivitiesTable component module
 * @author Theodor Shaytanov <theodor.shaytanov@gmail.com>
 * @created 22.02.18
 */

import React, { Fragment } from "react";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";

import Button from "@material-ui/core/Button";
import CircularProgress from "@material-ui/core/CircularProgress";
import Icon from "@material-ui/core/Icon";
import Menu from "@material-ui/core/Menu";
import MenuItem from "@material-ui/core/MenuItem";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
// import Tooltip from "@material-ui/core/Tooltip";
// import Timeline from "@material-ui/icons/Timeline";

import DoneIcon from "@material-ui/icons/Done";
import withStyles from "@material-ui/core/styles/withStyles";
import AnalysisDialog from "../dialogs/AnalysisDialog";
import {
  PATH_STATUS_COLLABORATOR,
  PATH_STATUS_JOINED,
  PATH_STATUS_NOT_JOINED,
  PATH_STATUS_OWNER
} from "../../containers/Path/selectors";

import { ACTIVITY_TYPES } from "../../services/paths";

const COLUMN_ACTIONS_WIDTH = 240;

const styles = theme => ({
  link: {
    textDecoration: "none"
  },
  button: {
    margin: theme.spacing.unit
  },
  noWrap: {
    whiteSpace: "nowrap"
  },
  noTextDecoration: {
    textDecoration: "none",
    color: "inherit",
    padding: "11px 16px"
  },
  listLink: {
    margin: theme.spacing.unit,
    height: "auto",
    padding: "0px",
    "&:hover": {
      backgroundColor: "rgba(0, 0, 0, 0.08)"
    }
  }
});

class ActivitiesTable extends React.PureComponent {
  static propTypes = {
    activities: PropTypes.array.isRequired,
    codeCombatProfile: PropTypes.any,
    classes: PropTypes.object.isRequired,
    inspectedUser: PropTypes.string,
    onDeleteActivity: PropTypes.func.isRequired,
    onEditActivity: PropTypes.func.isRequired,
    onMoveActivity: PropTypes.func.isRequired,
    onOpenActivity: PropTypes.func.isRequired,
    pathStatus: PropTypes.oneOf([
      PATH_STATUS_OWNER,
      PATH_STATUS_COLLABORATOR,
      PATH_STATUS_JOINED,
      PATH_STATUS_NOT_JOINED
    ]),
    pendingActivityId: PropTypes.string
  };

  state = {
    activity: null,
    analysisDialog: {
      open: false,
      name: "",
      activityId: null
    }
  };

  openAnalysisDialog = (activityId, name) =>
    this.setState({ analysisDialog: { open: true, name, activityId } });

  handleCloseAnalysisDialog = () =>
    this.setState({ analysisDialog: { open: false, data: {} } });

  selectActivity = activity => this.setState({ activity });

  getStatus = activity => {
    const codeCombatProfile = this.props.codeCombatProfile || {};
    if (activity.solved) {
      return true;
    }
    switch (activity.type) {
      case ACTIVITY_TYPES.profile.id:
        return Boolean(codeCombatProfile.id);
      case ACTIVITY_TYPES.codeCombat.id:
        return Boolean((codeCombatProfile.achievements || {})[activity.level]);
      case ACTIVITY_TYPES.codeCombatNumber.id:
        return (
          !codeCombatProfile.totalAchievements &&
          Number(codeCombatProfile.totalAchievements) >= Number(activity.count)
        );
      default:
        return false;
    }
  };

  render() {
    const {
      activities,
      classes,
      inspectedUser,
      onDeleteActivity,
      onEditActivity,
      onMoveActivity,
      onOpenActivity,
      pathStatus,
      pendingActivityId
    } = this.props;

    let minOrderIndex = Infinity;
    let maxOrderIndex = -Infinity;

    (activities || []).forEach(activity => {
      if (activity.orderIndex < minOrderIndex) {
        minOrderIndex = activity.orderIndex;
      }
      if (activity.orderIndex > maxOrderIndex) {
        maxOrderIndex = activity.orderIndex;
      }
    });

    const canChange = [PATH_STATUS_COLLABORATOR, PATH_STATUS_OWNER].includes(
      pathStatus
    );

    const totals = {
      totalActivities: 0,
      totalSolvedActivities: 0
    };
    (activities || []).forEach(activity =>
      this.getStatus(activity) && activity.solved
        ? (totals.totalSolvedActivities++, totals.totalActivities++)
        : totals.totalActivities++
    );
    return (
      <Fragment>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Activity name</TableCell>
              <TableCell>Type</TableCell>
              <TableCell>
                Status {totals.totalSolvedActivities} / {totals.totalActivities}
              </TableCell>
              <TableCell style={{ width: COLUMN_ACTIONS_WIDTH }}>
                Actions
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {(activities || []).map(activity => (
              <TableRow hover key={activity.id}>
                <TableCell className={classes.noWrap}>
                  {activity.name}
                </TableCell>
                <TableCell className={classes.noWrap}>
                  {activity.description}
                </TableCell>
                <TableCell>
                  {this.getStatus(activity) && activity.solved && (
                    <Icon>
                      <DoneIcon />
                    </Icon>
                  )}
                </TableCell>
                <TableCell
                  className={classes.noWrap}
                  style={{ textAlign: "left" }}
                >
                  {/* temporary hide for online Oct2018 competition
                    [ACTIVITY_TYPES.jupyter.id, ACTIVITY_TYPES.jupyterInline.id].includes(activity.type) && (

                    <Tooltip
                      title={"View Default Solution Analysis"}
                      PopperProps={
                        {
                          style: {
                            pointerEvents: 'none'
                          }
                        }
                      }
                    >
                      <Button
                        onClick={() =>
                          this.openAnalysisDialog(activity.id, activity.name)
                        }
                        variant="contained"
                        className={classes.button}
                      >
                        <Timeline />
                      </Button>
                    </Tooltip>

                  ) */}
                  <Button
                    disabled={
                      activity.id === pendingActivityId || !!inspectedUser
                    }
                    onClick={() => onOpenActivity(activity)}
                    variant="contained"
                  >
                    {"Solve"}
                    {activity.id === pendingActivityId && (
                      <CircularProgress
                        style={{
                          position: "absolute",
                          left: "35%",
                          width: 20,
                          height: 20
                        }}
                      />
                    )}
                  </Button>

                  {canChange && (
                    <Button
                      className={classes.button}
                      disabled={!!inspectedUser}
                      id={activity.id}
                      onClick={() => this.selectActivity(activity)}
                      variant="contained"
                    >
                      More
                    </Button>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        {canChange && (
          <Menu
            anchorEl={document.getElementById(
              this.state.activity && this.state.activity.id
            )}
            onClose={() => this.selectActivity()}
            open={!!this.state.activity}
          >
            <MenuItem
              className={classes.button}
              onClick={() =>
                this.selectActivity() || onEditActivity(this.state.activity)
              }
              variant="contained"
            >
              Edit
            </MenuItem>
            <MenuItem
              className={classes.button}
              onClick={() =>
                this.selectActivity() ||
                onDeleteActivity(
                  this.state.activity.id,
                  this.state.activity.path
                )
              }
              variant="contained"
            >
              Delete
            </MenuItem>
            <MenuItem className={classes.listLink} variant="contained">
              <Link
                className={classes.noTextDecoration}
                to={`/activitySolutions/${(this.state.activity || {}).id}`}
              >
                {" "}
                View Solutions
              </Link>
            </MenuItem>
            {this.state.activity &&
              this.state.activity.orderIndex !== minOrderIndex && (
                <MenuItem
                  className={classes.button}
                  onClick={() =>
                    this.selectActivity() ||
                    onMoveActivity(this.state.activity, "up")
                  }
                  variant="contained"
                >
                  Move Up
                </MenuItem>
              )}
            {this.state.activity &&
              this.state.activity.orderIndex !== maxOrderIndex && (
                <MenuItem
                  className={classes.button}
                  onClick={() =>
                    this.selectActivity() ||
                    onMoveActivity(this.state.activity, "down")
                  }
                  variant="contained"
                >
                  Move Down
                </MenuItem>
              )}
          </Menu>
        )}
        <AnalysisDialog
          activityId={this.state.analysisDialog.activityId}
          handleClose={this.handleCloseAnalysisDialog}
          name={this.state.analysisDialog.name}
          open={this.state.analysisDialog.open}
        />
      </Fragment>
    );
  }
}

export default withStyles(styles)(ActivitiesTable);
