/**
 * @file Modify Custom Analysis Dialog Component
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
import DialogTitle from "@material-ui/core/DialogTitle";
import UpdateIcon from "@material-ui/icons/Update";
import Stepper from "@material-ui/core/Stepper";
import Step from "@material-ui/core/Step";
import StepLabel from "@material-ui/core/StepLabel";
import Typography from "@material-ui/core/Typography";
import Radio from "@material-ui/core/Radio";
import RadioGroup from "@material-ui/core/RadioGroup";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import FormControl from "@material-ui/core/FormControl";

class ModifyCustomAnalysisDialog extends React.PureComponent {
  constructor(props) {
    super(props);
    this.steps = this.getSteps();
  }
  static propTypes = {
    classes: PropTypes.object,
    myAnalysis: PropTypes.object,
    updateCustomAnalysisHandler: PropTypes.func,
    deleteCustomAnalysisHandler: PropTypes.func
  };
  state = {
    activeStep: 0,
    skipped: new Set(),
    open: false,
    name: "",
    type: "Update",
    analysisID: null
  };

  getSteps = () => {
    return ["Update Custom Analysis", "Delete Custom Analysis"];
  };

  getStepContent = step => {
    let { classes, myAnalysis } = this.props;
    switch (step) {
      case 0:
        return (
          <div className={classes.analysisTypeSelection}>
            <Typography className={classes.instructions}>
              Select your modification type
            </Typography>
            <FormControl component="fieldset" className={classes.formControl}>
              <RadioGroup
                aria-label="Type"
                name="type1"
                className={classes.group}
                value={this.state.type}
                onChange={this.handleChange}
              >
                <FormControlLabel
                  value="Update"
                  control={<Radio />}
                  label="Update Custom Analysis"
                />

                <FormControlLabel
                  value="Delete"
                  control={<Radio />}
                  label="Delete Custom Analysis"
                />
              </RadioGroup>
            </FormControl>
          </div>
        );
      case 1:
        if (this.state.type === "Update") {
          return (
            <div>
              <Typography className={classes.instructions}>
                Select the custom analysis notebook you wish to update.
              </Typography>
              <CustomAnalysisMenu
                classes={classes}
                listHandler={this.selectHandler}
                type={this.state.type}
                listType={"Analysis"}
                menuContent={myAnalysis}
              />
            </div>
          );
        } else if (this.state.type === "Delete") {
          return (
            <div>
              <Typography className={classes.instructions}>
                Select the custom analysis notebook you wish to delete.
              </Typography>
              <CustomAnalysisMenu
                classes={classes}
                listHandler={this.selectHandler}
                type={this.state.type}
                listType={"Analysis"}
                menuContent={myAnalysis}
              />
            </div>
          );
        } else {
          return <div>Unknown type selected</div>;
        }

      default:
        return "Unknown step";
    }
  };

  handleChange = event => {
    this.setType(event.target.value);
  };

  setType = type => {
    this.setState({ ...this.state, type: type });
  };

  isStepOptional = step => {
    return false;
  };

  isStepSkipped = step => {
    return this.state.skipped.has(step);
  };

  setSkipped(skipped) {
    this.setState({
      skipped: new Set(this.state.skipped).add(skipped)
    });
  }

  setActiveStep = activeStep => {
    this.setState({ activeStep: activeStep });
  };

  handleNext = () => {
    let newSkipped = this.state.skipped;
    if (this.isStepSkipped(this.state.activeStep)) {
      newSkipped = new Set(newSkipped.values());
      newSkipped.delete(this.state.activeStep);
    }
    this.setActiveStep(this.state.activeStep + 1);
    this.setSkipped(newSkipped);
  };

  handleBack = () => {
    this.setActiveStep(this.state.activeStep - 1);
  };

  handleSkip = () => {
    if (!this.isStepOptional(this.state.activeStep)) {
      throw new Error("You can't skip a step that isn't optional.");
    }

    this.setActiveStep(this.state.activeStep + 1);
    this.setSkipped(prevSkipped => {
      const newSkipped = new Set(prevSkipped.values());
      newSkipped.add(this.state.activeStep);
      return newSkipped;
    });
  };

  handleReset = () => {
    this.setActiveStep(0);
  };

  handleClickOpen = () => this.setOpen(true);

  handleClose = () => this.setOpen(false);

  setOpen = open => this.setState({ open: open });

  handleCommit = () => {
    this.props.updateCustomAnalysisHandler(this.state.analysisID);
    this.handleClose();
  };

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
    const { classes } = this.props;
    return (
      <div className={classes.root}>
        <div>
          <Button
            variant="outlined"
            color="primary"
            onClick={this.handleClickOpen}
          >
            <UpdateIcon className={classes.updateIcon} />
            Update/Delete Custom Analysis&nbsp;&nbsp;&nbsp;&nbsp;
          </Button>
          <Dialog
            open={this.state.open}
            onClose={this.handleClose}
            aria-labelledby="form-dialog-title"
          >
            <DialogTitle id="form-dialog-title">
              Modify Custom Analysis
            </DialogTitle>
            <DialogContent>
              <Stepper activeStep={this.state.activeStep}>
                {this.steps.map((label, index) => {
                  const stepProps = {};
                  const labelProps = {};
                  if (this.isStepOptional(index)) {
                    labelProps.optional = (
                      <Typography variant="caption">Optional</Typography>
                    );
                  }
                  if (this.isStepSkipped(index)) {
                    stepProps.completed = false;
                  }
                  return (
                    <Step key={label} {...stepProps}>
                      <StepLabel {...labelProps}>{label}</StepLabel>
                    </Step>
                  );
                })}
              </Stepper>
              <div>
                {this.state.activeStep === this.steps.length ? (
                  <div>
                    <br />
                    <Typography className={classes.instructions}>
                      All steps completed - you&apos;re finished
                    </Typography>
                    <Button
                      onClick={this.handleReset}
                      className={classes.button}
                    >
                      Reset
                    </Button>
                  </div>
                ) : (
                  <div>
                    <div>{this.getStepContent(this.state.activeStep)}</div>
                    <div>
                      <br />
                      <Button
                        disabled={this.state.activeStep === 0}
                        onClick={this.handleBack}
                        className={classes.button}
                      >
                        Back
                      </Button>
                      {this.isStepOptional(this.state.activeStep) && (
                        <Button
                          variant="contained"
                          color="primary"
                          onClick={this.handleSkip}
                          className={classes.button}
                        >
                          Skip
                        </Button>
                      )}
                      &nbsp;
                      <Button
                        variant="contained"
                        color="primary"
                        onClick={this.handleNext}
                        className={classes.button}
                      >
                        {this.state.activeStep === this.steps.length - 1
                          ? "Finish"
                          : "Next"}
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            </DialogContent>
            <DialogActions>
              <Button color="secondary" onClick={this.handleClose}>
                Cancel
              </Button>
              {this.state.type === "Delete" ? (
                <Button
                  color="secondary"
                  onClick={this.handleDelete}
                  variant="contained"
                >
                  DELETE
                </Button>
              ) : (
                <Button
                  color="primary"
                  disabled={this.state.analysisID ? false : true}
                  onClick={this.handleCommit}
                  variant="contained"
                >
                  Commit
                </Button>
              )}
            </DialogActions>
          </Dialog>
        </div>
      </div>
    );
  }
}
export default ModifyCustomAnalysisDialog;
