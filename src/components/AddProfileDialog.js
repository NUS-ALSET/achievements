/**
 * @file AddProfileDialog container module
 * @author Theodor Shaytanov <theodor.shaytanov@gmail.com>
 * @created 29.01.18
 */

import React from "react";
import PropTypes from "prop-types";

import Dialog, {
  DialogActions,
  DialogContent,
  DialogTitle
} from "material-ui/Dialog/index";
import Button from "material-ui/Button";
import TextField from "material-ui/TextField";

class AddProfileDialog extends React.PureComponent {
  static propTypes = {
    externalSource: PropTypes.object
  };

  render() {
    return (
      <Dialog open={true}>
        <DialogTitle>Add Profile</DialogTitle>
        <DialogContent>
          <TextField label="Profile" />
        </DialogContent>
        <DialogActions>
          <Button color="secondary">Cancel</Button>
          <Button>Commit</Button>
        </DialogActions>
      </Dialog>
    );
  }
}

export default AddProfileDialog;
