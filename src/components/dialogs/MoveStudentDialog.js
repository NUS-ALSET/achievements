/**
 * @file MoveStudentDialog container module
 * @author Theodor Shaytanov <theodor.shaytanov@gmail.com>
 * @created 14.03.18
 */

import React from "react";
import PropTypes from "prop-types";

import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogTitle from "@material-ui/core/DialogTitle";
import TextField from "@material-ui/core/TextField";
import MenuItem from "@material-ui/core/MenuItem";


class MoveStudentDialog extends React.PureComponent {
  static propTypes = {
    handleCloseDialog: PropTypes.func,
    handleMOVEStudentRequest: PropTypes.func,
    open: PropTypes.bool.isRequired,
    courseId: PropTypes.string.isRequired,
    courses: PropTypes.array.isRequired,
    // studentName: PropTypes.any,
    studentId: PropTypes.any
  };

  state = {
    targetCourse: ""
  };

  onCourseSelect = e => this.setState({ targetCourse: e.target.value });
  onClose = () => {
    this.props.handleCloseDialog();
    this.setState({ targetCourse: "" });
  };
  onCommit = () =>
    this.props.handleMOVEStudentRequest(
      this.props.courseId,
      this.state.targetCourse,
      this.props.studentId
    );

  render() {
    const { courseId, courses, open } = this.props;

    return (
      <Dialog onClose={this.onClose} open={open}>
        <DialogTitle>Move Student</DialogTitle>
        <DialogContent
          style={{
            minWidth: 320
          }}
        >
          <TextField
            fullWidth
            label="Course"
            onChange={this.onCourseSelect}
            select
            value={this.state.targetCourse}
          >
            {courses
              .filter(course => course.id !== courseId)
              .map(course => (
                <MenuItem key={course.id} value={course.id}>
                  {course.name}
                </MenuItem>
              ))}
          </TextField>
        </DialogContent>
        <DialogActions>
          <Button color="secondary" onClick={this.onClose}>
            Cancel
          </Button>
          <Button color="primary" onClick={this.onCommit} variant="contained">
            Commit
          </Button>
        </DialogActions>
      </Dialog>
    );
  }
}

export default MoveStudentDialog;
