/**
 * @file DeleteAssignmentConfirmationDialog container module
 * @author Theodor Shaytanov <theodor.shaytanov@gmail.com>
 * @created 08.02.18
 */

import { coursesService } from "../../services/courses";
import Button from "@material-ui/core/Button";

import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogTitle from "@material-ui/core/DialogTitle";
import PropTypes from "prop-types";
import React from "react";
import Typography from "@material-ui/core/Typography";

class DeleteAssignmentDialog extends React.PureComponent {
  static propTypes = {
    assignment: PropTypes.any.isRequired,
    courseId: PropTypes.string.isRequired,
    open: PropTypes.bool.isRequired,
    onClose: PropTypes.func.isRequired
  };

  onCommitClick = () => {
    const { courseId, assignment, onClose } = this.props;
    coursesService.removeAssignment(courseId, assignment.id).then(onClose);
  };

  render() {
    const { assignment, onClose } = this.props;

    return (
      <Dialog onClose={onClose} open={this.props.open}>
        <DialogTitle>Confirmation</DialogTitle>
        <DialogContent>
          <Typography>{`This action will delete the assignment "${
            assignment.name
          }". Are you sure?`}</Typography>
        </DialogContent>
        <DialogActions>
          <Button color="primary" onClick={onClose}>
            Cancel
          </Button>
          <Button
            color="secondary"
            onClick={this.onCommitClick}
            variant="contained"
          >
            Commit
          </Button>
        </DialogActions>
      </Dialog>
    );
  }
}

export default DeleteAssignmentDialog;
