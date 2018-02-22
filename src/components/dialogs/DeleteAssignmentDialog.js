/**
 * @file DeleteAssignmentConfirmationDialog container module
 * @author Theodor Shaytanov <theodor.shaytanov@gmail.com>
 * @created 08.02.18
 */

import { coursesService } from "../../services/courses";
import Button from "material-ui/Button";

import Dialog, {
  DialogActions,
  DialogContent,
  DialogTitle
} from "material-ui/Dialog/index";
import PropTypes from "prop-types";
import React from "react";
import Typography from "material-ui/Typography";

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
      <Dialog open={this.props.open}  onClose={onClose}>
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
          <Button raised color="secondary" onClick={this.onCommitClick}>
            Commit
          </Button>
        </DialogActions>
      </Dialog>
    );
  }
}

export default DeleteAssignmentDialog;
