import * as React from "react";
import { compose } from "redux";
import { connect } from "react-redux";
import { Prompt, withRouter } from "react-router-dom";
import PropTypes from "prop-types";

import withStyles from "@material-ui/core/styles/withStyles";

import Fab from "@material-ui/core/Fab";
import Grid from "@material-ui/core/Grid";
import LinearProgress from "@material-ui/core/LinearProgress";
import MenuItem from "@material-ui/core/MenuItem";
import TextField from "@material-ui/core/TextField";
import Typography from "@material-ui/core/Typography";
import Zoom from "@material-ui/core/Zoom";

import SaveIcon from "@material-ui/icons/Save";

import Breadcrumbs from "../../components/Breadcrumbs";
import { ImportDialog } from "../../components/dialogs/ImportDialog";
import JupyterTaskSettingsForm from "../../components/forms/JupyterTaskSettingsForm";
import JupyterTaskPreviewForm from "../../components/forms/JupyterTaskPreviewForm";

import { taskOpen, taskSaveRequest, taskRunRequest } from "./actions";
import { sagaInjector } from "../../services/saga";
import { sagas } from "./sagas";
import { TASK_TYPES, tasksService } from "../../services/tasks";
import { CustomTaskSettingsForm } from "../../components/forms/CustomTaskSettingsForm";
import { CustomTaskPreviewForm } from "../../components/forms/CustomTaskPreviewForm";

const RANDOM_RADIX = 32;

const styles = () => ({
  fabButton: { position: "fixed", bottom: 24, right: 24 },
  mainColumn: { height: "100%" }
});

class Task extends React.PureComponent {
  static propTypes = {
    classes: PropTypes.shape({
      fabButton: PropTypes.string,
      mainColumn: PropTypes.string
    }),
    isRunning: PropTypes.bool,
    match: PropTypes.shape({
      params: PropTypes.shape({
        taskId: PropTypes.string
      })
    }),
    onTaskOpen: PropTypes.func,
    onTaskRunRequest: PropTypes.func,
    onTaskSaveRequest: PropTypes.func,
    presets: PropTypes.array,
    response: PropTypes.any,
    task: PropTypes.any
  };

  state = {
    changes: {},
    userView: true,
    isChanged: false
  };

  componentDidMount() {
    this.props.onTaskOpen(this.props.match.params.taskId);
  }

  /**
   * Returns data for current task from existing task, changes and preset
   * combination
   */
  getTaskInfo = () => {
    const { match, presets, response } = this.props;
    const { changes, presetId } = this.state;
    const task = this.props.task || {};
    const preset = (presets || []).find(
      preset => preset.id === presetId || task.presetId || "basic"
    );

    if (!preset || (match.params.taskId !== "new" && !task.name)) {
      return false;
    }

    return tasksService.getTaskInfo(
      match.params.taskId,
      task,
      changes,
      preset,
      response
    );
  };

  /**
   * Returns notebook JSON in Jupyter Notebook format
   *
   * @param {Object} taskInfo
   * @param {Boolean} [persistentOnly] flag that removes cells after editable
   * @param {Boolean} [userView] flag that ignores hiding at all
   */
  generatePreview = (taskInfo, persistentOnly, userView) => {
    return {
      nbformat: 4,
      nbformat_minor: 0,
      metadata: {
        language_info: {
          name: "python"
        }
      },
      cells: taskInfo.json
        .map(cell => ({
          ...cell,
          source:
            userView && cell.metadata && cell.metadata.hide === "code"
              ? []
              : cell.source,
          outputs: cell.outputs,
          metadata: {
            ...(cell.metadata || {}),
            id: Math.random().toString(RANDOM_RADIX),
            colab_type: cell.cell_type === "code" ? "code" : "text"
          }
        }))
        .filter(cell =>
          userView ? cell.metadata && cell.metadata.hide !== "all" : true
        )
        .slice(0, persistentOnly ? taskInfo.editable : undefined)
    };
  };

  getJupyterNotebookSolution = taskInfo => ({
    json: this.generatePreview(taskInfo, false, this.state.userView)
  });

  getTaskSettingsForm = taskInfo => {
    switch (taskInfo.type) {
      case TASK_TYPES.custom.id:
        return (
          <CustomTaskSettingsForm
            onChange={this.onChange}
            presets={this.props.presets}
            taskInfo={taskInfo}
          />
        );
      default:
        return (
          <JupyterTaskSettingsForm
            onChange={this.onChange}
            presets={this.props.presets}
            taskInfo={taskInfo}
          />
        );
    }
  };

  getTaskPreviewForm = taskInfo => {
    const { isRunning, onTaskRunRequest } = this.props;
    const { isChanged, userView } = this.state;
    switch (taskInfo.type) {
      case TASK_TYPES.custom.id:
        return (
          <CustomTaskPreviewForm
            isChanged={isChanged}
            isRunning={isRunning}
            onChange={this.onChange}
            onTaskRunRequest={onTaskRunRequest}
            taskInfo={taskInfo}
            userView={userView}
          />
        );
      default:
        return (
          <JupyterTaskPreviewForm
            isChanged={isChanged}
            isRunning={isRunning}
            onChange={this.onChange}
            onTaskRunRequest={onTaskRunRequest}
            taskInfo={taskInfo}
            userView={userView}
          />
        );
    }
  };

  onChangeField = field => e =>
    this.setState({
      isChanged: true,
      changes: { ...this.state.changes, [field]: e.target.value }
    });

  onChange = state => this.setState(state);

  onSave = () => {
    const taskInfo = this.getTaskInfo();
    if (taskInfo.json.editable) {
      this.props.onTaskSaveRequest(this.props.match.params.taskId, {
        ...this.state.changes,
        name: this.state.changes.name || taskInfo.name,
        type: taskInfo.type,
        json: taskInfo.json,
        editable: taskInfo.json.editable
      });
    } else {
      this.props.onTaskSaveRequest(this.props.match.params.taskId, {
        ...this.state.changes,
        name: this.state.changes.name || taskInfo.name,
        type: taskInfo.type,
        json: taskInfo.json
      });
    }
    this.setState({
      isChanged: false
    });
  };

  render() {
    const { classes, isRunning, task } = this.props;
    const { isChanged } = this.state;
    const taskInfo = this.getTaskInfo();

    if (!taskInfo) {
      return <LinearProgress />;
    }

    return (
      <React.Fragment>
        <Breadcrumbs
          paths={[
            { label: "Advanced Activities", link: "/advanced" },
            { label: (task && task.name) || "New Task" }
          ]}
        />
        <Grid container spacing={8}>
          <Grid
            className={classes.mainColumn}
            container
            item
            lg={6}
            spacing={8}
            xs={12}
          >
            <Grid item xs={12}>
              <Typography variant="h6">Task settings</Typography>
            </Grid>
            <Grid item xs={6}>
              <TextField
                fullWidth
                label="Type"
                onChange={this.onChangeField("type")}
                select
                value={taskInfo.type}
              >
                {Object.keys(TASK_TYPES).map(id => (
                  <MenuItem key={id} value={id}>
                    {TASK_TYPES[id].name}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>
            {this.getTaskSettingsForm(taskInfo)}
          </Grid>
          <Grid
            className={classes.mainColumn}
            container
            item
            lg={6}
            spacing={8}
            xs={12}
          >
            <Grid item xs={12}>
              <Typography variant="h6">Preview settings</Typography>
            </Grid>
            {this.getTaskPreviewForm(taskInfo)}
          </Grid>
        </Grid>
        <Zoom in={isChanged && !isRunning}>
          <Fab
            aria-label="Add"
            className={classes.fabButton}
            color="primary"
            disabled={isRunning}
            onClick={this.onSave}
          >
            <SaveIcon />
          </Fab>
        </Zoom>
        <ImportDialog onFile open={false} />
        <Prompt
          message="All your unsaved changes will be lost"
          when={isChanged}
        />
      </React.Fragment>
    );
  }
}

sagaInjector.inject(sagas);

const mapStateToProps = (state, ownProps) => ({
  isRunning: state.task.isRunning,
  presets: state.task.presets,
  task: state.task.tasks[ownProps.match.params.taskId],
  response: state.task.currentResponse
});

const mapDispatchToProps = {
  onTaskOpen: taskOpen,
  onTaskRunRequest: taskRunRequest,
  onTaskSaveRequest: taskSaveRequest
};

export default compose(
  withStyles(styles),
  withRouter,
  connect(
    mapStateToProps,
    mapDispatchToProps
  )
)(Task);
