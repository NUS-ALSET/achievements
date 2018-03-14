/**
 * @file PathDialog container module
 * @author Theodor Shaytanov <theodor.shaytanov@gmail.com>
 * @created 01.03.18
 */

import React, { Fragment } from "react";
import PropTypes from "prop-types";

import Button from "material-ui/Button";
import Dialog, {
  DialogActions,
  DialogContent,
  DialogTitle
} from "material-ui/Dialog/index";
import {
  FormLabel,
  FormControl,
  FormGroup,
  FormControlLabel,
  FormHelperText
} from "material-ui/Form";
import Checkbox from "material-ui/Checkbox";
import MenuItem from "material-ui/Menu/MenuItem";
import TextField from "material-ui/TextField/TextField";

import {
  pathDialogHide,
  pathProblemChangeRequest
} from "../../containers/Paths/actions";
import { YOUTUBE_QUESTIONS } from "../../services/paths";

class ProblemDialog extends React.PureComponent {
  static propTypes = {
    dispatch: PropTypes.func.isRequired,
    pathId: PropTypes.string.isRequired,
    open: PropTypes.bool.isRequired,
    problem: PropTypes.object
  };

  state = {
    type: ""
  };

  getTypeSpecificElements() {
    switch (this.state.type) {
      case "jupyter":
        return (
          <Fragment>
            <TextField
              fullWidth
              label="Problem Notebook URL"
              margin="dense"
              onChange={e => this.onFieldChange("problemURL", e.target.value)}
              onKeyPress={this.catchReturn}
            />
            <TextField
              fullWidth
              label="Solution Notebook URL"
              margin="dense"
              onChange={e => this.onFieldChange("solutionURL", e.target.value)}
              onKeyPress={this.catchReturn}
            />
            <TextField
              fullWidth
              label="Number of frozen cells"
              margin="dense"
              onChange={e => this.onFieldChange("frozen", e.target.value)}
              onKeyPress={this.catchReturn}
              type="number"
            />
          </Fragment>
        );
      case "youtube":
        return (
          <Fragment>
            <TextField
              fullWidth
              label="YouTube URL"
              margin="dense"
              onChange={e => this.onFieldChange("youtubeURL", e.target.value)}
              onKeyPress={this.catchReturn}
            />
            <FormControl
              component="fieldset"
              style={{
                marginTop: 24
              }}
            >
              <FormLabel component="legend">Follow Up Questions</FormLabel>
              <FormHelperText>
                Assign Randomly from any one of the following questions
              </FormHelperText>

              <FormGroup>
                {Object.keys(YOUTUBE_QUESTIONS).map(questionType => (
                  <FormControlLabel
                    control={
                      <Checkbox
                        color="primary"
                        onChange={e =>
                          this.onFieldChange(questionType, e.target.checked)
                        }
                      />
                    }
                    key={questionType}
                    label={YOUTUBE_QUESTIONS[questionType]}
                  />
                ))}
              </FormGroup>
            </FormControl>
          </Fragment>
        );
      default:
    }
  }

  onFieldChange = (field, value) => this.setState({ [field]: value });

  onClose = () => this.props.dispatch(pathDialogHide());
  onCommit = () =>
    this.props.dispatch(
      pathProblemChangeRequest(this.props.pathId, this.state)
    );

  render() {
    const { problem, open } = this.props;

    return (
      <Dialog fullWidth onClose={this.onClose} open={open}>
        <DialogTitle>
          {problem && problem.id ? "Edit Problem" : "Add New Problem"}
        </DialogTitle>
        <DialogContent
          style={{
            width: 480
          }}
        >
          <TextField
            autoFocus
            defaultValue={problem && problem.name}
            fullWidth
            label="Name"
            margin="dense"
            onChange={e => this.onFieldChange("name", e.target.value)}
            onKeyPress={this.catchReturn}
            required
          />
          <TextField
            defaultValue={problem && problem.type}
            fullWidth
            label="Type"
            margin="dense"
            onChange={e => this.onFieldChange("type", e.target.value)}
            select
            value={this.state.type || "text"}
          >
            <MenuItem value="text">Text</MenuItem>
            <MenuItem value="jupyter">Jupyter Notebook</MenuItem>
            <MenuItem value="youtube">YouTube</MenuItem>
          </TextField>
          {this.getTypeSpecificElements()}
        </DialogContent>
        <DialogActions>
          <Button color="secondary" onClick={this.onClose}>
            Cancel
          </Button>
          <Button color="primary" onClick={this.onCommit} variant="raised">
            Commit
          </Button>
        </DialogActions>
      </Dialog>
    );
  }
}

export default ProblemDialog;
