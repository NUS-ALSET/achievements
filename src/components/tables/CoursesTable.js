import { Link } from "react-router-dom";
import { isEmpty } from "react-redux-firebase";
import Button from "@material-ui/core/Button";
import IconButton from "@material-ui/core/IconButton";
import PropTypes from "prop-types";
import React, { Fragment } from "react";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";

import SearchIcon from "@material-ui/icons/Search";
import EditIcon from "@material-ui/icons/Edit";
import DeleteIcon from "@material-ui/icons/Delete";

import withStyles from "@material-ui/core/styles/withStyles";
import { APP_SETTING } from "../../achievementsApp/config";
import {
  courseRemoveDialogShow,
  courseShowNewDialog
} from "../../containers/Courses/actions";

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
    dispatch: PropTypes.func.isRequired,
    onDeleteCourseClick: PropTypes.func.isRequired,
    classes: PropTypes.object.isRequired
  };

  onDeleteCourseClick = course =>
    this.props.dispatch(courseRemoveDialogShow(course.id, course.name));
  onEditCourseClick = course =>
    this.props.dispatch(courseShowNewDialog(course));

  render() {
    const { classes, courses, ownerId } = this.props;

    return (
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Course name</TableCell>
            <TableCell>Instructor</TableCell>
            <TableCell
              style={(APP_SETTING.isSuggesting && { width: 200 }) || {}}
            >
              Actions
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {isEmpty(courses) ? (
            <TableRow>
              <TableCell colSpan={5}>Empty list</TableCell>
            </TableRow>
          ) : (
            Object.keys(courses)
              .map(id => ({ ...courses[id], id }))
              .map(course => (
                <TableRow key={course.id}>
                  <TableCell>{course.name}</TableCell>
                  <TableCell>{course.instructorName}</TableCell>
                  <TableCell>
                    {APP_SETTING.isSuggesting ? (
                      <Fragment>
                        <Link
                          className={classes.link}
                          to={`/courses/${course.id}`}
                        >
                          <IconButton aria-label="Open course">
                            <SearchIcon />
                          </IconButton>
                        </Link>
                        {course.owner === ownerId && (
                          <Fragment>
                            <IconButton
                              aria-label="Edit course"
                              onClick={() => this.onEditCourseClick(course)}
                            >
                              <EditIcon />
                            </IconButton>
                            <IconButton
                              aria-label="Delete course"
                              onClick={() => this.onDeleteCourseClick(course)}
                            >
                              <DeleteIcon />
                            </IconButton>
                          </Fragment>
                        )}
                      </Fragment>
                    ) : (
                      <Fragment>
                        <Link
                          className={classes.link}
                          to={`/courses/${course.id}`}
                        >
                          <Button className={classes.button} variant="raised">
                            View
                          </Button>
                        </Link>
                        {course.owner === ownerId && (
                          <Fragment>
                            <Button
                              className={classes.button}
                              onClick={() => this.onEditCourseClick(course)}
                              variant="raised"
                            >
                              Edit
                            </Button>
                            <Button
                              className={classes.button}
                              onClick={() => this.onDeleteCourseClick(course)}
                              variant="raised"
                            >
                              Delete
                            </Button>
                          </Fragment>
                        )}
                      </Fragment>
                    )}
                  </TableCell>
                </TableRow>
              ))
          )}
        </TableBody>
      </Table>
    );
  }
}

export default withStyles(styles)(CoursesTable);
