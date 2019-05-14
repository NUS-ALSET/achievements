import * as React from "react";
import PropTypes from "prop-types";
import { TASK_TYPES } from "../../services/tasks";
import JupyterLocalActivity from "./JupyterLocalActivity";
import CustomLocalActivity from "./CustomLocalActivity";

export class LocalTaskActivity extends React.PureComponent {
  static propTypes = {
    dispatch: PropTypes.func,
    onChange: PropTypes.func,
    onCommit: PropTypes.func,
    problem: PropTypes.any,
    readOnly: PropTypes.bool,
    solution: PropTypes.object
  };
  render() {
    const { problem } = this.props;
    switch (problem && problem.taskInfo && problem.taskInfo.type) {
      case TASK_TYPES.jupyter.id:
        return <JupyterLocalActivity {...this.props} />;
      case TASK_TYPES.custom.id:
        return <CustomLocalActivity {...this.props} />;
      default:
        return <div>Wrong task type</div>;
    }
  }
}

export default LocalTaskActivity;
