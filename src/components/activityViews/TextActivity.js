/**
 * @file TextActivity container module
 * @author Theodor Shaytanov <theodor.shaytanov@gmail.com>
 * @created 23.06.18
 */

import React, { Fragment } from "react";
import PropTypes from "prop-types";

import TextField from "@material-ui/core/TextField";
import Typography from "@material-ui/core/Typography";

class TextActivity extends React.PureComponent {
  static propTypes = {
    onChange: PropTypes.func.isRequired,
    problem: PropTypes.object,
    solution: PropTypes.object
  };

  onChangeSolution = e => this.props.onChange({ value: e.target.value });

  render() {
    const { problem, solution } = this.props;

    return (
      <Fragment>
        <Typography align="left" gutterBottom variant="headline">
          {problem.question}
        </Typography>
        <TextField
          autoFocus
          defaultValue={(solution && solution.value) || ""}
          fullWidth
          label="Solution"
          multiline
          onChange={this.onChangeSolution}
          style={{
            marginBottom: 4
          }}
        />
      </Fragment>
    );
  }
}

export default TextActivity;
