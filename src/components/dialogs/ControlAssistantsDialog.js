/**
 * @file ContorlAssistantsDialog container module
 * @author Theodor Shaytanov <theodor.shaytanov@gmail.com>
 * @created 24.02.18
 */

import React from "react";
import PropTypes from "prop-types";

import Avatar from "@material-ui/core/Avatar";
import Button from "@material-ui/core/Button";
import LinearProgress from "@material-ui/core/LinearProgress";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogTitle from "@material-ui/core/DialogTitle";
import IconButton from "@material-ui/core/IconButton";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemSecondaryAction from "@material-ui/core/ListItemSecondaryAction";
import TextField from "@material-ui/core/TextField";

import DeleteIcon from "@material-ui/icons/Delete";

class ControlAssistantsDialog extends React.Component {
  static propTypes = {
    assistants: PropTypes.any,
    newAssistant: PropTypes.any,
    onAddAssistant: PropTypes.func.isRequired,
    onAssistantKeyChange: PropTypes.func.isRequired,
    onClose: PropTypes.func.isRequired,
    onRemoveAssistant: PropTypes.func.isRequired,
    open: PropTypes.bool.isRequired,
    target: PropTypes.string.isRequired
  };

  state = {
    newAssistantKey: ""
  };

  addAssistant = () =>
    this.props.onAddAssistant(this.props.target, this.props.newAssistant.id);

  removeAssistant = assistantId =>
    this.props.onRemoveAssistant(this.props.target, assistantId);

  onKeyChange = e => {
    this.setState({
      newAssistantKey: e.target.value
    });
    this.props.onAssistantKeyChange(e.target.value);
  };

  render() {
    const {
      open,
      assistants,
      newAssistant,
      onAddAssistant,
      onClose,
      onRemoveAssistant,
      target
    } = this.props;
    let keyInputMessage = "Enter User key";

    if (this.state.newAssistantKey) {
      if (newAssistant) {
        keyInputMessage = newAssistant.displayName;
      } else {
        keyInputMessage = "Assistant not found";
      }
    }

    return (
      <Dialog onClose={onClose} open={open}>
        <DialogTitle>Control Assistants</DialogTitle>
        <DialogContent>
          <TextField
            helperText={keyInputMessage}
            label="New Assistant Key"
            onChange={this.onKeyChange}
            style={{
              width: 240,
              marginRight: 8,
              marginBottom: 8,
              top: 4
            }}
          />
          <Button
            disabled={!newAssistant}
            onClick={() => onAddAssistant(target, newAssistant.id)}
            variant="raised"
          >
            Add
          </Button>
          <List
            style={{
              maxHeight: 320,
              overflow: "auto"
            }}
          >
            {assistants ? (
              assistants.map(assistant => (
                <ListItem key={assistant.id}>
                  <ListItemIcon>
                    <Avatar src={assistant.photoURL || ""} />
                  </ListItemIcon>
                  <ListItemText primary={assistant.displayName || ""} />
                  <ListItemSecondaryAction>
                    <IconButton
                      onClick={() => onRemoveAssistant(target, assistant.id)}
                    >
                      <DeleteIcon />
                    </IconButton>
                  </ListItemSecondaryAction>
                </ListItem>
              ))
            ) : (
              <LinearProgress />
            )}
          </List>
        </DialogContent>
        <DialogActions>
          <Button color="primary" onClick={onClose} variant="raised">
            Commit
          </Button>
        </DialogActions>
      </Dialog>
    );
  }
}

export default ControlAssistantsDialog;
