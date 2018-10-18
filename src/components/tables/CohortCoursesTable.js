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
import Button from "@material-ui/core/Button";

import withStyles from "@material-ui/core/styles/withStyles";
import { cohort } from "../../types";
import { cohortCourseUpdateRequest } from "../../containers/Cohort/actions";

const MARGIN_MULTIPLIER = 3;

const styles = theme => ({
  table: {
    width: "100%",
    marginTop: theme.spacing.unit * MARGIN_MULTIPLIER,
    overflowX: "auto",
    minWidth: 700
  },
  narrowCell: {
    paddingRight: theme.spacing.unit,
    paddingLeft: theme.spacing.unit,
    paddingBottom: 2,
    paddingTop: 0
  },
  button: {
    margin: theme.spacing.unit
  },
  row: {
    "&:nth-of-type(odd)": {
      backgroundColor: "#f0f0f0"
    }
  }
});

class CohortCoursesTable extends React.PureComponent {
  static propTypes = {
    classes: PropTypes.object,
    cohort: cohort,
    courses: PropTypes.array,
    dispatch: PropTypes.func,
    isOwner: PropTypes.bool,
    isInstructor: PropTypes.bool,
    match: PropTypes.object
  };

  onRemoveClick = courseId =>
    this.props.dispatch(
      cohortCourseUpdateRequest(this.props.cohort.id, courseId, "remove")
    );

  render() {
    const { classes, courses, cohort, isInstructor } = this.props;
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
              Explorers (
              {totals.progress})
            </TableCell>

            <TableCell className={classes.narrowCell}>
              Total Students ({totals.participants})
            </TableCell>
            <TableCell
              className={classes.narrowCell}
              style={{ width: "50%", textAlign: "center" }}
            >
              Course
            </TableCell>
            {isInstructor && <TableCell>Actions</TableCell>}
          </TableRow>
        </TableHead>
        <TableBody>
          {courses &&
            courses.map(course => (
              <TableRow
                className={classes.row}
                hover
                key={course.id}
                style={{ height: 18 }}
              >
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
                <TableCell
                  className={classes.narrowCell}
                  style={{ width: "50%", textAlign: "center" }}
                >
                  <Link to={`/courses/${course.id}`}>{course.name}</Link>
                </TableCell>
                {isInstructor && (
                  <TableCell className={classes.narrowCell}>
                    <Button
                      color="secondary"
                      onClick={() => this.onRemoveClick(course.id)}
                      size="small"
                    >
                      Remove
                    </Button>
                  </TableCell>
                )}
              </TableRow>
            ))}
        </TableBody>
      </Table>
    );
  }
}

export default withStyles(styles)(withRouter(CohortCoursesTable));
