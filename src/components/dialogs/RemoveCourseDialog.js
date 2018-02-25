/**
 * @file DeleteCourseDialog container module
 * @author Theodor Shaytanov <theodor.shaytanov@gmail.com>
 * @created 11.02.18
 */

import Button from "material-ui/Button";
import Dialog, {
  DialogActions,
  DialogContent,
  DialogTitle
} from "material-ui/Dialog/index";
import PropTypes from "prop-types";
import React from "react";
import Typography from "material-ui/Typography";

class RemoveCourseDialog extends React.PureComponent {
  static propTypes = {
    open: PropTypes.bool.isRequired,
    course: PropTypes.any,
    onClose: PropTypes.func.isRequired,
    onCommit: PropTypes.func.isRequired
  };

  render() {
    const { open, course, onClose, onCommit } = this.props;
    return (
      <Dialog onClose={onClose} open={open}>
        <DialogTitle>Confirmation</DialogTitle>
        <DialogContent>
          <Typography>{`This action will delete the course "${course &&
            course.name}". Are you sure?`}</Typography>
        </DialogContent>
        <DialogActions>
          <Button color="primary" onClick={onClose}>
            Cancel
          </Button>
          <Button
            color="secondary"
            onClick={() => onCommit(course)}
            variant="raised"
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    );
  }
}

export default RemoveCourseDialog;
