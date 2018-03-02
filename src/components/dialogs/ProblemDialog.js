/**
 * @file PathDialog container module
 * @author Theodor Shaytanov <theodor.shaytanov@gmail.com>
 * @created 01.03.18
 */

import React, { Fragment } from "react";
import PropTypes from "prop-types";

import Button from "material-ui/Button";
import Dialog, {
  DialogActions,
  DialogContent,
  DialogTitle
} from "material-ui/Dialog/index";
import MenuItem from "material-ui/Menu/MenuItem";
import TextField from "material-ui/TextField/TextField";

import { pathDialogHide } from "../../containers/Paths/actions";

class ProblemDialog extends React.PureComponent {
  static propTypes = {
    dispatch: PropTypes.func.isRequired,
    open: PropTypes.bool.isRequired,
    problem: PropTypes.object
  };

  state = {
    type: "jupiter"
  };

  getTypeSpecificElements() {
    switch (this.state.type) {
      case "jupiter":
        return (
          <Fragment>
            <TextField
              fullWidth
              label="Problem Notebook URL"
              margin="dense"
              onChange={e => this.onFieldChange("problemURL", e.target.value)}
              onKeyPress={this.catchReturn}
            />
            <TextField
              fullWidth
              label="Solution Notebook URL"
              margin="dense"
              onChange={e => this.onFieldChange("solutionURL", e.target.value)}
              onKeyPress={this.catchReturn}
            />
            <TextField
              fullWidth
              label="Number of frozen cells"
              margin="dense"
              onChange={e => this.onFieldChange("frozen", e.target.value)}
              onKeyPress={this.catchReturn}
              type="number"
            />
          </Fragment>
        );
      default:
    }
  }

  onFieldChange = (field, value) => this.setState({ [field]: value });

  onClose = () => this.props.dispatch(pathDialogHide());

  render() {
    const { problem, open } = this.props;
    return (
      <Dialog onClose={this.onClose} open={open}>
        <DialogTitle>
          {problem && problem.id ? "Edit Problem" : "Add New Problem"}
        </DialogTitle>
        <DialogContent
          style={{
            width: 480
          }}
        >
          <TextField
            autoFocus
            defaultValue={problem && problem.name}
            fullWidth
            label="Name"
            margin="dense"
            onChange={e => this.onFieldChange("name", e.target.value)}
            onKeyPress={this.catchReturn}
            required
          />
          <TextField
            defaultValue={problem && problem.type}
            fullWidth
            label="Type"
            margin="dense"
            onChange={e => this.onFieldChange("type", e.target.value)}
            select
            value={this.state.type}
          >
            <MenuItem value="jupiter">Jupyter Notebook</MenuItem>
            <MenuItem value="text">Text</MenuItem>
          </TextField>
          {this.getTypeSpecificElements()}
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

export default ProblemDialog;
