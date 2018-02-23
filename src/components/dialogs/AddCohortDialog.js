/**
 * @file AddCohortDialog container module
 * @author Theodor Shaytanov <theodor.shaytanov@gmail.com>
 * @created 22.02.18
 */
import React from "react";
import PropTypes from "prop-types";

import Button from "material-ui/Button";
import Dialog, {
  DialogActions,
  DialogContent,
  DialogTitle
} from "material-ui/Dialog";
import TextField from "material-ui/TextField";
import {
  addCohortDialogHide,
  addCohortRequest
} from "../../containers/Cohorts/actions";

class AddCohortDialog extends React.PureComponent {
  static propTypes = {
    dispatch: PropTypes.func.isRequired,
    open: PropTypes.bool.isRequired
  };
  state = {
    cohortName: ""
  };

  onNameChange = e => this.setState({ cohortName: e.currentTarget.value });
  onClose = () => this.props.dispatch(addCohortDialogHide());
  onCommit = () => this.props.dispatch(addCohortRequest(this.state.cohortName));
  catchReturn = event => event.key === "Enter" && this.onCommit();

  render() {
    const { open } = this.props;

    return (
      <Dialog open={open} onClose={this.onClose}>
        <DialogTitle>Add Cohort</DialogTitle>
        <DialogContent>
          <TextField
            fullWidth
            autoFocus
            label="Name"
            margin="dense"
            onChange={this.onNameChange}
            onKeyPress={this.catchReturn}
            required
            style={{
              width: 320
            }}
          />
        </DialogContent>
        <DialogActions>
          <Button color="secondary" onClick={this.onClose}>
            Cancel
          </Button>
          <Button color="primary" raised onClick={this.onCommit}>
            Commit
          </Button>
        </DialogActions>
      </Dialog>
    );
  }
}

export default AddCohortDialog;
