import React, { Fragment } from "react";
import PropTypes from "prop-types";

import withStyles from "@material-ui/core/styles/withStyles";

import Button from "@material-ui/core/Button";
import Checkbox from "@material-ui/core/Checkbox";
import Grid from "@material-ui/core/Grid";
import IconButton from "@material-ui/core/IconButton";
import TextField from "@material-ui/core/TextField";
import Typography from "@material-ui/core/Typography";

import DeleteIcon from "@material-ui/icons/Delete";

const styles = () => ({
  optionActions: {
    width: 120
  },
  optionLabel: {
    flexGrow: 1
  }
});

const DEFAULT_OPTIONS_COUNT = 8;
const defaultOptions = Object.assign(
  {},
  ...Array(DEFAULT_OPTIONS_COUNT)
    .fill()
    .map((value, index) => ({
      [`id${index}`]: {
        id: `id${index}`,
        caption: `Option ${index + 1}`,
        correct: !index
      }
    }))
);

class MultipleQuestionsForm extends React.PureComponent {
  static propTypes = {
    activity: PropTypes.any,
    changes: PropTypes.any,
    classes: PropTypes.shape({
      optionActions: PropTypes.string,
      optionLabel: PropTypes.string
    }),
    onFieldChange: PropTypes.func
  };

  getOptions = () =>
    this.props.changes.options ||
    (this.props.activity && this.props.activity.options) ||
    defaultOptions;

  render() {
    const { activity, classes, onFieldChange } = this.props;
    const options = this.getOptions() || {};
    return (
      <Fragment>
        <TextField
          fullWidth
          label="Question"
          margin="normal"
          onChange={e => {
            onFieldChange("multipleQuestion", e.target.value);
          }}
          value={activity.multipleQuestion || ""}
        />
        <Typography variant="h6">Options:</Typography>
        {!Object.keys(options).length && (
          <Typography color="secondary">Missing options</Typography>
        )}
        <Grid container>
          {Object.keys(options).map(id => (
            <Fragment key={id}>
              <Grid className={classes.optionLabel} item>
                <TextField
                  fullWidth
                  onChange={value => this.onOptionChange(id, value)}
                  value={options[id].caption || ""}
                />
              </Grid>
              <Grid className={classes.optionActions} item>
                <Checkbox
                  checked={options[id].correct}
                  onChange={() => this.onSetOptionCorrect(id)}
                  readOnly={options[id].correct}
                />
                {!options[id].correct && (
                  <IconButton onClick={() => this.onRemoveOptionClick(id)}>
                    <DeleteIcon />
                  </IconButton>
                )}
              </Grid>
            </Fragment>
          ))}
        </Grid>
        <Button onClick={this.onAddOption}>Add Option</Button>
      </Fragment>
    );
  }

  onAddOption = () => {
    let newId = 0;
    for (const option of Object.keys(this.getOptions())) {
      newId = Math.max(Number(option.id), Number(newId));
    }
    this.props.onFieldChange("options", {
      ...this.getOptions(),
      [`id${newId + 1}`]: {
        id: newId + 1,
        caption: "New Option"
      }
    });
  };

  onRemoveOptionClick = id =>
    this.props.onFieldChange(
      "options",
      Object.assign(
        {},
        ...Object.keys(this.getOptions() || {})
          .filter(optionId => optionId !== id)
          .map(optionId => ({ [optionId]: this.getOptions()[optionId] }))
      )
    );

  onSetOptionCorrect = id =>
    this.props.onFieldChange(
      "options",
      Object.assign(
        {},
        ...Object.keys(this.getOptions() || {}).map(optionId => ({
          [optionId]: {
            ...this.getOptions()[optionId],
            correct:
              id === optionId ? !this.getOptions()[optionId].correct : false
          }
        }))
      )
    );

  onOptionChange = (id, e) =>
    this.props.onFieldChange("options", {
      ...this.getOptions(),
      [id]: {
        ...this.getOptions()[id],
        caption: e.target.value
      }
    });
}

export default withStyles(styles)(MultipleQuestionsForm);
