import React from "react";
import PropTypes from "prop-types";

import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import IconButton from "@material-ui/core/IconButton";

import CheckCircleIcon from "@material-ui/icons/CheckCircle";
import RadioButtonUncheckedIcon from "@material-ui/icons/RadioButtonUnchecked";

import ArrowDownwardIcon from "@material-ui/icons/ArrowDownward";
import ArrowUpwardIcon from "@material-ui/icons/ArrowUpward";
import DeleteIcon from "@material-ui/icons/Delete";

import { Link } from "react-router-dom";

import withStyles from "@material-ui/core/styles/withStyles";

const styles = () => ({
  actionsColumn: {
    minWidth: 200
  },
  link: {
    color: "black",
    cursor: "pointer",
    textDecoration: "none"
  }
});

class JourneyActivitiesTable extends React.PureComponent {
  static propTypes = {
    activities: PropTypes.arrayOf(
      PropTypes.shape({
        description: PropTypes.string,
        id: PropTypes.string,
        name: PropTypes.string,
        pathId: PropTypes.string,
        pathName: PropTypes.string,
        status: PropTypes.bool
      })
    ),
    classes: PropTypes.shape({
      actionsColumn: PropTypes.string,
      link: PropTypes.string
    }),
    completed: PropTypes.object,
    journeyId: PropTypes.string,
    onDeleteActivityClick: PropTypes.func,
    onMoveActivityClick: PropTypes.func
  };

  render() {
    const {
      activities,
      classes,
      completed,
      journeyId,
      onDeleteActivityClick,
      onMoveActivityClick
    } = this.props;

    return (
      <Table key={journeyId}>
        <TableHead>
          <TableRow>
            <TableCell>No</TableCell>
            <TableCell>Status</TableCell>
            <TableCell>Name</TableCell>
            <TableCell>Path</TableCell>
            <TableCell>Description</TableCell>
            <TableCell className={classes.actionsColumn}>Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {activities && activities.length ? (
            activities.map((activityInfo, index) => (
              <TableRow key={activityInfo.id}>
                <TableCell>{index + 1}</TableCell>
                <TableCell>
                  {completed &&
                  completed[activityInfo.pathId] &&
                  completed[activityInfo.pathId][activityInfo.id] ? (
                    <CheckCircleIcon style={{ color: "forestgreen" }} />
                  ) : (
                    <RadioButtonUncheckedIcon />
                  )}
                </TableCell>
                <TableCell>
                  <Link
                    className={classes.link}
                    to={`/paths/${activityInfo.pathId}/activities/${
                      activityInfo.id
                    }`}
                  >
                    {activityInfo.name}
                  </Link>
                </TableCell>
                <TableCell>
                  <Link
                    className={classes.link}
                    to={`/paths/${activityInfo.pathId}`}
                  >
                    {activityInfo.pathName}
                  </Link>
                </TableCell>
                <TableCell>{activityInfo.description}</TableCell>
                <TableCell>
                  <IconButton
                    onClick={() =>
                      onMoveActivityClick(journeyId, activityInfo.id, "up")
                    }
                  >
                    <ArrowUpwardIcon />
                  </IconButton>
                  <IconButton
                    onClick={() =>
                      onMoveActivityClick(journeyId, activityInfo.id, "down")
                    }
                  >
                    <ArrowDownwardIcon />
                  </IconButton>
                  <IconButton
                    onClick={() =>
                      onDeleteActivityClick(journeyId, activityInfo.id)
                    }
                  >
                    <DeleteIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={6}>No activities defined</TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    );
  }
}

export default withStyles(styles)(JourneyActivitiesTable);
