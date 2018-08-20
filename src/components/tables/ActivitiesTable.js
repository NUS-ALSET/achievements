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

import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogTitle from "@material-ui/core/DialogTitle";

import DoneIcon from "@material-ui/icons/Done";

import withStyles from "@material-ui/core/styles/withStyles";
import {
  PATH_STATUS_COLLABORATOR,
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
    onEditProblem: PropTypes.func.isRequired,
    onOpenProblem: PropTypes.func.isRequired,
    onMoveProblem: PropTypes.func.isRequired,
    pathStatus: PropTypes.string
  };

  state = {
    activity: null,
    analysisDialog: {
      open: false,
      data: {}
    }
  };

  openAnalysisDialog = givenSkills =>
    this.setState({ analysisDialog: { open: true, data: givenSkills } });

  handleCloseAnalysisDialog = () =>
    this.setState({ analysisDialog: { open: false, data: {} } });

  selectActivity = activity => this.setState({ activity });

  render() {
    const {
      activities,
      classes,
      onEditProblem,
      onMoveProblem,
      onOpenProblem,
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
                    onClick={() => onOpenProblem(activity)}
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
        </Menu>
        <AnalysisDialog
          givenSkills={this.state.analysisDialog.data}
          handleClose={this.handleCloseAnalysisDialog}
          open={this.state.analysisDialog.open}
        />
      </Fragment>
    );
  }
}

export default withStyles(styles)(ActivitiesTable);

/* eslint-disable */
const AnalysisDialog = props => {
  return (
    <Dialog
      aria-describedby="alert-dialog-description"
      aria-labelledby="alert-dialog-title"
      onClose={props.handleClose}
      open={props.open}
    >
      <DialogTitle id="alert-dialog-title">
        {"Jupter Inline Problem Analysis"}
      </DialogTitle>
      <DialogContent>
        <pre style={{ color: "black", lineHeight: "1.5", padding: "0px 20px" }}>
          {JSON.stringify(props.givenSkills, null, "  ")}
        </pre>
      </DialogContent>
      <DialogActions>
        <Button autoFocus color="primary" onClick={props.handleClose}>
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
};
/* eslint-enable */
