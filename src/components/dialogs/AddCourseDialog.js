import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogTitle from "@material-ui/core/DialogTitle";
import PropTypes from "prop-types";
import React from "react";
import TextField from "@material-ui/core/TextField";
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

  removeEmpty = value =>
    Object.assign(
      {},
      ...Object.keys(value || {})
        .filter(key => value[key])
        .map(key => ({ [key]: value[key] }))
    );
  onClose = () =>
    this.setState({
      name: "",
      password: "",
      description: ""
    }) || this.props.dispatch(courseHideDialog());
  catchReturn = event => event.key === "Enter" && this.onCommit();
  onFieldChange = (field, value) => this.setState({ [field]: value });
  onCommit = () => {
    // Prevent changing real course data
    let course = Object.assign({}, this.props.course, this.state);

    // Update only changed fields (state populates in `onChange` handler
    this.props.dispatch(courseNewRequest(this.removeEmpty(course)));
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
            onKeyPress={this.catchReturn}
            required
          />
          <TextField
            defaultValue={course && course.password}
            fullWidth
            helperText={
              course && course.id
                ? "Leave it blank to keep existing password"
                : ""
            }
            label="Password"
            margin="dense"
            onChange={e => this.onFieldChange("password", e.target.value)}
            onKeyPress={this.catchReturn}
            required
            type="password"
          />
          <TextField
            defaultValue={course && course.description}
            fullWidth
            label="Description"
            margin="dense"
            onChange={e => this.onFieldChange("description", e.target.value)}
            onKeyPress={this.catchReturn}
          />
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
