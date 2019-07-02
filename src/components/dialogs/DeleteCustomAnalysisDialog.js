/**
 * @file Delete Custom Analysis Dialog Component
 * @author Aishwarya Lakshminarasimhan <aishwaryarln@gmail.com>
 * @created 01.07.18
 */

import * as React from "react";
import PropTypes from "prop-types";

// Import components
import CustomAnalysisMenu from "../menus/CustomAnalysisMenu";

// Import MaterialUI components
import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";
import DeleteIcon from "@material-ui/icons/Delete";

class DeleteCustomAnalysisDialog extends React.PureComponent {
  static propTypes = {
    classes: PropTypes.object,
    myAnalysis: PropTypes.object,
    deleteCustomAnalysisHandler: PropTypes.func
  };
  state = {
    open: false,
    type: "Analysis",
    analysisID: null
  };

  handleClickOpen = () => this.setOpen(true);

  handleClose = () => this.setOpen(false);

  setOpen = open => this.setState({ open: open });

  selectHandler = (listType, listValue) => {
    switch (listType) {
      case "Analysis":
        this.setState({ analysisID: listValue.id });
        break;
      default:
        break;
    }
  };

  handleDelete = () => {
    this.props.deleteCustomAnalysisHandler(this.state.analysisID);
    this.handleClose();
  };

  render() {
    const { classes, myAnalysis } = this.props;
    return (
      <div>
        <Button
          variant="outlined"
          color="primary"
          onClick={this.handleClickOpen}
        >
          <DeleteIcon className={classes.deleteIcon} />
          Delete Custom Analysis
        </Button>
        <Dialog
          open={this.state.open}
          onClose={this.handleClose}
          aria-labelledby="form-dialog-title"
        >
          <DialogTitle id="form-dialog-title">
            Delete Custom Analysis
          </DialogTitle>
          <DialogContent>
            <DialogContentText>
              Select the custom Analysis to be deleted.
            </DialogContentText>
            <CustomAnalysisMenu
              classes={classes}
              listHandler={this.selectHandler}
              type={this.state.type}
              listType={"Analysis"}
              menuContent={myAnalysis}
            />
          </DialogContent>
          <DialogActions>
            <Button color="secondary" onClick={this.handleClose}>
              Cancel
            </Button>
            <Button
              color="secondary"
              onClick={this.handleDelete}
              variant="contained"
            >
              DELETE
            </Button>
          </DialogActions>
        </Dialog>
      </div>
    );
  }
}
export default DeleteCustomAnalysisDialog;
