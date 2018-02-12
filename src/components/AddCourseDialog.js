import React from "react";
import PropTypes from "prop-types";
import Dialog, {
  DialogActions,
  DialogContent,
  DialogTitle
} from "material-ui/Dialog/index";
import Button from "material-ui/Button";
import TextField from "material-ui/TextField/TextField";

export class AddCourseDialog extends React.Component {
  static propTypes = {
    requestClose: PropTypes.func.isRequired,
    requestCreation: PropTypes.func.isRequired,
    onFieldChange: PropTypes.func.isRequired,
    open: PropTypes.bool.isRequired,
    values: PropTypes.object.isRequired
  };

  handleCancel = () => {
    this.props.requestClose();
  };

  handleCommit = () => {
    this.props.requestCreation(
      this.props.values.name,
      this.props.values.password
    );
  };

  render() {
    return (
      <Dialog open={this.props.open}>
        <DialogTitle id="simple-dialog-title">Add New Course</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            error={!this.props.values.name}
            onChange={event =>
              this.props.onFieldChange("name", event.currentTarget.value)
            }
            value={this.props.values.name}
            margin="dense"
            label="Course name"
            fullWidth
          />
          <TextField
            onChange={event =>
              this.props.onFieldChange("password", event.currentTarget.value)
            }
            error={!this.props.values.password}
            value={this.props.values.password}
            margin="dense"
            label="Password"
            fullWidth
            type="password"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={this.handleCancel} color="secondary">
            Cancel
          </Button>
          <Button onClick={this.handleCommit} color="primary" raised>
            Commit
          </Button>
        </DialogActions>
      </Dialog>
    );
  }
}

export default AddCourseDialog;
