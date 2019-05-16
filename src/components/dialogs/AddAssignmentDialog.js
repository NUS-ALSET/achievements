/**
 * @file AddAssignmentDialog container module
 * @author Theodor Shaytanov <theodor.shaytanov@gmail.com>
 * @created 28.01.18
 */

import PropTypes from "prop-types";
import React, { Fragment } from "react";

import Button from "@material-ui/core/Button";
import Checkbox from "@material-ui/core/Checkbox";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogTitle from "@material-ui/core/DialogTitle";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import MenuItem from "@material-ui/core/MenuItem";
import TextField from "@material-ui/core/TextField";

import {
  ENABLED_ASSIGNMENTS_TYPES,
  ASSIGNMENTS_TYPES
} from "../../services/courses";
import {
  assignmentAddRequest,
  assignmentCloseDialog,
  updateNewAssignmentField
} from "../../containers/Assignments/actions";
import { courseInfo, entityInfo } from "../../types/index";

// RegExp rules
import { AddName, NoStartWhiteSpace } from "../regexp-rules/RegExpRules";
import PathsSelector from "../selectors/PathsSelector";

class AddAssignmentDialog extends React.PureComponent {
  static propTypes = {
    uid: PropTypes.any,
    course: courseInfo,
    assignment: PropTypes.any,
    dispatch: PropTypes.func.isRequired,
    open: PropTypes.bool.isRequired,
    paths: PropTypes.shape({
      myPaths: PropTypes.object,
      publicPaths: PropTypes.object
    }),
    activities: PropTypes.arrayOf(entityInfo).isRequired,
    fieldAutoUpdated: PropTypes.bool
  };

  state = {
    // Name of Assignment cannot be nonsense or empty spaces
    isCorrectInput_Name: false,
    enableCommitBtn: true
  };

  updateField = field => e => {
    // when update assignment
    if (this.props.assignment && this.props.assignment.id) {
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
    this.props.dispatch(updateNewAssignmentField(field, e.target.value));
  };

  onClose = () => this.props.dispatch(assignmentCloseDialog());

  onCommit = () => {
    const { course, dispatch, assignment } = this.props;
    dispatch(assignmentAddRequest(course.id, assignment));
    this.setState({
      isCorrectInput_Name: true
    });
  };

  componentDidUpdate(prevProps) {
    const { open, assignment, fieldAutoUpdated } = this.props;
    if (!prevProps.open && open && assignment && assignment.questionType) {
      this.updateField("questionType")({
        target: { value: assignment.questionType }
      });
    }
    if (open !== prevProps.open) {
      if (!open) {
        this.setState({
          isCorrectInput_Name: false
        });
      }
    }
    if (fieldAutoUpdated !== prevProps.fieldAutoUpdated) {
      if (fieldAutoUpdated) {
        this.setState({
          isCorrectInput_Name: true
        });
      }
    }
    if (
      assignment &&
      assignment.name &&
      NoStartWhiteSpace.test(assignment.name) &&
      prevProps.assignment.name !== assignment.name
    ) {
      this.updateField("name")({ target: { value: assignment.name } });
    }
    if (
      this.props.assignment &&
      ["PathProgress", "PathActivity"].includes(
        this.props.assignment.questionType
      )
    ) {
      const enableCommitBtn = Boolean(
        this.props.assignment.path && this.props.assignment.name
      );
      if (enableCommitBtn !== this.state.enableCommitBtn) {
        this.setState(() => ({
          enableCommitBtn: enableCommitBtn
        }));
      }
    } else if (!this.state.enableCommitBtn) {
      this.setState(() => ({
        enableCommitBtn: true
      }));
    }
  }

  /**
   * Returns list of assignments with requested team formation
   * @param {String} teamFormation
   * @returns {Array<Assignement>}
   */
  getTeamSourceAssignments(teamFormation) {
    const { course } = this.props;
    if (!teamFormation) {
      return [];
    }
    return course.assignments.filter(assignment =>
      [ASSIGNMENTS_TYPES.Text.id, ASSIGNMENTS_TYPES.TeamText.id].includes(
        assignment.questionType
      )
    );
  }

  getAssignmentSpecificFields(assignment) {
    let { activities, paths, uid } = this.props;

    switch (assignment.questionType) {
      case ENABLED_ASSIGNMENTS_TYPES.PathActivity.id:
        /*
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

 */
        return (
          <Fragment>
            <PathsSelector
              allowMultiple={false}
              onChange={this.updateField("path")}
              paths={paths}
              value={assignment.path || uid}
            />
            <TextField
              fullWidth
              label="Activity"
              onChange={this.updateField("pathActivity")}
              select
              value={assignment.pathActivity || assignment.problem || " "}
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
              label={
                "If students have submitted solution to this path activity " +
                "before auto-fill with their previous answer"
              }
            />
          </Fragment>
        );
      case ENABLED_ASSIGNMENTS_TYPES.TeamChoice.id:
        return (
          <TextField
            disabled={!assignment.teamFormation}
            fullWidth
            label="Options source"
            onChange={this.updateField("source")}
            select
            value={assignment.source || ""}
          >
            {this.getTeamSourceAssignments(assignment.teamFormation).map(
              source => (
                <MenuItem key={source.id} value={source.id}>
                  {source.name}
                </MenuItem>
              )
            )}
          </TextField>
        );
      case ENABLED_ASSIGNMENTS_TYPES.PathProgress.id:
        return (
          <PathsSelector
            allowMultiple={false}
            onChange={this.updateField("path")}
            paths={paths}
            value={assignment.path}
          />
        );
      default:
    }
  }

  render() {
    let { assignment, course, open } = this.props;
    const teamFormations = course.assignments.filter(
      assignment =>
        assignment.questionType === ENABLED_ASSIGNMENTS_TYPES.TeamFormation.id
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
            {Object.keys(ENABLED_ASSIGNMENTS_TYPES).map(key => (
              <MenuItem key={key} value={key}>
                {ENABLED_ASSIGNMENTS_TYPES[key].caption}
              </MenuItem>
            ))}
          </TextField>
          <TextField
            error={!this.state.isCorrectInput_Name}
            fullWidth
            helperText={
              this.state.isCorrectInput_Name
                ? ""
                : "Name cannot be empty or too long or have invalid characters"
            }
            label="Name"
            margin="normal"
            onChange={this.updateField("name")}
            required
            value={assignment.name || ""}
          />
          <TextField
            fullWidth
            helperText="link to resources (if needed)"
            label="Link"
            margin="normal"
            onChange={this.updateField("details")}
            placeholder="start with http:// or https://"
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
              !this.state.isCorrectInput_Name || !this.state.enableCommitBtn
            }
            onClick={this.onCommit}
            variant="contained"
          >
            Commit
          </Button>
        </DialogActions>
      </Dialog>
    );
  }
}

export default AddAssignmentDialog;
