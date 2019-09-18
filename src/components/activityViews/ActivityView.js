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

import JupyterActivity from "./JupyterColabActivity";
import JupyterInlineActivity from "./JupyterInlineActivity";
import AdvancedActivity from "./AdvancedActivity";
import YouTubeActivity from "./YouTubeActivity";

import AddJestSolutionDialog from "../dialogs/AddJestSolutionDialog";
//import AddGameSolutionDialog from "../dialogs/AddGameSolutionDialog";
import CodeCombatActivity from "./CodeCombatActivity";
import { MultipleQuestionActivity } from "./MultipleQuestionActivity";

const views = {
  text: TextActivity,
  multipleQuestion: MultipleQuestionActivity,
  profile: ProfileActivity,
  jupyter: JupyterActivity,
  jupyterInline: JupyterInlineActivity,
  jupyterLocal: AdvancedActivity,
  youtube: YouTubeActivity,
  jest: AddJestSolutionDialog,
  //game: AddGameSolutionDialog,
  codeCombat: CodeCombatActivity,
  codeCombatNumber: CodeCombatActivity,
  codeCombatMultiPlayerLevel: CodeCombatActivity
};

class ActivityView extends React.PureComponent {
  static propTypes = {
    uid: PropTypes.string,
    disabledCommitBtn: PropTypes.bool,
    dispatch: PropTypes.func,
    pathProblem: PropTypes.any,
    onClose: PropTypes.func,
    onCommit: PropTypes.func,
    onProblemChange: PropTypes.func.isRequired,
    problemSolutionAttemptRequest: PropTypes.func,
    readOnly: PropTypes.bool,
    setProblemOpenTime: PropTypes.func,
    solution: PropTypes.any,
    userAchievements: PropTypes.any
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
  UNSAFE_componentWillReceiveProps() {
    // this will call setState needlessly
    const service = this.props.pathProblem.service || "CodeCombat";
    this.setState({ open: true });
    if (
      this.props.pathProblem.type === "profile" &&
      this.props.userAchievements &&
      this.props.userAchievements[service] &&
      this.props.userAchievements[service].id
    ) {
      this.props.onCommit({
        type: "SOLUTION",
        solution: {
          value: this.props.userAchievements[service].id
        }
      });
    }
  }
  render() {
    const {
      uid,
      disabledCommitBtn,
      dispatch,
      onClose,
      onProblemChange,
      onCommit,
      pathProblem,
      solution,
      readOnly,
      userAchievements,
      problemSolutionAttemptRequest,
      setProblemOpenTime
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
      return <div>Wrong activity type</div>;
    }

    if (!solution) {
      return <div>Loading</div>;
    }
    return (
      <div style={{ textAlign: "center", overflowX: "hidden" }}>
        <SpecificView
          uid={uid}
          disabledCommitBtn={disabledCommitBtn}
          dispatch={dispatch}
          onChange={onProblemChange}
          onClose={onClose}
          onCommit={onCommit}
          problem={pathProblem}
          problemSolutionAttemptRequest={problemSolutionAttemptRequest}
          readOnly={readOnly}
          setProblemOpenTime={setProblemOpenTime}
          solution={solution}
          userAchievements={userAchievements}
          {...extraProps}
        />
      </div>
    );
  }
}

export default ActivityView;
