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
    description: "",
    // Course Name cannot be nonsense or empty spaces
    isCorrectInput_Name: true,
    // Course pwd cannot have white spaces anywhere
    isCorrectInput_Psw: true
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
      description: "",
      isCorrectInput_Name: true,
      isCorrectInput_Psw: true
    }) || this.props.dispatch(courseHideDialog());

  catchReturn = event => event.key === "Enter" && this.onCommit();

  // validate input first
  onFieldChange = (field, value) => {
    if (field === "name") {
      /* eslint-disable no-useless-escape */
      if (/^[^\s][a-zA-Z0-9\t\n ./<>?;:"'`!@#$%^&*()\[\]{}_+=|\\-]*$/
        .test(value)
      ) {
        this.setState({
          isCorrectInput_Name: true,
          ["name"]: value.trim()
        });
      } else {
        this.setState({
          isCorrectInput_Name: false
        });
      }
    }
    // password does not allow spaces anywhere
    if (field === "password") {
      /* eslint-disable no-useless-escape */
      if (/^[^\s][a-zA-Z0-9\t\n./<>?;:"'`!@#$%^&*()\[\]{}_+=|\\-]*$/
        .test(value)
      ) {
        this.setState({
          isCorrectInput_Psw: true,
          ["password"]: value.trim()
        });
      } else {
        this.setState({
          isCorrectInput_Psw: false
        });
      }
    }
  };

  onCommit = () => {
    // Prevent changing real course data
    let course = Object.assign({}, this.props.course, this.state);

    // Update only changed fields (state populates in `onChange` handler
    this.props.dispatch(courseNewRequest(this.removeEmpty(course)));
    this.onClose();
  };

  render() {
    const { course, open } = this.props;

    let helperTextPsw;

    // helperText for password input
    if (course && course.id) {
      if (this.state.isCorrectInput_Psw) {
        helperTextPsw = "Leave it blank to keep existing password";
      } else {
        helperTextPsw = "Password cannot be empty, have spaces or invalid characters";
      }
    } else {
      if (this.state.isCorrectInput_Psw) {
        helperTextPsw = "";
      } else {
        helperTextPsw = "Password cannot be empty, have spaces or invalid characters";
      }
    }

    return (
      <Dialog onClose={this.onClose} open={open}>
        <DialogTitle>
          {course && course.id ? "Edit Course" : "Add New Course"}
        </DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            error={!this.state.isCorrectInput_Name}
            helperText={this.state.isCorrectInput_Name
              ? ""
              : "name cannot be empty or have invalid characters"}
            defaultValue={course && course.name}
            fullWidth
            label="Course name"
            margin="dense"
            onChange={e => this.onFieldChange("name", e.target.value)}
            onKeyPress={this.catchReturn}
            required
          />
          <TextField
            error={!this.state.isCorrectInput_Psw}
            helperText={helperTextPsw}
            defaultValue={course && course.password}
            fullWidth
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
          <Button
            disabled={
              !this.state.isCorrectInput_Name ||
              !this.state.isCorrectInput_Psw
            }
            color="primary"
            onClick={this.onCommit}
            variant="raised"
          >
            Commit
          </Button>
        </DialogActions>
      </Dialog>
    );
  }
}

export default AddCourseDialog;
