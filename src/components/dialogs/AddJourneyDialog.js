import * as React from "react";
import PropTypes from "prop-types";

import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import DialogTitle from "@material-ui/core/DialogTitle";
import DialogContent from "@material-ui/core/DialogContent";
import DialogActions from "@material-ui/core/DialogActions";
import TextField from "@material-ui/core/TextField";

export class AddJourneyDialog extends React.PureComponent {
  static propTypes = {
    journey: PropTypes.any,
    onClose: PropTypes.func,
    onCommit: PropTypes.func,
    open: PropTypes.bool
  };

  state = {
    changes: {}
  };

  onChangeField = field => e =>
    this.setState({
      changes: { ...this.state.changes, [field]: e.target.value }
    });

  onCommit = () => this.props.onCommit(this.state.changes);

  render() {
    const { onClose, open } = this.props;
    const journey = { ...(this.props.journey || {}), ...this.state.changes };

    return (
      <Dialog
        aria-describedby="this dialog will create new or edit existing journey"
        aria-labelledby="add-journey-dialog"
        fullWidth
        onClose={onClose}
        open={open}
      >
        <DialogTitle id="add-journey-dialog">
          {journey.id ? "Edit Journey" : "Add Journey"}
        </DialogTitle>
        <DialogContent>
          <TextField
            fullWidth
            label="Name"
            onChange={this.onChangeField("name")}
            value={journey.name || ""}
          />
          <TextField
            fullWidth
            label="Description"
            onChange={this.onChangeField("description")}
            value={journey.description || ""}
          />
        </DialogContent>
        <DialogActions>
          <Button color="primary" onClick={this.onCommit} variant="contained">
            Commit
          </Button>
        </DialogActions>
      </Dialog>
    );
  }
}
