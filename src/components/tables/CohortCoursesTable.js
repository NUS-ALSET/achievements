/**
 * @file CohortCoursesTable container module
 * @author Theodor Shaytanov <theodor.shaytanov@gmail.com>
 * @created 22.02.18
 */

import React from "react";
import PropTypes from "prop-types";

import { withRouter } from "react-router-dom";

import Table, {
  TableBody,
  TableCell,
  TableHead,
  TableRow
} from "material-ui/Table";
import IconButton from "material-ui/IconButton";

import DeleteIcon from "material-ui-icons/Delete";

import withStyles from "material-ui/styles/withStyles";
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

    return (
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Course Rank</TableCell>
            <TableCell>Participants</TableCell>
            <TableCell>Path Progress</TableCell>
            <TableCell>Event</TableCell>
            {isOwner && <TableCell>Actions</TableCell>}
          </TableRow>
        </TableHead>
        <TableBody>
          {courses.map(course => (
            <TableRow key={course.id}>
              <TableCell>
                <strong>{course.rank}</strong>
              </TableCell>
              <TableCell>{course.participants}</TableCell>
              <TableCell>{course.progress}</TableCell>
              <TableCell>
                <a
                  rel="noopener noreferrer"
                  target="_blank"
                  href={`/#/courses/${course.id}`}
                >
                  {course.name}
                </a>
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
