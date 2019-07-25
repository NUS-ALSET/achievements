/**
 * @file Add Custom Analysis Dialog Component
 * @author Aishwarya Lakshminarasimhan <aishwaryarln@gmail.com>
 * @created 02.07.18
 */

import * as React from "react";
import PropTypes from "prop-types";

// RegExp rules
import { AddName, NoStartWhiteSpace } from "../regexp-rules/RegExpRules";

import { APP_SETTING } from "../../achievementsApp/config";

// Import components
import FirebaseQueryTable from "../tables/FirebaseQueryTable";
import FirestoreQueryTable from "../tables/FirestoreQueryTable";

// Import MaterialUI components
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

class AddAdminCustomQueryDialog extends React.PureComponent {
  constructor(props) {
    super(props);
    this.steps = this.getSteps();
    this.firebaseQueryHandler = this.firebaseQueryHandler.bind(this);
    this.firestoreQueryHandler = this.firestoreQueryHandler.bind(this);
  }
  static propTypes = {
    classes: PropTypes.object,
    addCustomQueryHandler: PropTypes.func
  };
  state = {
    activeStep: 0,
    skipped: new Set(),
    open: false,
    name: "",
    isCorrectInput: false,
    type: "Firebase",
    query: {
      name: "",
      query: {
        firebase: {
          ref: "",
          orderByChild: "",
          equalTo: "",
          limitToFirst: "",
          limitToLast: ""
        }
      },
      firestore: {
        collection: "",
        doc: "",
        where: { 0: { whereTest: "", whereCondition: "", whereTestValue: "" } },
        orderBy: "",
        orderByDirection: "",
        limit: ""
      }
    }
  };
  getSteps = () => {
    return ["Select Database Type", "Create your query"];
  };

  getStepContent = step => {
    let { classes } = this.props;
    switch (step) {
      case 0:
        return (
          <div className={classes.analysisTypeSelection}>
            <Typography className={classes.instructions}>
              Select your Database Type
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
                  value="Firebase"
                  control={<Radio />}
                  label="Firebase"
                />

                <FormControlLabel
                  value="Firestore"
                  control={<Radio />}
                  label="Firestore"
                />
              </RadioGroup>
            </FormControl>
          </div>
        );
      case 1:
        if (this.state.type === "Firebase") {
          return (
            <div>
              <Typography className={classes.instructions}>
                Fill in values for your firebase realtime-database query.
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
                label="Query Name"
                margin="dense"
                onChange={e => this.onFieldChange("name", e.target.value)}
                required
                value={this.state.name || ""}
              />
              <FirebaseQueryTable
                classes={this.props.classes}
                firebaseQueryHandler={this.firebaseQueryHandler}
              />
            </div>
          );
        } else {
          return (
            <div>
              <Typography className={classes.instructions}>
                Fill in values for your cloud firestore query.
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
                label="Query Name"
                margin="dense"
                onChange={e => this.onFieldChange("name", e.target.value)}
                required
                value={this.state.name || ""}
              />
              <FirestoreQueryTable
                classes={this.props.classes}
                firestoreQueryHandler={this.firestoreQueryHandler}
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
    this.props.addCustomQueryHandler(this.state.type, this.state.query);
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
      this.state.name &&
      this.state.isCorrectInput &&
      ((this.state.query.query.firebase &&
        this.state.query.query.firebase.ref) ||
        (this.state.query.query.firestore &&
          this.state.query.query.firestore.collection))
    ) {
      return false;
    } else {
      return true;
    }
  };

  parseValue(v) {
    if (v === "") {
      return undefined;
    }

    if (/^"(.*)"$/.test(v)) {
      return v.substring(1, v.length - 1);
    } else if (/^-?[0-9]+$/.test(v)) {
      return parseInt(v, 10);
    }
    switch (v) {
      case "true":
        return true;
      case "false":
        return false;
      case "null":
        return null;
      default:
        return v;
    }
  }

  firebaseQueryHandler(data) {
    let parsedData = {
      firebase: {
        ref: "",
        orderByChild: "",
        equalTo: "",
        limitToFirst: "",
        limitToLast: ""
      }
    };

    Object.keys(data.firebase).forEach(option => {
      let value = this.parseValue(data.firebase[option]);

      switch (option) {
        case "limitToFirst":
          value =
            value > APP_SETTING.ADMIN_ANALYSIS_LIMIT
              ? APP_SETTING.ADMIN_ANALYSIS_LIMIT
              : value;
          break;
        case "limitToLast":
          value = value
            ? value > APP_SETTING.ADMIN_ANALYSIS_LIMIT
              ? APP_SETTING.ADMIN_ANALYSIS_LIMIT
              : value
            : this.parseValue(data.firebase["limitToFirst"])
            ? value
            : APP_SETTING.ADMIN_ANALYSIS_LIMIT;
          break;
        default:
          break;
      }
      parsedData.firebase[option] = value;
    });
    this.setState({
      ...this.state,
      query: { name: this.state.name, query: parsedData }
    });
  }

  firestoreQueryHandler(data) {
    let parsedData = {
      firestore: {
        collection: "",
        doc: "",
        where: { 0: { whereTest: "", whereCondition: "", whereTestValue: "" } },
        orderBy: "",
        orderByDirection: "",
        limit: ""
      }
    };
    Object.keys(data.firestore).forEach(option => {
      let value = this.parseValue(data.firestore[option]);
      switch (option) {
        case "limit":
          value = value
            ? value > APP_SETTING.ADMIN_ANALYSIS_LIMIT
              ? APP_SETTING.ADMIN_ANALYSIS_LIMIT
              : value
            : APP_SETTING.ADMIN_ANALYSIS_LIMIT;
          break;

        case "where":
          Object.keys(value).forEach(whereNumber => {
            Object.keys(value[whereNumber]).forEach(whereOption => {
              value[whereNumber][whereOption] = this.parseValue(
                value[whereNumber][whereOption]
              );
            });
          });
          break;
        default:
          break;
      }
      parsedData.firestore[option] = value;
    });
    this.setState({
      ...this.state,
      query: { name: this.state.name, query: parsedData }
    });
  }

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
            Add Custom Query
          </Button>
          <Dialog
            open={this.state.open}
            onClose={this.handleClose}
            aria-labelledby="form-dialog-title"
          >
            <DialogTitle id="form-dialog-title">Add Custom Query</DialogTitle>
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
export default AddAdminCustomQueryDialog;
