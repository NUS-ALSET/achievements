import React from "react";
import PropTypes from "prop-types";
import { withStyles } from "@material-ui/core/styles";
import Dialog from "@material-ui/core/Dialog";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import IconButton from "@material-ui/core/IconButton";
import Typography from "@material-ui/core/Typography";
import CloseIcon from "@material-ui/icons/Close";
import Slide from "@material-ui/core/Slide";
import Message from "../../containers/Message/Message"

const styles = {
  appBar: {
    position: "relative"
  },
  flex: {
    flex: 1
  }
};

function Transition(props) {
  return <Slide direction="up" {...props} />;
}

class MessageDialog extends React.Component {
  render() {
    const { classes, open, handleClose, type, isInstructor, showStudents } = this.props;
    const dynamicProps = {
      type,
      [type === "course" ? "course" : "cohort"]: type === "course" ? this.props.course : this.props.cohort,
      isInstructor,
      showStudents
    }
    return (
      <div>
        <Dialog
          fullScreen
          onClose={handleClose}
          open={open}
          TransitionComponent={Transition}
        >
          <AppBar className={classes.appBar}>
            <Toolbar>
              <IconButton aria-label="Close" color="inherit" onClick={handleClose} >
                <CloseIcon />
              </IconButton>
              <Typography className={classes.flex} color="inherit" variant="h6" >
                {type === "course" ? "Course Chat" : "Cohort Chat"} -
                {type === "course" ? ` Course Name: ${this.props.course.name}` : ` Cohort Name: ${this.props.cohort.name}`}
              </Typography>
            </Toolbar>
          </AppBar>
          <Message {...dynamicProps} />
        </Dialog>
      </div>
    );
  }
}

MessageDialog.propTypes = {
  classes: PropTypes.object.isRequired,
  open: PropTypes.bool,
  handleClose: PropTypes.func,
  type: PropTypes.string,
  course: PropTypes.object,
  cohort: PropTypes.object,
  showStudents: PropTypes.bool
};

export default withStyles(styles)(MessageDialog);