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

// RegExp rules
import {
  AddName,
  NoStartWhiteSpace,
  CoursePswRule
} from "../regexp-rules/RegExpRules";

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
    isCorrectInput_Name: false,
    // Course pwd should follow the RegExpRules
    isCorrectInput_Psw: false
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
      isCorrectInput_Name: false,
      isCorrectInput_Psw: false
    }) || this.props.dispatch(courseHideDialog());

  // validate input first
  onFieldChange = (field, value) => {
    const { course } = this.props;
    if (course && course.id) {
      this.setState({
        isCorrectInput_Name: true,
        isCorrectInput_Psw: true
      });
    }
    if (field === "name") {
      if (AddName.test(value) && NoStartWhiteSpace.test(value)) {
        this.setState({
          isCorrectInput_Name: true,
          [field]: value.trim()
        });
      } else {
        this.setState({
          isCorrectInput_Name: false
        });
      }
    } else if (field === "password") {
      // password does not allow spaces anywhere
      if (CoursePswRule.test(value) && NoStartWhiteSpace.test(value)) {
        this.setState({
          isCorrectInput_Psw: true,
          [field]: value.trim()
        });
      } else {
        this.setState({
          isCorrectInput_Psw: false
        });
      }
    } else {
      this.setState({
        [field]: value.trim()
      });
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
        helperTextPsw =
          "Password (2-16 length) should not have spaces or invalid characters";
      }
    } else {
      if (this.state.isCorrectInput_Psw) {
        helperTextPsw = "";
      } else {
        helperTextPsw =
          "Password (2-16 length) should not have spaces or invalid characters";
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
            defaultValue={course && course.name}
            error={!this.state.isCorrectInput_Name}
            fullWidth
            helperText={
              this.state.isCorrectInput_Name
                ? ""
                : "Name cannot be empty or too long or have invalid characters"
            }
            label="Course name"
            margin="dense"
            onChange={e => this.onFieldChange("name", e.target.value)}
            required
          />
          <TextField
            defaultValue={course && course.password}
            error={!this.state.isCorrectInput_Psw}
            fullWidth
            helperText={helperTextPsw}
            label="Password"
            margin="dense"
            onChange={e => this.onFieldChange("password", e.target.value)}
            required
            type="password"
          />
          <TextField
            defaultValue={course && course.description}
            fullWidth
            label="Description"
            margin="dense"
            onChange={e => this.onFieldChange("description", e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button color="secondary" onClick={this.onClose}>
            Cancel
          </Button>
          <Button
            color="primary"
            disabled={
              !this.state.isCorrectInput_Name || !this.state.isCorrectInput_Psw
            }
            onClick={this.onCommit}
            variant="contained"
          >
            Commit
          </Button>
        </DialogActions>
      </Dialog>
    );
  }
}

export default AddCourseDialog;
