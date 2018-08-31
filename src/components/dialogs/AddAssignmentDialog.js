/**
 * @file AddAssignmentDialog container module
 * @author Theodor Shaytanov <theodor.shaytanov@gmail.com>
 * @created 28.01.18
 */

import { APP_SETTING } from "../../achievementsApp/config";

import Button from "@material-ui/core/Button";
import Checkbox from "@material-ui/core/Checkbox";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogTitle from "@material-ui/core/DialogTitle";
import FormControl from "@material-ui/core/FormControl";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Input from "@material-ui/core/Input";
import InputLabel from "@material-ui/core/InputLabel";
import MenuItem from "@material-ui/core/MenuItem";
import PropTypes from "prop-types";
import React, { Fragment } from "react";
import Select from "@material-ui/core/Select";
import TextField from "@material-ui/core/TextField";
import { ASSIGNMENTS_TYPES } from "../../services/courses";
import {
  assignmentAddRequest,
  assignmentCloseDialog,
  updateNewAssignmentField
} from "../../containers/Assignments/actions";
import { courseInfo, entityInfo } from "../../types/index";

// RegExp rules
import { AddName, NoStartWhiteSpace } from "../regexp-rules/RegExpRules";

class AddAssignmentDialog extends React.PureComponent {
  static propTypes = {
    uid: PropTypes.any,
    course: courseInfo,
    assignment: PropTypes.any,
    dispatch: PropTypes.func.isRequired,
    open: PropTypes.bool.isRequired,
    paths: PropTypes.arrayOf(entityInfo).isRequired,
    activities: PropTypes.arrayOf(entityInfo).isRequired
  };

  state = {
    // Name of Assignment cannot be nonsense or empty spaces
    isCorrectInput_Name: false,
  };

  updateField = field => e => {
    // when update assignment
    if (!(typeof this.props.assignment === "undefined") &&
     this.props.assignment.id) {
      this.setState({
        isCorrectInput_Name: true
      });
    }
    if (field === "name") {
      if (
        AddName.test(e.target.value) &&
        NoStartWhiteSpace.test(e.target.value)
      ) {
        this.setState({
          isCorrectInput_Name: true
        });
      } else {
        this.setState({
          isCorrectInput_Name: false
        });
      }
    }
    this.props.dispatch(
      updateNewAssignmentField(field, e.target.value)
    );
  };

  onClose = () => this.props.dispatch(assignmentCloseDialog());

  onCommit = () => {
    const { course, dispatch, assignment } = this.props;
    dispatch(assignmentAddRequest(course.id, assignment));
    this.setState({
      isCorrectInput_Name: false
    });
  };

  componentWillReceiveProps(nextProps){
    if(!this.props.open && nextProps.open && nextProps.assignment && nextProps.assignment.questionType){
        this.updateField('questionType')({ target : { value : nextProps.assignment.questionType}});
    }
  }

  getAssignmentSpecificFields(assignment) {
    let { activities, paths, uid } = this.props;

    switch (assignment.questionType) {
      case ASSIGNMENTS_TYPES.CodeCombat.id:
        return (
          <FormControl fullWidth margin="normal">
            <InputLabel htmlFor="select-multiple-levels">Level</InputLabel>
            <Select
              input={<Input id="select-multiple-levels" />}
              margin="none"
              MenuProps={{
                PaperProps: {
                  style: {
                    maxHeight: 224,
                    width: 250
                  }
                }
              }}
              onChange={this.updateField("level")}
              value={assignment.level || ""}
            >
              {Object.keys(APP_SETTING.levels).map(id => (
                <MenuItem key={APP_SETTING.levels[id].name} value={id}>
                  {APP_SETTING.levels[id].name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        );
      case ASSIGNMENTS_TYPES.CodeCombat_Number.id:
        return (
          <TextField
            fullWidth
            label="Levels amount"
            margin="normal"
            onChange={this.updateField("count")}
            type="number"
            value={assignment.count}
          />
        );
      case ASSIGNMENTS_TYPES.PathActivity.id:
        return (
          <Fragment>
            <TextField
              fullWidth
              label="Path"
              onChange={this.updateField("path")}
              select
              value={assignment.path || uid}
            >
              <MenuItem value={uid}>Default</MenuItem>
              {paths.map(path => (
                <MenuItem key={path.id} value={path.id}>
                  {path.name}
                </MenuItem>
              ))}
            </TextField>
            <TextField
              fullWidth
              label="Activity"
              onChange={this.updateField("pathActivity")}
              select
              value={assignment.problem || ""}
            >
              {activities.map(activity => (
                <MenuItem key={activity.id} value={activity.id}>
                  {activity.name}
                </MenuItem>
              ))}
            </TextField>
            <FormControlLabel
              control={
                <Checkbox
                  checked={assignment.allowSolutionImport || false}
                  onChange={e =>
                    this.updateField("allowSolutionImport")({
                      target: {
                        value: e.target.checked
                      }
                    })
                  }
                  value="allowSolutionImport"
                />
              }
              label="Allow import existing path solution"
            />
          </Fragment>
        );
      case ASSIGNMENTS_TYPES.PathProgress.id:
        return (
          <TextField
            fullWidth
            label="Path"
            onChange={this.updateField("path")}
            select
            value={assignment.path || "default"}
          >
            <MenuItem value="default">Default</MenuItem>
            {paths.map(path => (
              <MenuItem key={path.id} value={path.id}>
                {path.name}
              </MenuItem>
            ))}
          </TextField>
        );
      default:
    }
  }

  render() {
    let { assignment, course, open } = this.props;
    const teamFormations = course.assignments.filter(
      assignment =>
        assignment.questionType === ASSIGNMENTS_TYPES.TeamFormation.id
    );

    assignment = assignment || {};

    return (
      <Dialog onClose={this.onClose} open={open}>
        <DialogTitle>
          {assignment.id ? "Edit Assignment" : "New Assignment"}
        </DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            fullWidth
            label="Type of question"
            margin="normal"
            onChange={this.updateField("questionType")}
            select
            value={assignment.questionType || ""}
          >
            {Object.keys(ASSIGNMENTS_TYPES).map(key => (
              <MenuItem key={key} value={key}>
                {ASSIGNMENTS_TYPES[key].caption}
              </MenuItem>
            ))}
          </TextField>
          <TextField
            error={!this.state.isCorrectInput_Name}
            helperText={this.state.isCorrectInput_Name
              ? ""
              : "Name cannot be empty or too long or have invalid characters"}
            fullWidth
            label="Name"
            margin="normal"
            onChange={this.updateField("name")}
            value={assignment.name || ""}
            required
          />
          <TextField
            fullWidth
            label="Link"
            helperText="link to external website (if needed)"
            placeholder="start with http:// or https://"
            margin="normal"
            onChange={this.updateField("details")}
            value={assignment.details || ""}
          />
          <br />
          <br />
          <FormControlLabel
            control={
              <Checkbox
                checked={assignment.useTeams || false}
                onChange={e =>
                  this.updateField("useTeams")({
                    target: {
                      value: e.target.checked
                    }
                  })
                }
                value="useTeams"
              />
            }
            disabled={!teamFormations.length}
            label="Use team formation"
          />
          <TextField
            disabled={!(teamFormations.length && assignment.useTeams)}
            fullWidth
            label="Team Formation Assignment"
            onChange={this.updateField("teamFormation")}
            select
            value={assignment.teamFormation || ""}
          >
            {teamFormations.map(assignment => (
              <MenuItem key={assignment.id} value={assignment.id}>
                {assignment.name}
              </MenuItem>
            ))}
          </TextField>
          <br />
          <br />
          {this.getAssignmentSpecificFields(assignment)}
          <TextField
            fullWidth
            InputLabelProps={{
              shrink: true
            }}
            label="Open"
            margin="normal"
            onChange={this.updateField("open")}
            type="datetime-local"
            value={assignment.open || ""}
          />
          <TextField
            fullWidth
            InputLabelProps={{
              shrink: true
            }}
            label="Deadline"
            margin="normal"
            onChange={this.updateField("deadline")}
            type="datetime-local"
            value={assignment.deadline || ""}
          />
        </DialogContent>
        <DialogActions>
          <Button color="secondary" onClick={this.onClose}>
            Cancel
          </Button>
          <Button
            color="primary"
            disabled={
              !this.state.isCorrectInput_Name
            }
            onClick={this.onCommit}
            variant="raised"
          >
            Commit
          </Button>
        </DialogActions>
      </Dialog>
    );
  }
}

export default AddAssignmentDialog;
