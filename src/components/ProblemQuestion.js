/**
 * @file ProblemQuestion container module
 * @author Theodor Shaytanov <theodor.shaytanov@gmail.com>
 * @created 10.03.18
 */

import React from "react";
import PropTypes from "prop-types";
import TextField from "material-ui/TextField";
import { YOUTUBE_QUESTIONS } from "../services/paths";

class ProblemQuestion extends React.PureComponent {
  static propTypes = {
    question: PropTypes.string.isRequired,
    setAnswer: PropTypes.func.isRequired
  };

  state = {
    answer: ""
  };

  render() {
    const { setAnswer, question } = this.props;
    return (
      <TextField
        fullWidth
        label={YOUTUBE_QUESTIONS[question]}
        margin="normal"
        multiline
        onChange={e => setAnswer(question, e.target.value)}
      />
    );
  }
}

export default ProblemQuestion;
