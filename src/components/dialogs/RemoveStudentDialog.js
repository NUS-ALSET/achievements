/**
 * @file RemoveStudentDialog container module
 * @author Theodor Shaytanov <theodor.shaytanov@gmail.com>
 * @created 28.02.18
 */

import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogTitle from "@material-ui/core/DialogTitle";
import PropTypes from "prop-types";
import React from "react";
import Typography from "@material-ui/core/Typography";


class RemoveStudentDialog extends React.PureComponent {
  static propTypes = {
    courseId: PropTypes.any,
    courseMemberId: PropTypes.any,
    courseMemberName: PropTypes.any,
    open: PropTypes.bool.isRequired,
    handleCloseDialog: PropTypes.func,
    handleRemoveStudentRequest: PropTypes.func
  };

  onClose = () => this.props.handleCloseDialog();

  onCommit = () =>
    this.props.handleRemoveStudentRequest(
      this.props.courseId, this.props.courseMemberId
    );

  render() {
    const { courseMemberName, open } = this.props;

    return (
      <Dialog onClose={this.onClose} open={open}>
        <DialogTitle>Confirmation</DialogTitle>
        <DialogContent>
          <Typography>
            {"This action will remove the student " +
              `${courseMemberName} from the course. Are you sure?`}
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button color="primary" onClick={this.onClose}>
            Cancel
          </Button>
          <Button color="secondary" onClick={this.onCommit} variant="contained">
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    );
  }
}

export default RemoveStudentDialog;
