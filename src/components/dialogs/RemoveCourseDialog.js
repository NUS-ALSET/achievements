/**
 * @file DeleteCourseDialog container module
 * @author Theodor Shaytanov <theodor.shaytanov@gmail.com>
 * @created 11.02.18
 */

import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogTitle from "@material-ui/core/DialogTitle";
import PropTypes from "prop-types";
import React from "react";
import Typography from "@material-ui/core/Typography";

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
            variant="contained"
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    );
  }
}

export default RemoveCourseDialog;
