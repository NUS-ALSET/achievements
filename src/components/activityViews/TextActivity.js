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
    solution: PropTypes.object,
    readOnly: PropTypes.bool,
    setProblemOpenTime: PropTypes.func
  };
  componentDidMount() {
    // eslint-disable-next-line no-unused-expressions
    this.props.setProblemOpenTime &&
      this.props.setProblemOpenTime(
        this.props.problem.problemId,
        new Date().getTime()
      );
  }

  onChangeSolution = e => this.props.onChange({ value: e.target.value });

  render() {
    const { problem, solution, readOnly } = this.props;

    return (
      <Fragment>
        <Typography align="left" gutterBottom variant="h5">
          {problem.question}
        </Typography>
        <TextField
          autoFocus
          defaultValue={(solution && solution.value) || ""}
          disabled={readOnly}
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
