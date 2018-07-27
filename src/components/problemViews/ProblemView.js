/**
 * @file ProblemView container module
 * @author Theodor Shaytanov <theodor.shaytanov@gmail.com>
 * @created 11.03.18
 */
/* eslint-disable react/display-name */

import React from "react";
import PropTypes from "prop-types";
import TextProblem from "./TextProblem";

import JupyterProblem from "../../components/problemViews/JupyterProblem";
import JupyterInlineProblem from "../../components/problemViews/JupyterInlineProblem";
import YouTubeProblem from "../../components/problemViews/YouTubeProblem";
import AddJestSolutionDialog from "../dialogs/AddJestSolutionDialog"

const views = {
  text: TextProblem,
  jupyter: JupyterProblem,
  jupyterInline: JupyterInlineProblem,
  youtube: YouTubeProblem,
  jest : AddJestSolutionDialog
};


class ProblemView extends React.PureComponent {
  static propTypes = {
    dispatch: PropTypes.func,
    match: PropTypes.object,
    pathProblem: PropTypes.any,
    onProblemChange: PropTypes.func.isRequired,
    solution: PropTypes.any,
  };
  state={
    open : true
  }
  handleClose=()=>{
    this.setState({ open : false});
  }
  componentWillReceiveProps(){
    this.setState({ open : true});
  }
  render() {
    const { dispatch, onProblemChange, pathProblem, solution } = this.props;
    let SpecificView = views[pathProblem.type];
    const extraProps=pathProblem.type==="jest" ? {
        onClose: this.handleClose,
        onCommit: ()=>{},
        open: this.state.open,
        solution: {},
        taskId: ""
    } : {};
    if (!SpecificView) {
      // noinspection JSUnusedAssignment
      SpecificView = <div>Wrong problem type</div>;
    }

    // debugger;
    if (!(pathProblem && solution)) {
      return <div>Loading</div>;
    }
    return (
      <div style={{ textAlign: "center", overflowX: "hidden" }}>
        <SpecificView
          dispatch={dispatch}
          onChange={onProblemChange}
          problem={pathProblem}
          solution={solution}
          {...extraProps}
        />
      </div>
    );
  }
}

export default ProblemView;
