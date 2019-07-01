/**
 * @file Add Custom Analysis Dialog Component
 * @author Aishwarya Lakshminarasimhan <aishwaryarln@gmail.com>
 * @created 22.02.18
 */

import * as React from "react";
import PropTypes from "prop-types";

// RegExp rules
import { AddName, NoStartWhiteSpace } from "../regexp-rules/RegExpRules";

// images for user guide in the dialog
import JupyterNotebookStep1 from "../../assets/JupyterNotebookSampleActivityImg.png";

// Import MaterialUI components
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";
import AddIcon from "@material-ui/icons/Add";
import Typography from "@material-ui/core/Typography";

class AddCustomAnalysisDialog extends React.PureComponent {
  static propTypes = {
    classes: PropTypes.object,
    addCustomAnalysisHandler: PropTypes.func
  };
  state = {
    open: false,
    analysisURL: null,
    name: "",
    isCorrectInput: false
  };

  handleClickOpen = () => this.setOpen(true);

  handleClose = () => this.setOpen(false);

  setOpen = open => this.setState({ open: open });

  handleCommit = () => {
    this.props.addCustomAnalysisHandler(
      this.state.analysisURL,
      this.state.name
    );
    this.handleClose();
  };

  onFieldChange = (field, value) => {
    // validate name input
    if (field === "name") {
      if (AddName.test(value) && NoStartWhiteSpace.test(value)) {
        this.setState({
          isCorrectInput: true
        });
      } else {
        this.setState({
          isCorrectInput: false
        });
      }
    }
    this.setState({ [field]: value });
  };

  isIncorrect = () => {
    if (
      this.state.analysisURL &&
      this.state.name &&
      this.state.isCorrectInput
    ) {
      return false;
    } else {
      return true;
    }
  };

  render() {
    const { classes } = this.props;
    return (
      <div>
        <Button
          variant="outlined"
          color="primary"
          onClick={this.handleClickOpen}
        >
          <AddIcon className={classes.addIcon} />
          Add Custom Analysis
        </Button>
        <Dialog
          open={this.state.open}
          onClose={this.handleClose}
          aria-labelledby="form-dialog-title"
        >
          <DialogTitle id="form-dialog-title">Add Custom Analysis</DialogTitle>
          <DialogContent>
            <DialogContentText>
              To add your custom analysis function, please enter your public
              colaboratory notebook URL and the name of your analysis function
              below.
            </DialogContentText>
            <TextField
              autoFocus
              error={!this.state.isCorrectInput}
              fullWidth
              helperText={
                this.state.isCorrectInput
                  ? ""
                  : "Name should not be empty or too long or have invalid characters"
              }
              label="Name"
              margin="dense"
              onChange={e => this.onFieldChange("name", e.target.value)}
              required
              value={this.state.name || ""}
            />
            <Typography gutterBottom variant="body2">
              Get the Shareable Link from Google Colab/github commit ipynb
            </Typography>
            <img alt="JupyterNotebookStep1" src={JupyterNotebookStep1} />
            <a
              href="https://colab.research.google.com/drive/1Rx_oOoslo2bbT7CY6nXmWuwzJXootjzA"
              rel="noopener noreferrer"
              target="_blank"
            >
              <Typography align="center" gutterBottom variant="caption">
                Sample Google Colab ipynb Link
              </Typography>
            </a>
            <TextField
              defaultValue={this.state.analysisURL}
              fullWidth
              helperText="Make sure the ipynb's Link Sharing is on"
              label="Google Colab ipynb URL for this Activity"
              margin="dense"
              required
              onChange={e => this.onFieldChange("analysisURL", e.target.value)}
            />
          </DialogContent>
          <DialogActions>
            <Button color="secondary" onClick={this.handleClose}>
              Cancel
            </Button>
            <Button
              color="primary"
              disabled={this.isIncorrect()}
              onClick={this.handleCommit}
              variant="contained"
            >
              Commit
            </Button>
          </DialogActions>
        </Dialog>
      </div>
    );
  }
}
export default AddCustomAnalysisDialog;
