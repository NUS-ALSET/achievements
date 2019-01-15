/**
 * @file AddCohortDialog container module
 * @author Theodor Shaytanov <theodor.shaytanov@gmail.com>
 * @created 22.02.18
 */
import React from "react";
import PropTypes from "prop-types";

import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogTitle from "@material-ui/core/DialogTitle";
import TextField from "@material-ui/core/TextField";

// RegExp rules
import { AddName, NoStartWhiteSpace } from "../regexp-rules/RegExpRules";
import PathsSelector from "../selectors/PathsSelector";

class AddCohortDialog extends React.PureComponent {
  static propTypes = {
    cohort: PropTypes.object,
    onAddCohortRequest: PropTypes.func.isRequired,
    onCloseAddCohortDialg: PropTypes.func.isRequired,
    myPaths: PropTypes.object,
    open: PropTypes.bool.isRequired,
    publicPaths: PropTypes.object
  };

  state = {
    paths: [],
    cohortName: "",
    cohortDescription: "",
    threshold: 1,

    // Cohort name cannot be nonsense or empty spaces
    isCorrectInput: true
  };

  static defaultProps = {
    myPaths: {},
    publicPaths: {}
  };

  getPaths = () => {
    const { cohort } = this.props;
    let paths = this.state.paths;
    if (!paths.length) {
      paths = cohort && cohort.paths;
    }
    return paths || [];
  };

  onNameChange = e => {
    if (
      AddName.test(e.target.value) &&
      NoStartWhiteSpace.test(e.target.value)
    ) {
      this.setState({
        isCorrectInput: true,
        cohortName: e.target.value.trim()
      });
    } else {
      this.setState({
        isCorrectInput: false
      });
    }
  };

  onDescriptionChange = e => {
    const { cohort } = this.props;
    if (cohort && cohort.id) {
      this.setState({
        isCorrectInput: true
      });
    }
    this.setState({ cohortDescription: e.target.value });
  };

  onThresholdChange = e => this.setState({ threshold: e.target.value });

  resetState = () => {
    this.setState({
      cohortName: "",
      cohortDescription: "",
      paths: [],
      isCorrectInput: true,
      threshold: 1
    });
  };

  handleChange = event => {
    this.setState({ paths: event.target.value.filter(id => id) });
  };

  onClose = () => {
    this.resetState();
    this.props.onCloseAddCohortDialg();
  };

  onCommit = () => {
    const { cohort, onAddCohortRequest } = this.props;
    onAddCohortRequest({
      ...cohort,
      name: this.state.cohortName,
      description: this.state.cohortDescription,
      threshold: Number(this.state.threshold || cohort.threshold || 1),
      paths: this.getPaths()
    });
    // reset the disable of commit button
    this.resetState();
  };

  render() {
    const { cohort, open, myPaths, publicPaths } = this.props;
    const paths = this.getPaths();

    return (
      <Dialog onClose={this.onClose} open={open}>
        <DialogTitle>
          {cohort && cohort.id ? "Edit Cohort" : "Add Cohort"}
        </DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            defaultValue={cohort && cohort.name}
            error={!this.state.isCorrectInput}
            fullWidth
            helperText={
              this.state.isCorrectInput
                ? ""
                : "Name should not be empty, too long, have invalid characters"
            }
            label="Name"
            margin="dense"
            onChange={this.onNameChange}
            required
          />
          <TextField
            defaultValue={cohort && cohort.description}
            fullWidth
            label="Description"
            margin="dense"
            onChange={this.onDescriptionChange}
          />
          <PathsSelector
            allowMultiple={true}
            onChange={this.handleChange}
            paths={{
              myPaths,
              publicPaths
            }}
            value={paths}
          />

          <TextField
            defaultValue={cohort && cohort.threshold}
            fullWidth
            label="Credit threshold"
            margin="dense"
            onChange={this.onThresholdChange}
            type="number"
          />
        </DialogContent>
        <DialogActions>
          <Button color="secondary" onClick={this.onClose}>
            Cancel
          </Button>
          <Button
            color="primary"
            disabled={!this.state.isCorrectInput}
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

export default AddCohortDialog;
