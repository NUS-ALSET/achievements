/**
 * @file Add Custom Analysis Dialog Component
 * @author Aishwarya Lakshminarasimhan <aishwaryarln@gmail.com>
 * @created 30.06.18
 */

import * as React from "react";
import PropTypes from "prop-types";

// RegExp rules
import { AddName, NoStartWhiteSpace } from "../regexp-rules/RegExpRules";

// images for user guide in the dialog
import JupyterNotebookStep1 from "../../assets/JupyterNotebookSampleActivityImg.png";

import Stepper from "@material-ui/core/Stepper";
import Step from "@material-ui/core/Step";
import StepLabel from "@material-ui/core/StepLabel";
import Button from "@material-ui/core/Button";
import Typography from "@material-ui/core/Typography";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogTitle from "@material-ui/core/DialogTitle";
import AddIcon from "@material-ui/icons/Add";
import Radio from "@material-ui/core/Radio";
import RadioGroup from "@material-ui/core/RadioGroup";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import FormControl from "@material-ui/core/FormControl";
import TextField from "@material-ui/core/TextField";

class AddCustomAnalysisDialog extends React.PureComponent {
  constructor(props) {
    super(props);
    this.steps = this.getSteps();
  }
  static propTypes = {
    classes: PropTypes.object,
    addCustomAnalysisHandler: PropTypes.func
  };
  state = {
    activeStep: 0,
    skipped: new Set(),
    open: false,
    analysisURL: null,
    name: "",
    isCorrectInput: false,
    type: "Jupyter"
  };
  getSteps = () => {
    return ["Select Analysis Type", "Enter Analysis Details"];
  };

  getStepContent = step => {
    let { classes } = this.props;
    switch (step) {
      case 0:
        return (
          <div className={classes.analysisTypeSelection}>
            <Typography className={classes.instructions}>
              Select your Analysis Type
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
                  value="Jupyter"
                  control={<Radio />}
                  label="Jupyter Notebook"
                />

                <FormControlLabel
                  value="Cloud Function"
                  control={<Radio />}
                  label="Cloud Function"
                />
              </RadioGroup>
            </FormControl>
          </div>
        );
      case 1:
        if (this.state.type === "Jupyter") {
          return (
            <div>
              <Typography className={classes.instructions}>
                To add your custom analysis function, please enter your public
                colaboratory notebook URL and the name of your analysis function
                below.
              </Typography>
              <TextField
                autoFocus
                error={!this.state.isCorrectInput}
                fullWidth
                helperText={
                  this.state.isCorrectInput
                    ? ""
                    : "Name should not be empty or too long or have invalid characters"
                }
                label="Name"
                margin="dense"
                onChange={e => this.onFieldChange("name", e.target.value)}
                required
                value={this.state.name || ""}
              />
              <Typography gutterBottom variant="body2">
                Get the Shareable Link from Google Colab/github commit ipynb
              </Typography>
              <img alt="JupyterNotebookStep1" src={JupyterNotebookStep1} />
              <a
                href="https://colab.research.google.com/drive/1Rx_oOoslo2bbT7CY6nXmWuwzJXootjzA"
                rel="noopener noreferrer"
                target="_blank"
              >
                <Typography align="center" gutterBottom variant="caption">
                  Sample Google Colab ipynb Link
                </Typography>
              </a>
              <TextField
                defaultValue={this.state.analysisURL}
                fullWidth
                helperText="Make sure the ipynb's Link Sharing is on"
                label="Google Colab ipynb URL for this Activity"
                margin="dense"
                required
                onChange={e =>
                  this.onFieldChange("analysisURL", e.target.value)
                }
              />
            </div>
          );
        } else {
          return (
            <div>
              <Typography className={classes.instructions}>
                Enter your Cloud Function details.
              </Typography>
              <TextField
                autoFocus
                error={!this.state.isCorrectInput}
                fullWidth
                helperText={
                  this.state.isCorrectInput
                    ? ""
                    : "Name should not be empty or too long or have invalid characters"
                }
                label="Name"
                margin="dense"
                onChange={e => this.onFieldChange("name", e.target.value)}
                required
                value={this.state.name || ""}
              />
              <TextField
                defaultValue={this.state.analysisURL}
                fullWidth
                label="Cloud Function URL"
                margin="dense"
                required
                onChange={e =>
                  this.onFieldChange("analysisURL", e.target.value)
                }
              />
            </div>
          );
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
    this.props.addCustomAnalysisHandler(
      this.state.analysisURL,
      this.state.name
    );
    this.handleClose();
  };

  onFieldChange = (field, value) => {
    // validate name input
    if (field === "name") {
      if (AddName.test(value) && NoStartWhiteSpace.test(value)) {
        this.setState({
          isCorrectInput: true
        });
      } else {
        this.setState({
          isCorrectInput: false
        });
      }
    }
    this.setState({ [field]: value });
  };

  isIncorrect = () => {
    if (
      this.state.analysisURL &&
      this.state.name &&
      this.state.isCorrectInput
    ) {
      return false;
    } else {
      return true;
    }
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
            <AddIcon className={classes.addIcon} />
            Add Custom Analysis&nbsp;&nbsp;&nbsp;&nbsp;
          </Button>
          <Dialog
            open={this.state.open}
            onClose={this.handleClose}
            aria-labelledby="form-dialog-title"
          >
            <DialogTitle id="form-dialog-title">
              Add Custom Analysis
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
              <Button
                color="primary"
                disabled={this.isIncorrect()}
                onClick={this.handleCommit}
                variant="contained"
              >
                Commit
              </Button>
            </DialogActions>
          </Dialog>
        </div>
      </div>
    );
  }
}
export default AddCustomAnalysisDialog;
