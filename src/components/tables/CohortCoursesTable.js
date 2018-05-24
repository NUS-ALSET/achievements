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

import DeleteIcon from "@material-ui/icons/Delete";

import withStyles from "@material-ui/core/styles/withStyles";
import { cohortsService } from "../../services/cohorts";

const styles = theme => ({
  button: {
    margin: theme.spacing.unit
  }
});

class CohortCoursesTable extends React.PureComponent {
  static propTypes = {
    classes: PropTypes.object,
    courses: PropTypes.array,
    isOwner: PropTypes.bool,
    match: PropTypes.object
  };

  render() {
    const { courses, isOwner } = this.props;
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
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Course Rank</TableCell>
            <TableCell>Path Progress ({totals.progress})</TableCell>
            <TableCell> Participants ({totals.participants})</TableCell>
            <TableCell>Course</TableCell>
            {isOwner && <TableCell>Actions</TableCell>}
          </TableRow>
        </TableHead>
        <TableBody>
          {courses.map(course => (
            <TableRow key={course.id}>
              <TableCell>
                <strong>{course.rank}</strong>
              </TableCell>
              <TableCell>{course.progress}</TableCell>
              <TableCell>{course.participants}</TableCell>
              <TableCell>
                <Link to={`/courses/${course.id}`}>{course.name}</Link>
              </TableCell>
              {isOwner && (
                <TableCell>
                  <IconButton>
                    <DeleteIcon
                      onClick={() =>
                        cohortsService.removeCourse(
                          this.props.match.params.cohortId,
                          course.id
                        )
                      }
                    />
                  </IconButton>
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
