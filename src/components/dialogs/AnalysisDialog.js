import React from "react";

import { firebaseConnect, isLoaded } from "react-redux-firebase";
import { compose } from "redux";
import { connect } from "react-redux";

import PropTypes from "prop-types";
import { withStyles } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";

import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogTitle from "@material-ui/core/DialogTitle";
import Button from "@material-ui/core/Button";
import Divider from "@material-ui/core/Divider";

import Skills from "../lists/Skills";

const styles = {
  root: {
    flexGrow: 1
  },
  message: {
    margin: "10px auto",
    width: "100%"
  }
};

const AnalysisDialog = props => {
  const { classes, open, handleClose, name, activityId, solution } = props;
  const finalSkills = solution.skills || {};
  const title = "Jupyter Activity Analysis " + (name ? `for ${name}` : "");
  return (
    <Dialog
      aria-describedby="alert-dialog-description"
      aria-labelledby="alert-dialog-title"
      maxWidth={"md"}
      onClose={handleClose}
      open={open}
    >
      <DialogTitle id="alert-dialog-title">{title}</DialogTitle>
      <Divider />
      <DialogContent>
        {solution.solutionURL && (
          <Typography variant="subtitle1">
            Solution URL :{" "}
            <a href={solution.solutionURL} target="__blank">
              {solution.solutionURL}
            </a>
          </Typography>
        )}
        {activityId &&
          isLoaded(solution) &&
          Object.keys(finalSkills).length === 0 && (
            <Typography className={classes.message} variant="subtitle1">
              {solution.errorMsg
                ? `Code Analysis Error : ${solution.errorMsg}`
                : "Not Analysied yet!"}
            </Typography>
          )}
        <div className={classes.root}>
          <Skills skills={finalSkills} />
        </div>
      </DialogContent>
      <DialogActions>
        <Button autoFocus color="primary" onClick={handleClose}>
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
};

AnalysisDialog.propTypes = {
  classes: PropTypes.object.isRequired,
  handleClose: PropTypes.func.isRequired,
  open: PropTypes.bool.isRequired,
  name: PropTypes.string,
  activityId: PropTypes.string
};

const mapStateToProps = (state, ownProps) => {
  const activityExampleSolutions =
    (state.firebase.data.activityExampleSolutions || {})[ownProps.activityId] ||
    {};
  return {
    solution: activityExampleSolutions
  };
};

export default compose(
  withStyles(styles),
  firebaseConnect((ownProps, store) => {
    if (!ownProps.activityId) {
      return false;
    }
    return [`/activityExampleSolutions/${ownProps.activityId}`];
  }),
  connect(mapStateToProps)
)(AnalysisDialog);
