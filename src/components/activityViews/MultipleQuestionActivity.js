import React from "react";
import PropTypes from "prop-types";

import Button from "@material-ui/core/Button";
import Typography from "@material-ui/core/Typography";

export class MultipleQuestionActivity extends React.PureComponent {
  static propTypes = {
    problem: PropTypes.object.isRequired,
    solution: PropTypes.any,
    noForce: PropTypes.bool,
    onCommit: PropTypes.func.isRequired
  };
  componentDidMount(){
    this.props.setProblemOpenTime && this.props.setProblemOpenTime(this.props.problem.problemId, (new Date()).getTime());
  }

  render() {
    const { noForce, onCommit, problem, solution } = this.props;

    return (
      <React.Fragment>
        <Typography align="justify">
          {problem.multipleQuestion || problem.question}
        </Typography>
        {Object.keys(problem.options || {}).map(id => (
          <Button
            fullWidth={true}
            key={id}
            onClick={
              noForce ? () => onCommit(id) : () => this.onOptionClick(id)
            }
            variant={solution === id ? "contained" : "text"}
          >
            {problem.options[id].caption}
          </Button>
        ))}
      </React.Fragment>
    );
  }

  onOptionClick = id => {
    this.props.onCommit({
      forceSolution: true,
      solution: {
        id
      }
    });
  };
}
