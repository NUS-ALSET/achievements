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
import SearchIcon from "@material-ui/icons/Search";

import { Link } from "react-router-dom";

import withStyles from "@material-ui/core/styles/withStyles";

const styles = () => ({
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
        index: PropTypes.number,
        name: PropTypes.string,
        pathId: PropTypes.string,
        pathName: PropTypes.string,
        status: PropTypes.bool
      })
    ),
    classes: PropTypes.shape({
      link: PropTypes.string
    }),
    journeyId: PropTypes.string,
    onDeleteActivityClick: PropTypes.string,
    onMoveActivityClick: PropTypes.string
  };

  render() {
    const {
      activities,
      classes,
      onDeleteActivityClick,
      onMoveActivityClick
    } = this.props;

    return (
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>No</TableCell>
            <TableCell>Status</TableCell>
            <TableCell>Name</TableCell>
            <TableCell>Path</TableCell>
            <TableCell>Description</TableCell>
            <TableCell>Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {activities && activities.length ? (
            activities.map(activityInfo => (
              <TableRow key={activityInfo.id}>
                <TableCell>{activityInfo.index}</TableCell>
                <TableCell>
                  {activityInfo.status ? (
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
                    onClick={onMoveActivityClick || onDeleteActivityClick}
                  >
                    <SearchIcon />
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
