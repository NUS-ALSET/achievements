/**
 * @file DeleteCourseDialog container module
 * @author Theodor Shaytanov <theodor.shaytanov@gmail.com>
 * @created 11.02.18
 */

import React from "react";
import PropTypes from "prop-types";
import Dialog, {
  DialogActions,
  DialogContent,
  DialogTitle
} from "material-ui/Dialog/index";
import Typography from "material-ui/Typography";
import Button from "material-ui/Button";

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
      <Dialog open={open} onClose={onClose}>
        <DialogTitle>Confirmation</DialogTitle>
        <DialogContent>
          <Typography>{`This action will delete the course "${course &&
            course.name}". Are you sure?`}</Typography>
        </DialogContent>
        <DialogActions>
          <Button color="primary" onClick={onClose}>
            Cancel
          </Button>
          <Button raised color="secondary" onClick={() => onCommit(course)}>
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    );
  }
}

export default RemoveCourseDialog;
