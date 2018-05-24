/**
 * @file ProblemQuestion container module
 * @author Theodor Shaytanov <theodor.shaytanov@gmail.com>
 * @created 10.03.18
 */

import React from "react";
import PropTypes from "prop-types";
import TextField from "@material-ui/core/TextField";
import { YOUTUBE_QUESTIONS } from "../services/paths";

class ProblemQuestion extends React.PureComponent {
  static propTypes = {
    label: PropTypes.string,
    setAnswer: PropTypes.func.isRequired,
    solution: PropTypes.any,
    question: PropTypes.string.isRequired
  };

  state = {
    answer: ""
  };

  render() {
    const { label, setAnswer, solution, question } = this.props;

    const defaultValue =
      solution &&
      ((solution.originalSolution &&
        solution.originalSolution.value &&
        solution.originalSolution.value.answers &&
        solution.originalSolution.value.answers[question]) ||
        (solution.id && solution.id.answers && solution.id.answers[question]));

    return (
      <TextField
        defaultValue={defaultValue}
        fullWidth
        label={label || YOUTUBE_QUESTIONS[question]}
        margin="normal"
        multiline
        onChange={e => setAnswer(question, e.target.value)}
      />
    );
  }
}

export default ProblemQuestion;
