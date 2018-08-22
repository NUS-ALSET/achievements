/**
 * @file ActivitiesTable component module
 * @author Theodor Shaytanov <theodor.shaytanov@gmail.com>
 * @created 22.02.18
 */

import React, { Fragment } from "react";
import PropTypes from "prop-types";

import Button from "@material-ui/core/Button";
import Icon from "@material-ui/core/Icon";
import Menu from "@material-ui/core/Menu";
import MenuItem from "@material-ui/core/MenuItem";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";

import DoneIcon from "@material-ui/icons/Done";
import withStyles from "@material-ui/core/styles/withStyles";
import AnalysisDialog from "../dialogs/AnalysisDialog";
import {
  PATH_STATUS_COLLABORATOR,
  PATH_STATUS_JOINED,
  PATH_STATUS_NOT_JOINED,
  PATH_STATUS_OWNER
} from "../../containers/Path/selectors";

const COLUMN_ACTIONS_WIDTH = 240;

const styles = theme => ({
  link: {
    textDecoration: "none"
  },
  button: {
    margin: theme.spacing.unit
  }
});

class ActivitiesTable extends React.PureComponent {
  static propTypes = {
    activities: PropTypes.array.isRequired,
    classes: PropTypes.object.isRequired,
    currentUserId: PropTypes.string,
    onDeleteActivity: PropTypes.func.isRequired,
    onEditActivity: PropTypes.func.isRequired,
    onMoveActivity: PropTypes.func.isRequired,
    onOpenActivity: PropTypes.func.isRequired,
    pathStatus: PropTypes.oneOf([
      PATH_STATUS_OWNER,
      PATH_STATUS_COLLABORATOR,
      PATH_STATUS_JOINED,
      PATH_STATUS_NOT_JOINED
    ])
  };

  state = {
    activity: null,
    analysisDialog: {
      open: false,
      data: {}
    }
  };

  openAnalysisDialog = givenSkills =>
    this.setState({ analysisDialog : { open : true, data : {givenSkills}}});

  handleCloseAnalysisDialog = () =>
    this.setState({ analysisDialog : { open : false, data : {}}});

  selectActivity = activity => this.setState({ activity });

  render() {
    const {
      activities,
      classes,
      onDeleteActivity,
      onEditActivity,
      onMoveActivity,
      onOpenActivity,
      pathStatus
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

    return (
      <Fragment>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Activity name</TableCell>
              <TableCell>Description</TableCell>
              {!canChange && <TableCell>Status</TableCell>}
              <TableCell style={{ width: COLUMN_ACTIONS_WIDTH }}>
                Actions
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {activities.map(activity => (
              <TableRow key={activity.id}>
                <TableCell>{activity.name}</TableCell>
                <TableCell>{activity.description}</TableCell>
                {!canChange && (
                  <TableCell>
                    {activity.solved && (
                      <Icon>
                        <DoneIcon />
                      </Icon>
                    )}
                  </TableCell>
                )}
                <TableCell>
                  <Button
                    onClick={() => onOpenActivity(activity)}
                    variant="raised"
                  >
                    Solve
                  </Button>
                  {canChange && (
                    <Button
                      className={classes.button}
                      id={activity.id}
                      onClick={() => this.selectActivity(activity)}
                      variant="raised"
                    >
                      More
                    </Button>
                  )}
                  {activity.givenSkills && (
                    <Button
                      onClick={() =>
                        this.openAnalysisDialog(activity.givenSkills)
                      }
                      variant="raised"
                    >
                      View Analysis
                    </Button>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        {canChange && <Menu
          anchorEl={document.getElementById(
            this.state.activity && this.state.activity.id
          )}
          onClose={() => this.selectActivity()}
          open={!!this.state.activity}
        >
          <MenuItem
            className={classes.button}
            onClick={() =>
              this.selectActivity() || onEditProblem(this.state.activity)
            }
            variant="raised"
          >
            Edit
          </MenuItem>
          {this.state.activity &&
          this.state.activity.orderIndex !== minOrderIndex && (
            <MenuItem
              className={classes.button}
              onClick={() =>
                this.selectActivity() ||
                onMoveProblem(this.state.activity, "up")
              }
              variant="raised"
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
                onMoveProblem(this.state.activity, "down")
              }
              variant="raised"
            >
              Move Down
            </MenuItem>
          )}
        </Menu> }
        <AnalysisDialog
          open={this.state.analysisDialog.open}
          handleClose={this.handleCloseAnalysisDialog}
          skills={this.state.analysisDialog.data}
          />
      </Fragment>
    );
  }
}

export default withStyles(styles)(ActivitiesTable);

