/**
 * @file AddCohortDialog container module
 * @author Theodor Shaytanov <theodor.shaytanov@gmail.com>
 * @created 22.02.18
 */
import React from "react";
import PropTypes from "prop-types";

import Button from "@material-ui/core/Button";
import Checkbox from "@material-ui/core/Checkbox";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogTitle from "@material-ui/core/DialogTitle";
import FormControl from "@material-ui/core/FormControl";
import Input from "@material-ui/core/Input";
import InputLabel from "@material-ui/core/InputLabel";
import ListItemText from "@material-ui/core/ListItemText";
import ListSubheader from "@material-ui/core/ListSubheader";
import MenuItem from "@material-ui/core/MenuItem";
import Select from "@material-ui/core/Select";
import TextField from "@material-ui/core/TextField";
import {
  addCohortDialogHide,
  addCohortRequest
} from "../../containers/Cohorts/actions";

// RegExp rules
import { AddName, NoStartWhiteSpace } from "../regexp-rules/RegExpRules";

const ITEMS_HEIGHT = 216;
const ITEM_PADDING_TOP = 8;

class AddCohortDialog extends React.PureComponent {
  static propTypes = {
    cohort: PropTypes.object,
    dispatch: PropTypes.func.isRequired,
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
    this.props.dispatch(addCohortDialogHide());
  };

  onCommit = () => {
    const { cohort, dispatch } = this.props;
    dispatch(
      addCohortRequest({
        ...cohort,
        name: this.state.cohortName,
        description: this.state.cohortDescription,
        threshold: Number(this.state.threshold || cohort.threshold || 1),
        paths: this.getPaths()
      })
    );
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
          <FormControl disabled={!(myPaths && publicPaths)} fullWidth>
            <InputLabel htmlFor="select-multiple-checkbox">Paths</InputLabel>
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
              multiple
              onChange={this.handleChange}
              renderValue={selected =>
                selected
                  .map(id => (myPaths[id] || publicPaths[id] || {}).name || "")
                  .join(", ")
              }
              value={paths}
            >
              {myPaths && (
                <ListSubheader
                  component="div"
                  disableSticky
                  style={{ outlineWidth: 0 }}
                >
                  Own Paths
                </ListSubheader>
              )}
              {myPaths &&
                Object.keys(myPaths).map(id => (
                  <MenuItem key={id} value={id}>
                    <Checkbox checked={paths.indexOf(id) > -1} />
                    <ListItemText primary={myPaths[id].name} />
                  </MenuItem>
                ))}
              {publicPaths && (
                <ListSubheader
                  component="div"
                  disableSticky
                  style={{ outlineWidth: 0 }}
                >
                  Public Paths
                </ListSubheader>
              )}
              {publicPaths &&
                Object.keys(publicPaths).map(id => (
                  <MenuItem key={id} value={id}>
                    <Checkbox checked={paths.indexOf(id) > -1} />
                    <ListItemText primary={publicPaths[id].name} />
                  </MenuItem>
                ))}
            </Select>
          </FormControl>
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
            variant="raised"
          >
            Commit
          </Button>
        </DialogActions>
      </Dialog>
    );
  }
}

export default AddCohortDialog;
