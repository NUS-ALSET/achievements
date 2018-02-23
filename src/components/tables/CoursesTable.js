import { Link } from "react-router-dom";
import { isEmpty } from "react-redux-firebase";
import Button from "material-ui/Button";
import PropTypes from "prop-types";
import React from "react";
import Table, {
  TableBody,
  TableCell,
  TableHead,
  TableRow
} from "material-ui/Table";

import withStyles from "material-ui/styles/withStyles";

const styles = theme => ({
  link: {
    textDecoration: "none"
  },
  button: {
    margin: theme.spacing.unit
  }
});

class CoursesTable extends React.PureComponent {
  static propTypes = {
    ownerId: PropTypes.string.isRequired,
    courses: PropTypes.any.isRequired,
    onDeleteCourseClick: PropTypes.func.isRequired,
    classes: PropTypes.object.isRequired
  };

  render() {
    const { onDeleteCourseClick, classes, courses, ownerId } = this.props;

    return (
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Course name</TableCell>
            <TableCell>Instructor</TableCell>
            <TableCell>Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {isEmpty(courses) ? (
            <TableRow>
              <TableCell colSpan={3}>Empty list</TableCell>
            </TableRow>
          ) : (
            Object.keys(courses).map(courseId => {
              return (
                <TableRow key={courseId}>
                  <TableCell>{courses[courseId].name}</TableCell>
                  <TableCell>{courses[courseId].instructorName}</TableCell>
                  <TableCell>
                    <Link to={`/courses/${courseId}`} className={classes.link}>
                      <Button className={classes.button} raised>
                        View
                      </Button>
                    </Link>
                    {courses[courseId].owner === ownerId && (
                      <Button
                        className={classes.button}
                        onClick={() => onDeleteCourseClick(courseId)}
                        raised
                      >
                        Delete
                      </Button>
                    )}
                  </TableCell>
                </TableRow>
              );
            })
          )}
        </TableBody>
      </Table>
    );
  }
}

export default withStyles(styles)(CoursesTable);
