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
    cohort: PropTypes.object,
    dispatch: PropTypes.func.isRequired,
    open: PropTypes.bool.isRequired
  };
  state = {
    cohortName: "",
    cohortDescription: ""
  };

  onNameChange = e => this.setState({ cohortName: e.currentTarget.value });
  onDescriptionChange = e =>
    this.setState({ cohortDescription: e.currentTarget.value });
  onClose = () => this.props.dispatch(addCohortDialogHide());
  onCommit = () =>
    this.props.dispatch(
      addCohortRequest({
        ...this.props.cohort,
        name: this.state.cohortName,
        description: this.state.cohortDescription
      })
    );
  catchReturn = event => event.key === "Enter" && this.onCommit();

  render() {
    const { open, cohort } = this.props;

    return (
      <Dialog onClose={this.onClose} open={open}>
        <DialogTitle>
          {cohort && cohort.id ? "Edit Cohort" : "Add Cohort"}
        </DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            defaultValue={cohort && cohort.name}
            fullWidth
            label="Name"
            margin="dense"
            onChange={this.onNameChange}
            onKeyPress={this.catchReturn}
            required
          />
          <TextField
            defaultValue={cohort && cohort.description}
            fullWidth
            label="Description"
            margin="dense"
            onChange={this.onDescriptionChange}
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

export default AddCohortDialog;
