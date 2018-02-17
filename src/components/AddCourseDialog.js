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
    onClose: PropTypes.func.isRequired,
    requestCreation: PropTypes.func.isRequired,
    onFieldChange: PropTypes.func.isRequired,
    open: PropTypes.bool.isRequired,
    values: PropTypes.object.isRequired
  };

  handleCommit = () => {
    this.props.requestCreation(
      this.props.values.name,
      this.props.values.password
    );
  };

  render() {
    return (
      <Dialog open={this.props.open} onClose={this.props.onClose}>
        <DialogTitle id="simple-dialog-title">Add New Course</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            required
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
            required
            error={!this.props.values.password}
            value={this.props.values.password}
            margin="dense"
            label="Password"
            fullWidth
            type="password"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={this.props.onClose} color="secondary">
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
