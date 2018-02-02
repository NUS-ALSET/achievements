/**
 * @file AddAssignmentDialog container module
 * @author Theodor Shaytanov <theodor.shaytanov@gmail.com>
 * @created 28.01.18
 */

import React from "react";
import PropTypes from "prop-types";

import Dialog, {
  DialogActions,
  DialogContent,
  DialogTitle
} from "material-ui/Dialog/index";
import format from "date-fns/format";
import Button from "material-ui/Button";
import TextField from "material-ui/TextField";
import MenuItem from "material-ui/Menu/MenuItem";

class AddAssignmentDialog extends React.PureComponent {
  static propTypes = {
    userAchievements: PropTypes.object,
    handleCommit: PropTypes.func.isRequired,
    handleCancel: PropTypes.func.isRequired,
    open: PropTypes.bool.isRequired
  };
  state = {
    name: "",
    details: "",
    solutionVisible: false,
    visible: false,
    deadline: format(new Date(), "YYYY-MM-DDTHH:mm"),
    questionType: "Text",
    level: ""
  };
  handleChange = name => event => {
    // Reset default `name` and `details` for `Profile` question type
    if (
      name === "questionType" &&
      this.state.questionType === "Profile" &&
      event.target.value !== "Profile" &&
      this.state.name === "Enter CodeCombat profile" &&
      this.state.details === "https://codecombat.com/"
    ) {
      this.setState({
        name: "",
        details: ""
      });
    }

    // Set default `name` and `details` for `Profile` question type
    if (
      name === "questionType" &&
      event.target.value === "Profile" &&
      !(this.state.name || this.state.details)
    ) {
      return this.setState({
        questionType: "Profile",
        name: "Enter CodeCombat profile",
        details: "https://codecombat.com/"
      });
    }

    this.setState({ [name]: event.target.value });
  };

  clearState = () => {
    this.setState({
      name: "",
      details: "",
      deadline: format(new Date(), "YYYY-MM-DDTHH:mm"),
      questionType: "Text",
      level: ""
    });
  };

  commit = () => {
    this.props.handleCommit(this.state);
    this.clearState();
  };

  render() {
    let { userAchievements, open, handleCancel } = this.props;

    userAchievements = userAchievements || {};
    userAchievements = userAchievements[this.state.questionType] || {};
    userAchievements = userAchievements.achievements || {};

    return (
      <Dialog open={open}>
        <DialogTitle>New Assignment</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="normal"
            select
            value={this.state.questionType}
            onChange={this.handleChange("questionType")}
            label="Type of question"
            fullWidth
          >
            <MenuItem value="Text">Text</MenuItem>
            <MenuItem value="Profile">Enter Code Combat Profile</MenuItem>
            <MenuItem value="CodeCombat">Complete Code Combat Level</MenuItem>
          </TextField>
          <TextField
            onChange={this.handleChange("name")}
            margin="normal"
            label="Name"
            value={this.state.name}
            fullWidth
          />
          <TextField
            onChange={this.handleChange("details")}
            margin="normal"
            label="Details/Links"
            value={this.state.details}
            fullWidth
          />
          {this.state.questionType === "CodeCombat" ? (
            <TextField
              margin="normal"
              select
              value={this.state.level || ""}
              onChange={this.handleChange("level")}
              label="Choose Level"
              fullWidth
            >
              {Object.keys(userAchievements).map(achievementId => (
                <MenuItem key={achievementId} value={achievementId}>
                  {userAchievements[achievementId].name}
                </MenuItem>
              ))}
            </TextField>
          ) : (
            undefined
          )}
          <TextField
            fullWidth
            label="Deadline"
            margin="normal"
            type="datetime-local"
            onChange={this.handleChange("deadline")}
            value={this.state.deadline}
            InputLabelProps={{
              shrink: true
            }}
          />
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => {
              this.clearState();
              handleCancel();
            }}
          >
            Cancel
          </Button>
          <Button onClick={this.commit}>Commit</Button>
        </DialogActions>
      </Dialog>
    );
  }
}

export default AddAssignmentDialog;
