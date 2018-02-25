import Button from "material-ui/Button";
import Dialog, {
  DialogActions,
  DialogContent,
  DialogTitle
} from "material-ui/Dialog/index";

import PropTypes from "prop-types";
import React from "react";
import TextField from "material-ui/TextField/TextField";
import { APP_SETTING } from "../../achievementsApp/config";
import {
  courseHideDialog,
  courseNewRequest
} from "../../containers/Courses/actions";

export class AddCourseDialog extends React.Component {
  static propTypes = {
    open: PropTypes.bool.isRequired,
    course: PropTypes.object,
    dispatch: PropTypes.func.isRequired
  };

  state = {
    name: "",
    password: "",
    description: ""
  };

  onClose = () => this.props.dispatch(courseHideDialog());

  onFieldChange = (field, value) => this.setState({ [field]: value });
  onCommit = () => {
    // Prevent changing real course data
    let course = Object.assign({}, this.props.course, this.state);

    // Update only changed fields (state populates in `onChange` handler
    Object.keys(course).forEach(field => {
      if (!course[field]) {
        delete course[field];
      }
    });

    this.props.dispatch(courseNewRequest(course));

    // Empty state
    this.setState({
      name: "",
      password: "",
      description: ""
    });
    this.onClose();
  };

  render() {
    const { course, open } = this.props;

    return (
      <Dialog onClose={this.onClose} open={open}>
        <DialogTitle>
          {course && course.id ? "Edit Course" : "Add New Course"}
        </DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            defaultValue={course && course.name}
            fullWidth
            label="Course name"
            margin="dense"
            onChange={e => this.onFieldChange("name", e.target.value)}
            required
          />
          <TextField
            defaultValue={course && course.password}
            fullWidth
            label="Password"
            margin="dense"
            onChange={e => this.onFieldChange("password", e.target.value)}
            required
            type="password"
          />
          {APP_SETTING.isSuggesting && (
            <TextField
              defaultValue={course && course.description}
              fullWidth
              label="Description"
              margin="dense"
              onChange={e => this.onFieldChange("description", e.target.value)}
            />
          )}
        </DialogContent>
        <DialogActions>
          <Button color="secondary" onClick={this.onClose}>
            Cancel
          </Button>
          <Button color="primary" onClick={this.onCommit} variant="raised">
            Commit
          </Button>
        </DialogActions>
      </Dialog>
    );
  }
}

export default AddCourseDialog;
