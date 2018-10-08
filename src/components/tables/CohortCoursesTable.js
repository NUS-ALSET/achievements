/**
 * @file CohortCoursesTable container module
 * @author Theodor Shaytanov <theodor.shaytanov@gmail.com>
 * @created 22.02.18
 */

import React from "react";
import PropTypes from "prop-types";

import { Link, withRouter } from "react-router-dom";

import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import IconButton from "@material-ui/core/IconButton";
import Paper from '@material-ui/core/Paper';

import DeleteIcon from "@material-ui/icons/Delete";

import withStyles from "@material-ui/core/styles/withStyles";
import { cohort } from "../../types";
import { cohortCourseUpdateRequest } from "../../containers/Cohort/actions";

const styles = theme => ({
  root: {
    width: '100%',
    marginTop: theme.spacing.unit * 3,
    overflowX: 'auto',
  },
  table: {
    minWidth: 700,
  },
  narrowCell: {
    padding: theme.spacing.unit
  },
  button: {
    margin: theme.spacing.unit
  }
});

class CohortCoursesTable extends React.PureComponent {
  static propTypes = {
    classes: PropTypes.object,
    cohort: cohort,
    courses: PropTypes.array,
    dispatch: PropTypes.func,
    isOwner: PropTypes.bool,
    match: PropTypes.object
  };

  onRemoveClick = courseId =>
    this.props.dispatch(
      cohortCourseUpdateRequest(this.props.cohort.id, courseId, "remove")
    );

  render() {
    const { classes, courses, cohort, isOwner } = this.props;
    let totals = {
      progress: 0,
      participants: 0
    };
    courses.forEach(course => {
      totals.progress += course.progress;
      totals.participants += course.participants;
      return true;
    });

    return (
      <Paper className={classes.root}>
      <Table className={classes.table}>
        <TableHead>
          <TableRow>
            <TableCell className={classes.narrowCell}>Course Rank</TableCell>
            {cohort.pathsData && cohort.pathsData.length ? (
              cohort.pathsData.map(pathData => (
                <TableCell
                  className={classes.narrowCell}
                  key={(pathData && pathData.id) || Math.random()}
                >
                  {pathData && pathData.name}
                </TableCell>
              ))
            ) : (
              <TableCell className={classes.narrowCell}>
                Paths for Cohort
              </TableCell>
            )}
            <TableCell className={classes.narrowCell}>
              Explorers(
              {totals.progress})
            </TableCell>

            <TableCell className={classes.narrowCell}>
              Total Students ({totals.participants})
            </TableCell>
            <TableCell
              className={classes.narrowCell}
            >
              Course
            </TableCell>
            {isOwner && <TableCell>Actions</TableCell>}
          </TableRow>
        </TableHead>
        <TableBody>
          {courses &&
            courses.map(course => (
              <TableRow key={course.id}>
                <TableCell className={classes.narrowCell}>
                  <strong>{course.rank}</strong>
                </TableCell>
                {cohort.paths ? (
                  cohort.paths.length &&
                  cohort.paths.map(id => (
                    <TableCell className={classes.narrowCell} key={id}>
                      {course.pathsProgress && course.pathsProgress[id]}
                    </TableCell>
                  ))
                ) : (
                  <TableCell className={classes.narrowCell}>None</TableCell>
                )}
                <TableCell className={classes.narrowCell}>
                  {course.progress}
                </TableCell>
                <TableCell className={classes.narrowCell}>
                  {course.participants}
                </TableCell>
                <TableCell className={classes.narrowCell}>
                  <Link to={`/courses/${course.id}`}>{course.name}</Link>
                </TableCell>
                {isOwner && (
                  <TableCell className={classes.narrowCell}>
                    <IconButton>
                      <DeleteIcon
                        onClick={() => this.onRemoveClick(course.id)}
                      />
                    </IconButton>
                  </TableCell>
                )}
              </TableRow>
            ))}
        </TableBody>
      </Table>
      </Paper>
    );
  }
}

export default withStyles(styles)(withRouter(CohortCoursesTable));
