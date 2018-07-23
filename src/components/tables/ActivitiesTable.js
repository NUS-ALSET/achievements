/**
 * @file ActivitiesTable component module
 * @author Theodor Shaytanov <theodor.shaytanov@gmail.com>
 * @created 22.02.18
 */

import React, { Fragment } from "react";
import PropTypes from "prop-types";

import Button from "@material-ui/core/Button";
import Icon from "@material-ui/core/Icon";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";

import DoneIcon from "@material-ui/icons/Done";

import withStyles from "@material-ui/core/styles/withStyles";

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
    pathOwnerId: PropTypes.any
  };

  render() {
    const {
      activities,
      classes,
      currentUserId,
      onEditProblem,
      onMoveProblem,
      onOpenProblem,
      pathOwnerId
    } = this.props;

    return (
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Activity name</TableCell>
            <TableCell>Description</TableCell>
            {currentUserId !== pathOwnerId && <TableCell>Status</TableCell>}
            <TableCell
              style={{
                width: pathOwnerId === currentUserId ? 450 : 200
              }}
            >
              Actions
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {activities.map(activity => (
            <TableRow key={activity.id}>
              <TableCell>{activity.name}</TableCell>
              <TableCell>{activity.description}</TableCell>
              {currentUserId !== pathOwnerId && (
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
                {pathOwnerId === currentUserId && (
                  <Fragment>
                    <Button
                      className={classes.button}
                      onClick={() => onEditProblem(activity)}
                      variant="raised"
                    >
                      Edit
                    </Button>
                    <Button
                      className={classes.button}
                      onClick={() => onMoveProblem(activity, "up")}
                      variant="raised"
                    >
                      Up
                    </Button>
                    <Button
                      className={classes.button}
                      onClick={() => onMoveProblem(activity, "down")}
                      variant="raised"
                    >
                      Down
                    </Button>
                  </Fragment>
                )}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    );
  }
}

export default withStyles(styles)(ActivitiesTable);
