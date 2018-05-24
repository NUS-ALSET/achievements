/**
 * @file ContorlAssistantsDialog container module
 * @author Theodor Shaytanov <theodor.shaytanov@gmail.com>
 * @created 24.02.18
 */

import React from "react";
import PropTypes from "prop-types";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogTitle from "@material-ui/core/DialogTitle";
import Button from "@material-ui/core/Button";
import IconButton from "@material-ui/core/IconButton";
import TextField from "@material-ui/core/TextField";
import List, {
  ListItem,
  ListItemText,
  ListItemIcon,
  ListItemSecondaryAction
} from "@material-ui/core/List";
import Avatar from "@material-ui/core/Avatar";

import DeleteIcon from "@material-ui/icons/Delete";

import {
  assignmentAddAssistantRequest,
  assignmentAssistantKeyChange,
  assignmentCloseDialog,
  assignmentRemoveAssistantRequest
} from "../../containers/Assignments/actions";
import { notificationShow } from "../../containers/Root/actions";

class ControlAssistantsDialog extends React.PureComponent {
  static propTypes = {
    assistants: PropTypes.array,
    newAssistant: PropTypes.any,
    dispatch: PropTypes.func.isRequired,
    open: PropTypes.bool.isRequired,
    course: PropTypes.object
  };

  state = {
    newAssistantKey: ""
  };

  onClose = () => {
    this.props.dispatch(assignmentCloseDialog());
  };

  addAssistant = () =>
    this.props.dispatch(
      this.props.newAssistant
        ? assignmentAddAssistantRequest(
            this.props.course.id,
            this.props.newAssistant.id
          )
        : notificationShow("Missing Assistant to add")
    );

  removeAssistant = assistantId =>
    this.props.dispatch(
      assignmentRemoveAssistantRequest(this.props.course.id, assistantId)
    );

  onKeyChange = e => {
    this.setState({
      newAssistantKey: e.target.value
    });
    this.props.dispatch(assignmentAssistantKeyChange(e.target.value));
  };

  render() {
    const { open, assistants, newAssistant } = this.props;
    let keyInputMessage = "Enter User key";

    if (this.state.newAssistantKey) {
      if (newAssistant) {
        keyInputMessage = newAssistant.displayName;
      } else {
        keyInputMessage = "Assistant not found";
      }
    }

    return (
      <Dialog onClose={this.onClose} open={open}>
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
            onClick={this.addAssistant}
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
            {assistants.map(assistant => (
              <ListItem key={assistant.id}>
                <ListItemIcon>
                  <Avatar src={assistant.photoURL} />
                </ListItemIcon>
                <ListItemText primary={assistant.displayName} />
                <ListItemSecondaryAction>
                  <IconButton
                    onClick={() => this.removeAssistant(assistant.id)}
                  >
                    <DeleteIcon />
                  </IconButton>
                </ListItemSecondaryAction>
              </ListItem>
            ))}
          </List>
        </DialogContent>
        <DialogActions>
          <Button color="primary" variant="raised">
            Commit
          </Button>
        </DialogActions>
      </Dialog>
    );
  }
}

export default ControlAssistantsDialog;
