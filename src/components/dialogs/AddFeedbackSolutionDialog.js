/**
 * @file AddFeedbackSolutionDialog container module
 * @author Shun <alsnsg@nus.edu.sg>
 * @created 22.08.19
 */

import React from "react";
import PropTypes from "prop-types";

import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogTitle from "@material-ui/core/DialogTitle";

import Radio from "@material-ui/core/Radio";
import RadioGroup from "@material-ui/core/RadioGroup";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import FormControl from "@material-ui/core/FormControl";
import FormLabel from "@material-ui/core/FormLabel";

class AddFeedbackSolutionDialog extends React.PureComponent {
  static propTypes = {
    onClose: PropTypes.func.isRequired,
    onCommit: PropTypes.func.isRequired,
    open: PropTypes.bool.isRequired,
    taskId: PropTypes.string,
    problem: PropTypes.object,
    setProblemOpenTime: PropTypes.func
  };

  state = {
    solution: ""
  };

  componentDidUpdate(prevProps) {
    // eslint-disable-next-line no-unused-expressions
    if (
      JSON.stringify(prevProps.problem) !== JSON.stringify(this.props.problem)
    ) {
      // eslint-disable-next-line no-unused-expressions
      this.props.problem &&
        this.props.setProblemOpenTime &&
        this.props.setProblemOpenTime(
          this.props.problem.id,
          new Date().getTime()
        );
    }
  }

  onChangeHandler = event => {
    this.setState({ ...this.state, solution: event.target.value });
  };
  render() {
    const { onClose, onCommit, open, taskId } = this.props;
    return (
      <Dialog onClose={onClose} open={open}>
        <DialogTitle>
          How likely are you to recommend this path to co-worker or friend?
        </DialogTitle>
        <DialogContent>
          <FormControl component="fieldset">
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <FormLabel component="legend">Not at all likely</FormLabel>
              <FormLabel component="legend">Extremely likely</FormLabel>
            </div>
            <RadioGroup
              aria-label="position"
              name="position"
              onChange={this.onChangeHandler}
              row
              style={{ flexWrap: "nowrap" }}
              value={this.state.solution}
            >
              {[...Array(10).keys()]
                .map(number => (number + 1).toString())
                .map(number => (
                  <FormControlLabel
                    control={<Radio color="primary" />}
                    key={number}
                    label={number}
                    labelPlacement="top"
                    style={{ margin: "0px" }}
                    value={number}
                  />
                ))}
            </RadioGroup>
          </FormControl>
        </DialogContent>
        <DialogActions>
          <Button color="secondary" onClick={onClose}>
            Cancel
          </Button>
          <Button
            color="primary"
            disabled={!this.state.solution}
            onClick={() => {
              onCommit(this.state.solution.trim(), taskId);
            }}
            variant="contained"
          >
            Commit
          </Button>
        </DialogActions>
      </Dialog>
    );
  }
}

export default AddFeedbackSolutionDialog;
