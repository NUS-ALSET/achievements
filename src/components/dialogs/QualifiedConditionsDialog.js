import React from "react";
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogTitle from "@material-ui/core/DialogTitle";
import { connect } from "react-redux";
import { compose } from "redux";
import { firebaseConnect } from "react-redux-firebase";
import { withStyles } from "@material-ui/core/styles";
import FormControl from "@material-ui/core/FormControl/FormControl";
import InputLabel from "@material-ui/core/InputLabel/InputLabel";
import Select from "@material-ui/core/Select/Select";
import Input from "@material-ui/core/Input/Input";
import MenuItem from "@material-ui/core/MenuItem/MenuItem";
import Checkbox from "@material-ui/core/Checkbox/Checkbox";
import ListItemText from "@material-ui/core/ListItemText/ListItemText";
import Typography from "@material-ui/core/Typography";
import FormControlLabel from "@material-ui/core/FormControlLabel";

const ITEMS_HEIGHT = 216;
const ITEM_PADDING_TOP = 8;

const styles = () => ({
  pathSection: {
    backgroundColor: "aliceblue",
    padding: "20px",
    margin: "10px 0px"
  },
  pathInnerSection: {
    paddingLeft: "20px"
  }
});

export default class FormDialog extends React.PureComponent {
  state = {
    open: false,
    conditions: {}
  };
  componentDidUpdate() {
    if (
      this.props.qualifiedConditions &&
      Object.keys(this.state.conditions).length === 0
    ) {
      this.setState({ conditions: this.props.qualifiedConditions });
    }
  }
  handleConditionChange = (pathId, key, value) => {
    const newConditions = JSON.parse(JSON.stringify(this.state.conditions));
    newConditions[pathId] = newConditions[pathId] || {};
    newConditions[pathId][key] = value;
    this.setState({ conditions: newConditions });
  };

  cancelChanges = () => {
    this.setState({ conditions: this.props.qualifiedConditions });
    this.props.handleClose();
  };
  submitChanges = () => {
    const conditions = this.state.conditions;
    const optimizedConditions = {};
    for (let pathId in (conditions || {})) {
      const pathCondition = conditions[pathId];
      if (pathCondition.allActivities) {
        optimizedConditions[pathId] = {
          allActivities: true
        };
      } else {
        const activitiesToCompleteCount = Object.keys(
          pathCondition.activitiesToComplete || {}
        ).length;
        if (activitiesToCompleteCount > 0) {
          optimizedConditions[pathId] = {
            activitiesToComplete: pathCondition.activitiesToComplete
          };
        }
        if (
          pathCondition.numOfCompletedActivities > activitiesToCompleteCount
        ) {
          optimizedConditions[pathId] = optimizedConditions[pathId] || {};
          optimizedConditions[pathId].numOfCompletedActivities =
            pathCondition.numOfCompletedActivities;
        }
      }
    }
    this.props.saveChanges(optimizedConditions);
  };
  render() {
    const { open, pathsData = [], handleClose } = this.props;
    const { conditions } = this.state;
    return (
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="form-dialog-title"
      >
        <DialogTitle id="form-dialog-title">
          Add Qualified Conditons
        </DialogTitle>
        {open && (
          <DialogContent>
            {pathsData.map(path => (
              <Condition
                key={path.id}
                path={path}
                conditions={conditions[path.id]}
                handleChange={this.handleConditionChange}
              />
            ))}
          </DialogContent>
        )}

        <DialogActions>
          <Button onClick={this.cancelChanges} color="primary">
            Cancel
          </Button>
          <Button onClick={this.submitChanges} color="primary">
            Save Changes
          </Button>
        </DialogActions>
      </Dialog>
    );
  }
}

class PathCondition extends React.PureComponent {
  handleChange = (key, value) => {
    let data = value;
    if (key === "numOfCompletedActivities") {
      data = Math.min(data, this.props.path.totalActivities);
      data = Math.max(data,0);
    }
    if (key === "activitiesToComplete") {
      const activities = data.reduce((res, id) => {
        res[id] = {
          name: this.props.activities[id].name,
          type: this.props.activities[id].type
        };
        return res;
      }, {});
      data = activities;
    }
    this.props.handleChange(this.props.path.id, key, data);
  };

  render() {
    const { activities, path, classes, conditions = {} } = this.props;
    const {
      activitiesToComplete = {},
      numOfCompletedActivities = 0,
      allActivities = false
    } = conditions;

    return (
      <div className={classes.pathSection}>
        <Typography variant="h6" gutterBottom>
          {path.name}
        </Typography>
        <div className={classes.pathInnerSection}>
          <FormControlLabel
            control={
              <Checkbox
                checked={allActivities}
                onChange={e =>
                  this.handleChange("allActivities", e.target.checked)
                }
                value={String(allActivities)}
              />
            }
            label="Complete All Activities"
          />
          <TextField
            disabled={allActivities}
            margin="dense"
            id="name"
            label="Minimun number of activities to complete"
            type="number"
            fullWidth
            onChange={e =>
              this.handleChange("numOfCompletedActivities", e.target.value)
            }
            value={numOfCompletedActivities}
          />

          <FormControl disabled={allActivities} fullWidth>
            <InputLabel htmlFor="select-multiple-checkbox">
              Select Activities for Qualification
            </InputLabel>
            <Select
              input={<Input id="select-multiple-checkbox" />}
              MenuProps={{
                PaperProps: {
                  style: {
                    maxHeight: ITEMS_HEIGHT + ITEM_PADDING_TOP,
                    width: 250
                  }
                }
              }}
              multiple={true}
              onChange={e =>
                this.handleChange("activitiesToComplete", e.target.value)
              }
              renderValue={selected =>
                selected.map(id => (activities[id] || {}).name).join(", ")
              }
              value={Object.keys(activitiesToComplete)}
            >
              {Object.keys(activities).map(id => (
                <MenuItem key={id} value={id}>
                  <Checkbox checked={Boolean(activitiesToComplete[id])} />
                  <ListItemText primary={activities[id].name} />
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state, ownProps) => ({
  activities: state.firebase.data[`path-${ownProps.path.id}`] || {}
});

const Condition = compose(
  withStyles(styles),
  firebaseConnect((ownProps, store) => {
    return ownProps.path.id
      ? [
          {
            path: "/activities",
            storeAs: `path-${ownProps.path.id}`,
            queryParams: ["orderByChild=path", `equalTo=${ownProps.path.id}`]
          }
        ]
      : [];
  }),
  connect(mapStateToProps)
)(PathCondition);
