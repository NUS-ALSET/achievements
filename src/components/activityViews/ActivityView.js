/**
 * @file ActivityView container module
 * @author Theodor Shaytanov <theodor.shaytanov@gmail.com>
 * @created 11.03.18
 */
/* eslint-disable react/display-name */

import React from "react";
import PropTypes from "prop-types";
import TextActivity from "./TextActivity";
import ProfileActivity from "./ProfileActivity";

import JupyterProblem from "./JupyterColabActivity";
import JupyterInlineProblem from "./JupyterInlineActivity";
import YouTubeProblem from "./YouTubeActivity";

import AddJestSolutionDialog from "../dialogs/AddJestSolutionDialog";
import AddGameSolutionDialog from "../dialogs/AddGameSolutionDialog";
import CodeCombatActivity from "./CodeCombatActivity";

const views = {
  text: TextActivity,
  profile: ProfileActivity,
  jupyter: JupyterProblem,
  jupyterInline: JupyterInlineProblem,
  youtube: YouTubeProblem,
  jest: AddJestSolutionDialog,
  game: AddGameSolutionDialog,
  codeCombat : CodeCombatActivity,
  codeCombatNumber : CodeCombatActivity,
  codeCombatMultiPlayerLevel: CodeCombatActivity
};

class ActivityView extends React.PureComponent {
  static propTypes = {
    dispatch: PropTypes.func,
    match: PropTypes.object,
    pathProblem: PropTypes.any,
    onProblemChange: PropTypes.func.isRequired,
    solution: PropTypes.any,
    readOnly: PropTypes.bool
  };
  state = {
    open: true
  };
  handleClose = () => {
    this.setState({ open: false });
    this.props.onClose();
  };
  // TODO: this lifecycle method needs to
  // 1. rewrite to componentDidupdate
  // 2. implement a compare of props and updates
  componentWillReceiveProps(nextProps) {
    // this will call setState needlessly
    this.setState({ open: true });
    if (
      this.props.pathProblem.type === "profile" &&
      this.props.userAchievements &&
      this.props.userAchievements.CodeCombat &&
      this.props.userAchievements.CodeCombat.id
    ) {
      this.props.onCommit({
        type: "SOLUTION",
        solution: {
          value: this.props.userAchievements.CodeCombat.id
        }
      });
    }
  }
  render() {
    const {
      dispatch,
      onClose,
      onProblemChange,
      onCommit,
      pathProblem,
      solution,
      readOnly,
      userAchievements
    } = this.props;
    let SpecificView = views[pathProblem.type];
    const extraProps = ["jest", "jestInline", "game"].includes(pathProblem.type)
      ? {
          onClose: this.handleClose,
          open: this.state.open
        }
      : {};
    if (!SpecificView) {
      // noinspection JSUnusedAssignment
      return <div>Wrong problem type</div>;
    }
    
    if (!(pathProblem && solution)) {
      return <div>Loading</div>;
    }
    return (
      <div style={{ textAlign: "center", overflowX: "hidden" }}>
        <SpecificView
          dispatch={dispatch}
          onChange={onProblemChange}
          onClose={onClose}
          onCommit={onCommit}
          problem={pathProblem}
          readOnly={readOnly}
          solution={solution}
          userAchievements={userAchievements}
          {...extraProps}
        />
      </div>
    );
  }
}

export default ActivityView;
